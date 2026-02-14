-- SQL for creating and populating the site_content table

-- Create the table
CREATE TABLE `site_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content_key` varchar(255) NOT NULL,
  `content_value` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `content_key` (`content_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Populate the table with default values for the hero and stats sections
INSERT INTO `site_content` (`content_key`, `content_value`) VALUES
('hero_headline', 'Votre Partenaire Stratégique en Ingénierie et Développement'),
('hero_tagline', 'CICESE est un cabinet d’études et de conseil qui offre des services d’ingénierie de haute qualité pour des projets de développement durable en Afrique.'),
('hero_cta1_text', 'Nos Services'),
('hero_cta1_link', 'service.php'),
('hero_cta2_text', 'Nos Projets'),
('hero_cta2_link', 'project.php'),
('stat1_value', '2010'),
('stat1_label', 'Fondation du Cabinet'),
('stat2_value', '60+'),
('stat2_label', 'Professionnels Qualifiés'),
('stat3_value', '4'),
('stat3_label', 'Pays d''Intervention'),
('stat4_value', '100+'),
('stat4_label', 'Bailleurs et Institutions Cibles');
