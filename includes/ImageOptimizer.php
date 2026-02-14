<?php
/**
 * SULOC - Image Optimization Helper
 * Provides functions for image compression and WebP conversion
 */

class ImageOptimizer {
    
    private $maxWidth = 1920;
    private $maxHeight = 1080;
    private $quality = 85;
    private $webpQuality = 80;
    
    /**
     * Optimize an uploaded image
     * @param string $sourcePath Path to source image
     * @param string $destPath Path to save optimized image
     * @return array Result with success status and paths
     */
    public function optimizeImage($sourcePath, $destPath) {
        $result = [
            'success' => false,
            'original' => null,
            'webp' => null,
            'error' => null
        ];
        
        // Get image info
        $imageInfo = getimagesize($sourcePath);
        if (!$imageInfo) {
            $result['error'] = 'Invalid image file';
            return $result;
        }
        
        list($width, $height, $type) = $imageInfo;
        
        // Create image resource based on type
        switch ($type) {
            case IMAGETYPE_JPEG:
                $image = imagecreatefromjpeg($sourcePath);
                break;
            case IMAGETYPE_PNG:
                $image = imagecreatefrompng($sourcePath);
                break;
            case IMAGETYPE_GIF:
                $image = imagecreatefromgif($sourcePath);
                break;
            case IMAGETYPE_WEBP:
                $image = imagecreatefromwebp($sourcePath);
                break;
            default:
                $result['error'] = 'Unsupported image type';
                return $result;
        }
        
        if (!$image) {
            $result['error'] = 'Failed to create image resource';
            return $result;
        }
        
        // Calculate new dimensions if image is too large
        $newWidth = $width;
        $newHeight = $height;
        
        if ($width > $this->maxWidth || $height > $this->maxHeight) {
            $ratio = min($this->maxWidth / $width, $this->maxHeight / $height);
            $newWidth = round($width * $ratio);
            $newHeight = round($height * $ratio);
        }
        
        // Create resized image if needed
        if ($newWidth != $width || $newHeight != $height) {
            $resized = imagecreatetruecolor($newWidth, $newHeight);
            
            // Preserve transparency for PNG and GIF
            if ($type == IMAGETYPE_PNG || $type == IMAGETYPE_GIF) {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
                $transparent = imagecolorallocatealpha($resized, 255, 255, 255, 127);
                imagefilledrectangle($resized, 0, 0, $newWidth, $newHeight, $transparent);
            }
            
            imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resized;
        }
        
        // Save optimized original format
        $pathInfo = pathinfo($destPath);
        $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];
        
        switch ($type) {
            case IMAGETYPE_JPEG:
                $originalPath = $basePath . '.jpg';
                imagejpeg($image, $originalPath, $this->quality);
                break;
            case IMAGETYPE_PNG:
                $originalPath = $basePath . '.png';
                imagepng($image, $originalPath, 9);
                break;
            case IMAGETYPE_GIF:
                $originalPath = $basePath . '.gif';
                imagegif($image, $originalPath);
                break;
            case IMAGETYPE_WEBP:
                $originalPath = $basePath . '.webp';
                imagewebp($image, $originalPath, $this->webpQuality);
                break;
        }
        
        $result['original'] = $originalPath;
        
        // Create WebP version if supported
        if (function_exists('imagewebp')) {
            $webpPath = $basePath . '.webp';
            imagewebp($image, $webpPath, $this->webpQuality);
            $result['webp'] = $webpPath;
        }
        
        imagedestroy($image);
        
        $result['success'] = true;
        return $result;
    }
    
    /**
     * Generate responsive image sizes
     * @param string $sourcePath Path to source image
     * @param string $destDir Directory to save responsive images
     * @param array $sizes Array of sizes [width => suffix]
     * @return array Paths to generated images
     */
    public function generateResponsiveSizes($sourcePath, $destDir, $sizes = []) {
        if (empty($sizes)) {
            $sizes = [
                320 => 'mobile',
                640 => 'tablet',
                1024 => 'desktop',
                1920 => 'large'
            ];
        }
        
        $result = [];
        $imageInfo = getimagesize($sourcePath);
        if (!$imageInfo) {
            return $result;
        }
        
        list($width, $height, $type) = $imageInfo;
        
        // Create image resource
        switch ($type) {
            case IMAGETYPE_JPEG:
                $image = imagecreatefromjpeg($sourcePath);
                break;
            case IMAGETYPE_PNG:
                $image = imagecreatefrompng($sourcePath);
                break;
            default:
                return $result;
        }
        
        if (!$image) {
            return $result;
        }
        
        $pathInfo = pathinfo($sourcePath);
        $filename = $pathInfo['filename'];
        $extension = $pathInfo['extension'];
        
        foreach ($sizes as $targetWidth => $suffix) {
            // Skip if original is smaller
            if ($width <= $targetWidth) {
                continue;
            }
            
            $ratio = $targetWidth / $width;
            $targetHeight = round($height * $ratio);
            
            $resized = imagecreatetruecolor($targetWidth, $targetHeight);
            
            // Preserve transparency
            if ($type == IMAGETYPE_PNG) {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
                $transparent = imagecolorallocatealpha($resized, 255, 255, 255, 127);
                imagefilledrectangle($resized, 0, 0, $targetWidth, $targetHeight, $transparent);
            }
            
            imagecopyresampled($resized, $image, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);
            
            $outputPath = $destDir . '/' . $filename . '-' . $suffix . '.' . $extension;
            
            if ($type == IMAGETYPE_JPEG) {
                imagejpeg($resized, $outputPath, $this->quality);
            } else {
                imagepng($resized, $outputPath, 9);
            }
            
            $result[$suffix] = $outputPath;
            
            imagedestroy($resized);
        }
        
        imagedestroy($image);
        
        return $result;
    }
    
    /**
     * Get picture element HTML with responsive sources
     * @param string $imagePath Base image path
     * @param string $alt Alt text
     * @param array $sizes Responsive sizes
     * @return string HTML picture element
     */
    public function getPictureElement($imagePath, $alt = '', $sizes = []) {
        $pathInfo = pathinfo($imagePath);
        $basePath = $pathInfo['dirname'] . '/' . $pathInfo['filename'];
        
        $html = '<picture>';
        
        // WebP sources
        if (file_exists($basePath . '.webp')) {
            $html .= '<source type="image/webp" srcset="' . htmlspecialchars($basePath . '.webp') . '">';
        }
        
        // Responsive sources
        foreach ($sizes as $size => $suffix) {
            $sizePath = $basePath . '-' . $suffix . '.' . $pathInfo['extension'];
            if (file_exists($sizePath)) {
                $html .= '<source media="(max-width: ' . $size . 'px)" srcset="' . htmlspecialchars($sizePath) . '">';
            }
        }
        
        // Fallback
        $html .= '<img src="' . htmlspecialchars($imagePath) . '" alt="' . htmlspecialchars($alt) . '" loading="lazy">';
        $html .= '</picture>';
        
        return $html;
    }
}
