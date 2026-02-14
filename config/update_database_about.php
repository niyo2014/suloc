<?php
require_once __DIR__ . '/config.php';

function updateDatabaseForAboutSection() {
    $pdo = getDBConnection();
    $message = '';

    try {
        // 1. Create table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS about_content (
                id INT AUTO_INCREMENT PRIMARY KEY,
                section_key VARCHAR(255) NOT NULL UNIQUE,
                section_value TEXT
            )
        ");
        $message .= "Table 'about_content' created or already exists.<br>";

        // 2. Prepare data
        $content = [
            'subtitle' => "Notre Entreprise | L'Historique",
            'title' => "Un Leader en Facilitation Logistique et Services Administratifs",
            'main_text' => "SULOC (Success Logistics Company) a été créé au Burundi en <strong>2010</strong> et est officiellement autorisé depuis le 2 janvier 2017. Nous sommes devenus un <strong>leader</strong> dans la facilitation logistique, l'assistance visa et les services administratifs en Afrique sub-saharienne.",
            'intervention_title' => "Domaines d'Intervention Principaux",
            'intervention_items' => json_encode([
                "Infrastructures sanitaires, de transport et de l'énergie",
                "Aménagements hydroélectriques et agricoles",
                "Approvisionnement en eau et assainissement",
                "Développement rural et sauvegarde environnementale et sociale"
            ]),
            'tech_means_title' => "Moyens Techniques et Logistiques",
            'office_equipment_title' => "Équipements de Bureau",
            'office_equipment_items' => json_encode([
                "10 ordinateurs portables",
                "5 ordinateurs fixes",
                "2 rétro-projecteurs",
                "2 photocopieuses/imprimantes A4-A3",
                "2 scanners",
                "Logiciels de conception"
            ]),
            'field_equipment_title' => "Équipements Terrain",
            'field_equipment_items' => json_encode([
                "2 véhicules tout terrain (4x4)",
                "2 matériels topographiques",
                "Matériels pour prise d'images"
            ]),
            'methodology_subtitle' => "Notre Méthodologie",
            'methodology_title' => "L'Approche Participative au Cœur de la Durabilité",
            'methodology_step1_title' => "1. Consultation Publique et Partenariat",
            'methodology_step1_text' => "La consultation publique et l'engagement des parties prenantes sont essentiels. Les projets sont initiés et suivis avec la <strong>participation des bénéficiaires</strong>. Nous organisons des consultations publiques pour les populations environnantes des sites de projets.",
            'methodology_step2_title' => "2. Pérennisation des Actions",
            'methodology_step2_text' => "Notre approche assure l'appropriation progressive des projets et leur <strong>pérennisation</strong> par les populations vulnérables à la base. Nous privilégions le développement communautaire participatif.",
            'methodology_step3_title' => "3. Conformité Internationale",
            'methodology_step3_text' => "Notre méthodologie est adaptée au contexte de travail et aux exigences des institutions financières internationales comme la <strong>Banque Mondiale</strong> et la <strong>Banque Africaine de Développement</strong>.",
            'admin_org_title' => "Organisation Administrative",
            'transversal_services_title' => "Services Transversaux",
            'transversal_services_items' => json_encode([
                "Administration et finance",
                "Approvisionnement et logistique",
                "Informatique",
                "Gestion des ressources humaines"
            ]),
            'complementary_resources_title' => "Ressources Complémentaires",
            'complementary_resources_items' => json_encode([
                "Expert en communication",
                "Expert en logistique",
                "Équipes d'enquêteurs professionnels"
            ])
        ];

        // 3. Insert data (only if it doesn't exist)
        $stmt = $pdo->prepare("INSERT INTO about_content (section_key, section_value) VALUES (:key, :value) ON DUPLICATE KEY UPDATE section_key=section_key");
        
        $insertedCount = 0;
        foreach ($content as $key => $value) {
            $stmt->execute(['key' => $key, 'value' => $value]);
            if ($stmt->rowCount() > 0) {
                $insertedCount++;
            }
        }
        
        if ($insertedCount > 0) {
            $message .= "Successfully inserted $insertedCount new content entries.<br>";
        } else {
            $message .= "Content already seems to be populated.<br>";
        }

        return "Database update for 'About' section completed successfully!<br>" . $message;

    } catch (PDOException $e) {
        return "Error updating database for 'About' section: " . $e->getMessage();
    }
}

// Execute the function and display the result
echo updateDatabaseForAboutSection();
