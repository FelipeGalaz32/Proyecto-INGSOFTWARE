-- MySQL dump 10.13  Distrib 26.7.0, for Win64 (x86_64)
--
-- Host: localhost    Database: bdprueba
-- ------------------------------------------------------
-- Server version	26.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '265612fa-b5e4-11f1-8d51-9c6b0075baba:1-40';

--
-- Table structure for table `asignaturas_practica`
--

DROP TABLE IF EXISTS `asignaturas_practica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignaturas_practica` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `coordinador_id` bigint DEFAULT NULL,
  `profesor_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKk3xb47lhtyne83iwg778r8eeo` (`codigo`),
  KEY `FK59oab4l3ebh7rechics1xwrxk` (`coordinador_id`),
  KEY `FKicjrrtdj6tkp5wsujvsq474wd` (`profesor_id`),
  CONSTRAINT `FK59oab4l3ebh7rechics1xwrxk` FOREIGN KEY (`coordinador_id`) REFERENCES `coordinadores_practica` (`id`),
  CONSTRAINT `FKicjrrtdj6tkp5wsujvsq474wd` FOREIGN KEY (`profesor_id`) REFERENCES `profesores_asignatura` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignaturas_practica`
--

LOCK TABLES `asignaturas_practica` WRITE;
/*!40000 ALTER TABLE `asignaturas_practica` DISABLE KEYS */;
INSERT INTO `asignaturas_practica` VALUES (1,'PRAC-01','Práctica Pedagógica I',1,1);
/*!40000 ALTER TABLE `asignaturas_practica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatbots`
--

DROP TABLE IF EXISTS `chatbots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatbots` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `modelo` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatbots`
--

LOCK TABLES `chatbots` WRITE;
/*!40000 ALTER TABLE `chatbots` DISABLE KEYS */;
INSERT INTO `chatbots` VALUES (1,'GPT-4o-Mini','Chatbot Pedagogía UBB');
/*!40000 ALTER TABLE `chatbots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colaboradores`
--

DROP TABLE IF EXISTS `colaboradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colaboradores` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `colegio` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKri9jj3oi860ua516fs7t0jmfd` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colaboradores`
--

LOCK TABLES `colaboradores` WRITE;
/*!40000 ALTER TABLE `colaboradores` DISABLE KEYS */;
INSERT INTO `colaboradores` VALUES (1,'Liceo Bicentenario de Chillán','marta.silva@liceo.cl','Marta Silva');
/*!40000 ALTER TABLE `colaboradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coordinadores_practica`
--

DROP TABLE IF EXISTS `coordinadores_practica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coordinadores_practica` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt76wiol50yuugkubek4tws4gj` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coordinadores_practica`
--

LOCK TABLES `coordinadores_practica` WRITE;
/*!40000 ALTER TABLE `coordinadores_practica` DISABLE KEYS */;
INSERT INTO `coordinadores_practica` VALUES (1,'ana.gomez@ubb.cl','Ana Gómez');
/*!40000 ALTER TABLE `coordinadores_practica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiantes`
--

DROP TABLE IF EXISTS `estudiantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiantes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiantes`
--

LOCK TABLES `estudiantes` WRITE;
/*!40000 ALTER TABLE `estudiantes` DISABLE KEYS */;
INSERT INTO `estudiantes` VALUES (1,'juan.perez@alumnos.ubb.cl','Juan Pérez');
/*!40000 ALTER TABLE `estudiantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripciones_practica`
--

DROP TABLE IF EXISTS `inscripciones_practica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripciones_practica` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `periodo` varchar(255) NOT NULL,
  `asignatura_practica_id` bigint DEFAULT NULL,
  `estudiante_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKb0i6slnq0hpoxxal5p48ytsl8` (`asignatura_practica_id`),
  KEY `FKt66fo7m6qik4iqkx0noyhfrlj` (`estudiante_id`),
  CONSTRAINT `FKb0i6slnq0hpoxxal5p48ytsl8` FOREIGN KEY (`asignatura_practica_id`) REFERENCES `asignaturas_practica` (`id`),
  CONSTRAINT `FKt66fo7m6qik4iqkx0noyhfrlj` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripciones_practica`
--

LOCK TABLES `inscripciones_practica` WRITE;
/*!40000 ALTER TABLE `inscripciones_practica` DISABLE KEYS */;
INSERT INTO `inscripciones_practica` VALUES (1,'2026-1',1,1);
/*!40000 ALTER TABLE `inscripciones_practica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notas_voz`
--

DROP TABLE IF EXISTS `notas_voz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notas_voz` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transcripcion` text,
  `url_archivo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas_voz`
--

LOCK TABLES `notas_voz` WRITE;
/*!40000 ALTER TABLE `notas_voz` DISABLE KEYS */;
INSERT INTO `notas_voz` VALUES (1,'El desempeño en el aula fue óptimo, demostró buen dominio de grupo y manejo del contenido.','https://storage.ubb.cl/audios/evaluacion_1.mp3');
/*!40000 ALTER TABLE `notas_voz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pautas_evaluacion`
--

DROP TABLE IF EXISTS `pautas_evaluacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pautas_evaluacion` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nota` double DEFAULT NULL,
  `observaciones` text,
  `colaborador_id` bigint DEFAULT NULL,
  `inscripcion_practica_id` bigint DEFAULT NULL,
  `nota_voz_id` bigint DEFAULT NULL,
  `tutor_universidad_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKo045yfavemrg9rrs3isdu48vn` (`nota_voz_id`),
  KEY `FK1c63u92tkibgsu6137bkhscwv` (`colaborador_id`),
  KEY `FKnxdlbobwc7uxxu8tt08uawccw` (`inscripcion_practica_id`),
  KEY `FKkoh23erinnni7g2pr2t3n3t6i` (`tutor_universidad_id`),
  CONSTRAINT `FK1c63u92tkibgsu6137bkhscwv` FOREIGN KEY (`colaborador_id`) REFERENCES `colaboradores` (`id`),
  CONSTRAINT `FKkoh23erinnni7g2pr2t3n3t6i` FOREIGN KEY (`tutor_universidad_id`) REFERENCES `tutores_universidad` (`id`),
  CONSTRAINT `FKnxdlbobwc7uxxu8tt08uawccw` FOREIGN KEY (`inscripcion_practica_id`) REFERENCES `inscripciones_practica` (`id`),
  CONSTRAINT `FKpkvroxlb1faq2n9jmm4p3ylov` FOREIGN KEY (`nota_voz_id`) REFERENCES `notas_voz` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pautas_evaluacion`
--

LOCK TABLES `pautas_evaluacion` WRITE;
/*!40000 ALTER TABLE `pautas_evaluacion` DISABLE KEYS */;
INSERT INTO `pautas_evaluacion` VALUES (1,6.8,'Práctica sobresaliente en la conducción de la clase de matemáticas.',1,1,1,1);
/*!40000 ALTER TABLE `pautas_evaluacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planificaciones`
--

DROP TABLE IF EXISTS `planificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planificaciones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contenido` text,
  `retroalimentacion` text,
  `titulo` varchar(255) NOT NULL,
  `chatbot_id` bigint DEFAULT NULL,
  `estudiante_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcno5h5ix6uo5dowcbg0toq39k` (`chatbot_id`),
  KEY `FK35bbjvtigtk4fn805av0hjpfb` (`estudiante_id`),
  CONSTRAINT `FK35bbjvtigtk4fn805av0hjpfb` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`),
  CONSTRAINT `FKcno5h5ix6uo5dowcbg0toq39k` FOREIGN KEY (`chatbot_id`) REFERENCES `chatbots` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planificaciones`
--

LOCK TABLES `planificaciones` WRITE;
/*!40000 ALTER TABLE `planificaciones` DISABLE KEYS */;
INSERT INTO `planificaciones` VALUES (1,'Unidad: Triángulos y sus propiedades. Objetivo: Resolver problemas de ángulos.','Excelente estructura de clase. Se recomienda incorporar más actividades participativas en el inicio.','Planificación de Geometría I',1,1);
/*!40000 ALTER TABLE `planificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesores_asignatura`
--

DROP TABLE IF EXISTS `profesores_asignatura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesores_asignatura` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKgtjeit214cfd0u73wq8erbu1e` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesores_asignatura`
--

LOCK TABLES `profesores_asignatura` WRITE;
/*!40000 ALTER TABLE `profesores_asignatura` DISABLE KEYS */;
INSERT INTO `profesores_asignatura` VALUES (1,'carlos.mendoza@ubb.cl','Carlos Mendoza');
/*!40000 ALTER TABLE `profesores_asignatura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tutores_universidad`
--

DROP TABLE IF EXISTS `tutores_universidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutores_universidad` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKm6ikyxsr4hef2o8dvbp6n9nsa` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutores_universidad`
--

LOCK TABLES `tutores_universidad` WRITE;
/*!40000 ALTER TABLE `tutores_universidad` DISABLE KEYS */;
INSERT INTO `tutores_universidad` VALUES (1,'roberto.fuentes@ubb.cl','Roberto Fuentes');
/*!40000 ALTER TABLE `tutores_universidad` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-22 21:28:19
