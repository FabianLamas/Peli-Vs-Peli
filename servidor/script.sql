USE `competencias`;

DROP TABLE IF EXISTS `competicion`;

CREATE TABLE `competicion`(
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(70) NOT NULL DEFAULT '',
  `genero_id` int(11),
  `actor_id` int(11),
  `director` int(11),
  PRIMARY KEY(`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=UTF8;

LOCK TABLES `competicion` WRITE;

INSERT INTO `competicion` VALUES
    (1, 'Cual es la mejor pelicula?', NULL, NULL, NULL),
    (2, 'Que drama te hizo llorar mas?', NULL, NULL, NULL),
    (3, 'Cual es la pelicua mas bizarra?', NULL, NULL, NULL),
    (4, 'Cual es la pelicula que mas te asusto?', NULL, NULL, NULL),
    (5, 'Que comedia te gusto mas?', NULL, NULL, NULL),
    (6, 'Cual pelicula vistes mas veces?', NULL, NULL, NULL),
    (7, 'Que romance te gusto mas?', NULL, NULL, NULL),
    (8, 'Cual es la mejor pelicula de accion?', NULL, NULL, NULL);
UNLOCK TABLES;

DROP TABLE IF EXISTS `votos`;

CREATE TABLE `votos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `competencia_id` int(11) unsigned NOT NULL,
  `pelicula_id` int(11) unsigned NOT NULL,
    `cantidad` int(11),
  PRIMARY KEY (`id`),
  KEY `vp_competencia_id` (`competencia_id`),
  KEY `vp_pelicula_id` (`pelicula_id`),
  CONSTRAINT `vp_competencia_id` FOREIGN KEY (`competencia_id`) REFERENCES `competicion` (`id`),
  CONSTRAINT `vp_pelicula_id` FOREIGN KEY (`pelicula_id`) REFERENCES `pelicula` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
