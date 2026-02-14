-- SQL for creating the 'emails' table for caching and tracking status

CREATE TABLE `emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_uid` int(11) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `from_name` varchar(255) DEFAULT NULL,
  `from_address` varchar(255) NOT NULL,
  `to_address` text NOT NULL,
  `body_html` longtext DEFAULT NULL,
  `body_text` longtext DEFAULT NULL,
  `received_at` datetime NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `is_replied` tinyint(1) NOT NULL DEFAULT 0,
  `is_archived` tinyint(1) NOT NULL DEFAULT 0,
  `has_attachments` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `message_uid` (`message_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
