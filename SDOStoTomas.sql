-- MariaDB dump 10.19  Distrib 10.6.12-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: SDOStoTomas
-- ------------------------------------------------------
-- Server version	10.6.12-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Address`
--

DROP TABLE IF EXISTS `Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Address` (
  `addressId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `address` longtext DEFAULT NULL,
  PRIMARY KEY (`addressId`),
  UNIQUE KEY `Address_id_IDX` (`addressId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Address`
--

LOCK TABLES `Address` WRITE;
/*!40000 ALTER TABLE `Address` DISABLE KEYS */;
INSERT INTO `Address` VALUES (1,'Brgy. Poblacion IV, Sto. Tomas City, Batangas'),(2,'Block 19 Lot 15 Phase IV Mt. Claire Village Subdivision, Brgy. Sta. Anastacia, Sto. Tomas City, Batangas'),(3,'Door 6 Recto Apartment, Levitown Subdivision, Brgy. Marawoy, Lipa City, Batangas'),(14,'Mt. Claire Village'),(15,'Mt. Claire Village'),(16,'Mt. Claire Village'),(17,'Mt. Claire Village'),(18,'Mt. Claire Village'),(19,'San Rafael, Sto. Tomas City'),(20,'San Rafael, Sto. Tomas City'),(21,'San Pedro, Sto. Tomas City'),(22,'San Pedro, Sto. Tomas City'),(23,'San Pedro, Sto. Tomas City'),(24,'San Pedro, Sto. Tomas City'),(25,'San Pedro, Sto. Tomas City'),(26,'San Pedro, Sto. Tomas City'),(27,'San Pedro, Sto. Tomas City'),(28,'San Pedro, Sto. Tomas City'),(29,'San Pedro, Sto. Tomas City'),(30,'San Pedro, Sto. Tomas City'),(31,'San Pedro, Sto. Tomas City'),(32,'San Pedro, Sto. Tomas City'),(33,'San Pedro, Sto. Tomas City'),(34,'San Pedro, Sto. Tomas City'),(35,'San Pedro, Sto. Tomas City'),(36,'San Pedro, Sto. Tomas City'),(37,'San Pedro, Sto. Tomas City'),(38,'San Pedro, Sto. Tomas City'),(39,'San Pedro, Sto. Tomas City'),(40,'San Pedro, Sto. Tomas City'),(41,'San Pedro, Sto. Tomas City'),(42,'San Pedro, Sto. Tomas City'),(43,'San Pedro, Sto. Tomas City'),(44,'San Pedro, Sto. Tomas City'),(45,'San Pedro, Sto. Tomas City'),(46,'San Pedro, Sto. Tomas City'),(47,'San Pedro, Sto. Tomas City'),(48,'San Pedro, Sto. Tomas City'),(49,'San Pedro, Sto. Tomas City'),(50,'San Pedro, Sto. Tomas City'),(51,'San Pedro, Sto. Tomas City'),(52,'San Pedro, Sto. Tomas City'),(53,'San Pedro, Sto. Tomas City'),(54,'San Pedro, Sto. Tomas City'),(55,'San Pedro, Sto. Tomas City'),(56,'San Pedro, Sto. Tomas City'),(57,'San Pedro, Sto. Tomas City'),(58,'San Pedro, Sto. Tomas City'),(59,'San Pedro, Sto. Tomas City'),(60,'San Pedro, Sto. Tomas City'),(61,'San Pedro, Sto. Tomas City'),(62,'San Rafael, Sto. Tomas City'),(63,'Poblacion IV, Sto. Tomas City'),(64,'San Rafael, Sto. Tomas City'),(65,'San Rafael, Sto. Tomas City'),(66,'Poblacion IV, Sto. Tomas City'),(67,'Poblacion IV, Sto. Tomas City'),(68,'Poblacion IV, Sto. Tomas City'),(69,'Poblacion IV, Sto. Tomas City'),(70,'Poblacion IV, Sto. Tomas City'),(71,'Poblacion IV, Sto. Tomas City'),(72,'Poblacion IV, Sto. Tomas City'),(73,'Poblacion IV, Sto. Tomas City'),(74,'Poblacion IV, Sto. Tomas City'),(75,'Poblacion IV, Sto. Tomas City'),(76,'Poblacion IV, Sto. Tomas City'),(77,'Poblacion IV, Sto. Tomas City'),(78,'Poblacion IV, Sto. Tomas City'),(79,'San Rafael, Sto. Tomas City'),(80,'San Rafael, Sto. Tomas City'),(81,'San Rafael, Sto. Tomas City'),(82,'San Pedro, Sto. Tomas City'),(83,'Sta. Clara, Sto. Tomas'),(84,'Sta. Clara, Sto. Tomas'),(86,'Manila'),(87,'Calamba City');
/*!40000 ALTER TABLE `Address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Broad_Location`
--

DROP TABLE IF EXISTS `Broad_Location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Broad_Location` (
  `broad_locationIndex` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `locationId` bigint(20) unsigned NOT NULL,
  `broad_locationId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`broad_locationIndex`),
  UNIQUE KEY `Broad_Location_index_IDX` (`broad_locationIndex`) USING BTREE,
  KEY `Broad_Location_FK` (`locationId`),
  KEY `Broad_Location_FK_1` (`broad_locationId`),
  CONSTRAINT `Broad_Location_FK` FOREIGN KEY (`locationId`) REFERENCES `Location` (`locationId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Broad_Location_FK_1` FOREIGN KEY (`broad_locationId`) REFERENCES `Location` (`locationId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Broad_Location`
--

LOCK TABLES `Broad_Location` WRITE;
/*!40000 ALTER TABLE `Broad_Location` DISABLE KEYS */;
INSERT INTO `Broad_Location` VALUES (1,2,1),(2,3,2),(3,4,2),(4,5,2),(5,6,2),(6,7,1),(7,8,7),(8,9,3),(9,10,3),(10,11,3),(11,12,4),(12,13,10),(13,13,11),(14,14,13),(15,15,12),(16,16,15),(17,17,1),(18,18,17),(19,19,18),(20,20,22),(21,21,20),(22,22,19);
/*!40000 ALTER TABLE `Broad_Location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Contact_Number`
--

DROP TABLE IF EXISTS `Contact_Number`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Contact_Number` (
  `contact_numberId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `personId` bigint(20) unsigned NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `type` enum('Landline','Mobile') NOT NULL DEFAULT 'Mobile',
  PRIMARY KEY (`contact_numberId`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contact_Number`
--

LOCK TABLES `Contact_Number` WRITE;
/*!40000 ALTER TABLE `Contact_Number` DISABLE KEYS */;
INSERT INTO `Contact_Number` VALUES (18,15,' 639153032914','Mobile'),(19,15,'09295015297','Mobile'),(20,16,' 639153032914','Mobile'),(21,16,'09295015297','Mobile'),(22,17,' 639153032914','Mobile'),(23,17,'09295015297','Mobile'),(24,18,' 639153032914','Mobile'),(25,18,'09295015297','Mobile'),(26,19,' 639153032914','Mobile'),(27,19,'09295015297','Mobile'),(28,20,'09314353542344','Mobile'),(30,22,'0985297454','Mobile'),(31,22,'54235254','Mobile'),(32,23,'0985297454','Mobile'),(33,23,'54235254','Mobile'),(34,24,'0985297454','Mobile'),(35,24,'54235254','Mobile'),(36,25,'0985297454','Mobile'),(37,25,'54235254','Mobile'),(38,26,'0985297454','Mobile'),(39,26,'54235254','Mobile'),(40,27,'0985297454','Mobile'),(41,27,'54235254','Mobile'),(42,28,'0985297454','Mobile'),(43,28,'54235254','Mobile'),(44,29,'0985297454','Mobile'),(45,29,'54235254','Mobile'),(46,30,'0985297454','Mobile'),(47,30,'54235254','Mobile'),(48,31,'0985297454','Mobile'),(49,31,'54235254','Mobile'),(50,32,'0985297454','Mobile'),(51,32,'54235254','Mobile'),(52,33,'0985297454','Mobile'),(53,33,'54235254','Mobile'),(54,34,'0985297454','Mobile'),(55,34,'54235254','Mobile'),(56,35,'0985297454','Mobile'),(57,35,'54235254','Mobile'),(58,36,'0985297454','Mobile'),(59,36,'54235254','Mobile'),(60,37,'0985297454','Mobile'),(61,37,'54235254','Mobile'),(62,38,'0985297454','Mobile'),(63,38,'54235254','Mobile'),(64,39,'0985297454','Mobile'),(65,39,'54235254','Mobile'),(66,40,'0985297454','Mobile'),(67,40,'54235254','Mobile'),(76,42,'0985297454','Mobile'),(77,42,'54235254','Mobile'),(78,43,'0985297454','Mobile'),(79,43,'54235254','Mobile'),(80,44,'0985297454','Mobile'),(81,44,'54235254','Mobile'),(82,45,'0985297454','Mobile'),(83,45,'54235254','Mobile'),(84,46,'0985297454','Mobile'),(85,46,'54235254','Mobile'),(86,47,'0985297454','Mobile'),(87,47,'54235254','Mobile'),(88,48,'0985297454','Mobile'),(89,48,'54235254','Mobile'),(90,49,'0985297454','Mobile'),(91,49,'54235254','Mobile'),(92,50,'0985297454','Mobile'),(93,50,'54235254','Mobile'),(94,51,'0985297454','Mobile'),(95,51,'54235254','Mobile'),(96,52,'0985297454','Mobile'),(97,52,'54235254','Mobile'),(98,53,'0985297454','Mobile'),(99,53,'54235254','Mobile'),(100,54,'0985297454','Mobile'),(101,54,'54235254','Mobile'),(102,55,'0985297454','Mobile'),(103,55,'54235254','Mobile'),(104,56,'0985297454','Mobile'),(105,56,'54235254','Mobile'),(108,57,'0985297454','Mobile'),(109,57,'54235254','Mobile'),(114,21,'944324244545','Mobile'),(115,41,'0985297454','Mobile'),(116,41,'54235254','Mobile');
/*!40000 ALTER TABLE `Contact_Number` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Date_Range`
--

DROP TABLE IF EXISTS `Date_Range`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Date_Range` (
  `date_rangeId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date_start` date NOT NULL,
  `date_end` date DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`date_rangeId`),
  UNIQUE KEY `Date_Range_id_IDX` (`date_rangeId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='This table sall hold all kinds of Date Ranges. Deletion of entries shall only be done during DB maintenance procedures.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Date_Range`
--

LOCK TABLES `Date_Range` WRITE;
/*!40000 ALTER TABLE `Date_Range` DISABLE KEYS */;
INSERT INTO `Date_Range` VALUES (1,'2022-02-20','2023-02-19','Term of Service'),(2,'2023-02-20',NULL,'Term of Service'),(3,'2022-01-01','2022-12-31','2022 PM Cycle Non-School-Based'),(4,'2022-08-01','2023-07-31','2022-2023 PM Cycle School-Based'),(5,'2023-01-01','2023-12-31','2023 PM Cycle Non-School-Based'),(6,'2023-02-20',NULL,'Appointment'),(7,'2017-06-10','2023-06-05','Appointment'),(8,'2017-06-10','2020-06-09','Term of Service'),(9,'2020-06-10','2023-06-05','Term of Service'),(10,'2023-06-06','2023-07-05','Appointment'),(11,'2023-06-06','2023-07-05','Term of Service'),(13,'2023-07-06',NULL,'Appointment'),(14,'2023-07-06',NULL,'Term of Service'),(15,'2016-06-10','2023-06-05','Appointment'),(16,'2016-06-10','2020-06-09','Term of Service'),(17,'2023-07-05',NULL,'Appointment'),(18,'2023-07-05',NULL,'Term of Service'),(19,'2015-06-18','2023-06-05','Appointment'),(20,'2015-06-18','2016-03-31','Term of Service'),(21,'2019-09-20','2022-12-20','Appointment'),(22,'2019-09-20','2022-12-20','Term of Service');
/*!40000 ALTER TABLE `Date_Range` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Degree_Taken`
--

DROP TABLE IF EXISTS `Degree_Taken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Degree_Taken` (
  `degree_takenId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `degree` varchar(200) NOT NULL,
  `degree_typeIndex` tinyint(3) unsigned NOT NULL,
  `units_earned` tinyint(3) unsigned DEFAULT NULL,
  `complete_academic_requirements` tinyint(1) DEFAULT NULL,
  `graduation_year` int(10) unsigned DEFAULT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  `year_level_completed` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`degree_takenId`),
  KEY `degree_typeIndex` (`degree_typeIndex`),
  KEY `personId` (`personId`),
  CONSTRAINT `Degree_Taken_ibfk_1` FOREIGN KEY (`degree_typeIndex`) REFERENCES `ENUM_Educational_Attainment` (`index`) ON UPDATE CASCADE,
  CONSTRAINT `Degree_Taken_ibfk_2` FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Degree_Taken`
--

LOCK TABLES `Degree_Taken` WRITE;
/*!40000 ALTER TABLE `Degree_Taken` DISABLE KEYS */;
INSERT INTO `Degree_Taken` VALUES (13,'BS Business Administration',6,NULL,NULL,2020,45,NULL),(14,'MA Business Management',7,NULL,1,NULL,45,NULL),(15,'BS Business Administration',6,NULL,NULL,2020,46,NULL),(16,'MA Business Management',7,NULL,1,NULL,46,NULL),(17,'BS Business Administration',6,NULL,NULL,2020,47,NULL),(18,'MA Business Management',7,NULL,1,NULL,47,NULL),(19,'BS Business Administration',6,NULL,NULL,2020,48,NULL),(20,'MA Business Management',7,NULL,1,NULL,48,NULL),(21,'BS Business Administration',6,NULL,NULL,2020,49,NULL),(22,'MA Business Management',7,NULL,1,NULL,49,NULL),(23,'BS Business Administration',6,NULL,NULL,2020,50,NULL),(24,'MA Business Management',7,NULL,1,NULL,50,NULL),(25,'BS Business Administration',6,NULL,NULL,2020,51,NULL),(26,'MA Business Management',7,NULL,1,NULL,51,NULL),(27,'BS Business Administration',6,NULL,NULL,2020,52,NULL),(28,'MA Business Management',7,NULL,1,NULL,52,NULL),(29,'BS Business Administration',6,NULL,NULL,2020,53,NULL),(30,'MA Business Management',7,NULL,1,NULL,53,NULL),(31,'BS Business Administration',6,NULL,NULL,2020,54,NULL),(32,'MA Business Management',7,NULL,1,NULL,54,NULL),(33,'BS Business Administration',6,NULL,NULL,2020,55,NULL),(34,'MA Business Management',7,NULL,1,NULL,55,NULL),(35,'BS Business Administration',6,NULL,NULL,2020,56,NULL),(36,'MA Business Management',7,NULL,1,NULL,56,NULL),(39,'BS Business Administration',6,NULL,NULL,2020,57,NULL),(40,'MA Business Management',7,NULL,1,NULL,57,NULL),(82,'BSEd',6,NULL,NULL,2010,59,NULL),(83,'MAEd',7,NULL,NULL,2015,59,NULL),(84,'PhD',8,12,NULL,NULL,59,NULL),(87,'BSEd Mathematics',6,NULL,NULL,NULL,21,3),(88,'BS Business Administration',6,NULL,NULL,2020,41,NULL),(89,'MA Business Management',7,NULL,1,NULL,41,NULL),(91,'Bachelor in Secondary Education',6,NULL,NULL,2022,88,NULL);
/*!40000 ALTER TABLE `Degree_Taken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Disability`
--

DROP TABLE IF EXISTS `Disability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Disability` (
  `disabilityId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `disability` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`disabilityId`),
  UNIQUE KEY `Disability_disability_IDX` (`disability`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Disability`
--

LOCK TABLES `Disability` WRITE;
/*!40000 ALTER TABLE `Disability` DISABLE KEYS */;
INSERT INTO `Disability` VALUES (7,'Near-sightedness',NULL);
/*!40000 ALTER TABLE `Disability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ENUM_Civil_Status`
--

DROP TABLE IF EXISTS `ENUM_Civil_Status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ENUM_Civil_Status` (
  `index` tinyint(3) unsigned NOT NULL,
  `civil_status` varchar(20) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ENUM_Civil_Status`
--

LOCK TABLES `ENUM_Civil_Status` WRITE;
/*!40000 ALTER TABLE `ENUM_Civil_Status` DISABLE KEYS */;
INSERT INTO `ENUM_Civil_Status` VALUES (1,'Single',NULL),(2,'Married',NULL),(3,'Divorced',NULL),(4,'Widowed',NULL);
/*!40000 ALTER TABLE `ENUM_Civil_Status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ENUM_Educational_Attainment`
--

DROP TABLE IF EXISTS `ENUM_Educational_Attainment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ENUM_Educational_Attainment` (
  `index` tinyint(3) unsigned NOT NULL,
  `educational_attainment` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ENUM_Educational_Attainment`
--

LOCK TABLES `ENUM_Educational_Attainment` WRITE;
/*!40000 ALTER TABLE `ENUM_Educational_Attainment` DISABLE KEYS */;
INSERT INTO `ENUM_Educational_Attainment` VALUES (0,'None Required',NULL),(1,'Can Read and Write',NULL),(2,'Elementary Graduate',NULL),(3,'Completed Junior High School (K&nbsp;to&nbsp;12)',NULL),(4,'Senior High School Graduate (K&nbsp;to&nbsp;12)/High School Graduate (Old Curriculum)',NULL),(5,'Completed 2 years in College',NULL),(6,'Bachelor\'s Degree',NULL),(7,'Master\'s Degree',NULL),(8,'Doctorate',NULL);
/*!40000 ALTER TABLE `ENUM_Educational_Attainment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ENUM_Emp_Appointment_Status`
--

DROP TABLE IF EXISTS `ENUM_Emp_Appointment_Status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ENUM_Emp_Appointment_Status` (
  `index` tinyint(3) unsigned NOT NULL,
  `appointment_status` varchar(100) NOT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `Emp_Appointent_Status_index_IDX` (`index`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ENUM_Emp_Appointment_Status`
--

LOCK TABLES `ENUM_Emp_Appointment_Status` WRITE;
/*!40000 ALTER TABLE `ENUM_Emp_Appointment_Status` DISABLE KEYS */;
INSERT INTO `ENUM_Emp_Appointment_Status` VALUES (1,'Permanent'),(2,'Probationary'),(3,'Temporary'),(4,'Substitute (Teacher)'),(5,'Job Order (DepEd)'),(6,'Job Order (PSB)'),(7,'Job Order (LSB)');
/*!40000 ALTER TABLE `ENUM_Emp_Appointment_Status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ENUM_Location_Type`
--

DROP TABLE IF EXISTS `ENUM_Location_Type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ENUM_Location_Type` (
  `index` tinyint(3) unsigned NOT NULL,
  `location_type_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `Location_Type_index_IDX` (`index`) USING BTREE,
  UNIQUE KEY `Location_Type_UN` (`location_type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ENUM_Location_Type`
--

LOCK TABLES `ENUM_Location_Type` WRITE;
/*!40000 ALTER TABLE `ENUM_Location_Type` DISABLE KEYS */;
INSERT INTO `ENUM_Location_Type` VALUES (0,'Unknown',NULL),(1,'Country',NULL),(2,'Province',NULL),(3,'City',NULL),(4,'Town','A town is often a municipal unit. It may or may not be a member unit of a city. It may sometimes be promoted into a city through legislation.'),(5,'Barangay','A barangay is the smallest government unit.'),(6,'Barrio/Sitio/Area','A barrio or a sitio is a very small-sized town-like unit that often predates the formation of the modern barangay units. These locations are most probably retained for legacy or historical novelty.'),(7,'Subdivision','A subdivision is formed by realtors as a cluster of real properties, sometimes resembling more modern versions of barrios.'),(8,'Street Address','An address may have two or more street addresses, in cases where the actual home is in a corner or intersection of streets.'),(9,'House No.','A house number or a house address may have details such as the actual house number, building name/number, and room/apartment number. It may optionally have a Block, Lot, and/or Phase numbers.');
/*!40000 ALTER TABLE `ENUM_Location_Type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ENUM_MPASIS_Access_Level`
--

DROP TABLE IF EXISTS `ENUM_MPASIS_Access_Level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ENUM_MPASIS_Access_Level` (
  `index` tinyint(3) unsigned NOT NULL,
  `level_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `SERGES_Access_Level_UN` (`level_name`),
  UNIQUE KEY `SERGES_Access_Level_index_IDX` (`index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ENUM_MPASIS_Access_Level`
--

LOCK TABLES `ENUM_MPASIS_Access_Level` WRITE;
/*!40000 ALTER TABLE `ENUM_MPASIS_Access_Level` DISABLE KEYS */;
INSERT INTO `ENUM_MPASIS_Access_Level` VALUES (0,'Guest User',NULL),(1,'Encoder',NULL),(2,'Evaluator',NULL),(3,'Administrator',NULL),(4,'Maintainer',NULL);
/*!40000 ALTER TABLE `ENUM_MPASIS_Access_Level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ENUM_MPASIS_Action`
--

DROP TABLE IF EXISTS `ENUM_MPASIS_Action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ENUM_MPASIS_Action` (
  `index` tinyint(3) unsigned NOT NULL,
  `mpasis_action` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ENUM_MPASIS_Action`
--

LOCK TABLES `ENUM_MPASIS_Action` WRITE;
/*!40000 ALTER TABLE `ENUM_MPASIS_Action` DISABLE KEYS */;
INSERT INTO `ENUM_MPASIS_Action` VALUES (0,'Unknown',NULL),(1,'Create position',NULL),(2,'Add plantilla item','Similar to creating a position, but the same position title already exists'),(3,'Retrieve position',NULL),(4,'Update position',NULL),(5,'Delete position',NULL),(6,'Create applicant record',NULL),(7,'Retrieve applicant record',NULL),(8,'Update applicant record',NULL),(9,'Delete applicant record',NULL),(10,'Create user account',NULL),(11,'Retrieve user account',NULL),(12,'Update user account information',NULL),(13,'Update user password',NULL),(14,'Update user settings',NULL),(15,'Delete user account',NULL),(16,'Create temporary user account',NULL),(17,'Retrieve temporary user account',NULL),(18,'Update temporary user account information',NULL),(19,'Update temporary user password',NULL),(20,'Update temporary user settings',NULL),(21,'Delete temporary user account',NULL),(22,'Successful sign-in',NULL),(23,'Failed sign-in',NULL),(24,'Sign-out',NULL);
/*!40000 ALTER TABLE `ENUM_MPASIS_Action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ENUM_MPASIS_Role_Type`
--

DROP TABLE IF EXISTS `ENUM_MPASIS_Role_Type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ENUM_MPASIS_Role_Type` (
  `mpasis_roleIndex` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `mpasis_role` varchar(50) NOT NULL,
  `mpasis_role_name` varchar(50) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`mpasis_roleIndex`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ENUM_MPASIS_Role_Type`
--

LOCK TABLES `ENUM_MPASIS_Role_Type` WRITE;
/*!40000 ALTER TABLE `ENUM_MPASIS_Role_Type` DISABLE KEYS */;
INSERT INTO `ENUM_MPASIS_Role_Type` VALUES (1,'Appointing Authority','appointing_officer',NULL),(2,'HRMO','hrmo',NULL),(3,'HRMPSB Chairperson','hrmpsb_chair',NULL),(4,'HRMPSB Secretariat','hrmpsb_secretariat',NULL),(5,'HRMPSB Member (Level 1)','hrmpsb_member_level1',NULL),(6,'HRMPSB Member (Level 2)','hrmpsb_member_level2',NULL),(7,'HRMPSB Member (Level 3)','hrmpsb_member_level3',NULL);
/*!40000 ALTER TABLE `ENUM_MPASIS_Role_Type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ENUM_OPMS_Access_Level`
--

DROP TABLE IF EXISTS `ENUM_OPMS_Access_Level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ENUM_OPMS_Access_Level` (
  `index` tinyint(3) unsigned NOT NULL,
  `level_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `ROMAS_Access_Level_index_IDX` (`index`) USING BTREE,
  UNIQUE KEY `ROMAS_Access_Level_UN` (`level_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ENUM_OPMS_Access_Level`
--

LOCK TABLES `ENUM_OPMS_Access_Level` WRITE;
/*!40000 ALTER TABLE `ENUM_OPMS_Access_Level` DISABLE KEYS */;
INSERT INTO `ENUM_OPMS_Access_Level` VALUES (0,'Blocked','User is blocked from using the system in any way.'),(1,'Ratee','User can view only the ratee views.'),(2,'Rater','User can view both the rater and ratee views'),(3,'Approver','User can view the approver, rater, and ratee views.'),(9,'Maintainer','A maintainer will have no access to actual employee/user records, but they will be allowed to do database and settings backup operations.'),(10,'Developer','Although a developer theoretically will have unrestricted access to the system source code and even the data, he/she will have no actual access to user/employee data while logged on to the system, but can be given authorization to access these data for a very limited time (a span of a few minutes) by at least three levels of higher tier users.');
/*!40000 ALTER TABLE `ENUM_OPMS_Access_Level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ENUM_PM_Plan_Item_Status`
--

DROP TABLE IF EXISTS `ENUM_PM_Plan_Item_Status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ENUM_PM_Plan_Item_Status` (
  `index` tinyint(3) unsigned NOT NULL,
  `status` varchar(30) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `ENUM_PM_Plan_Item_Status_index_IDX` (`index`) USING BTREE,
  UNIQUE KEY `ENUM_PM_Plan_Item_Status_status_IDX` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='0 - Added-For Agreement/Commitment; 1 - Added-Agreed/Committed; 2 - Removed-For Agreement/Commitment; 3 - Removed-Agreed/Committed';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ENUM_PM_Plan_Item_Status`
--

LOCK TABLES `ENUM_PM_Plan_Item_Status` WRITE;
/*!40000 ALTER TABLE `ENUM_PM_Plan_Item_Status` DISABLE KEYS */;
/*!40000 ALTER TABLE `ENUM_PM_Plan_Item_Status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ENUM_PM_Plan_Status`
--

DROP TABLE IF EXISTS `ENUM_PM_Plan_Status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ENUM_PM_Plan_Status` (
  `index` tinyint(3) unsigned NOT NULL,
  `status` varchar(30) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `ENUM_PM_Plan_Status_index_IDX` (`index`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='0 - Inactive; 1 - For Agreement/Commitment; 2 - Active; 3 - For Review; 4 - Updated/Active; 5 - For Approval; 6 - Finalized';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ENUM_PM_Plan_Status`
--

LOCK TABLES `ENUM_PM_Plan_Status` WRITE;
/*!40000 ALTER TABLE `ENUM_PM_Plan_Status` DISABLE KEYS */;
/*!40000 ALTER TABLE `ENUM_PM_Plan_Status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ENUM_SERGS_Access_Level`
--

DROP TABLE IF EXISTS `ENUM_SERGS_Access_Level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ENUM_SERGS_Access_Level` (
  `index` tinyint(3) unsigned NOT NULL,
  `level_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `SERGES_Access_Level_index_IDX` (`index`) USING BTREE,
  UNIQUE KEY `SERGES_Access_Level_UN` (`level_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ENUM_SERGS_Access_Level`
--

LOCK TABLES `ENUM_SERGS_Access_Level` WRITE;
/*!40000 ALTER TABLE `ENUM_SERGS_Access_Level` DISABLE KEYS */;
INSERT INTO `ENUM_SERGS_Access_Level` VALUES (0,'Blocked','User is blocked from using the system in any way. Others will have to process things for them, including transacting requests.'),(1,'User','A basic user is allowed to access and propose updates for his/her own records, transact requests for release of his/her own authenticated service records, and edit his/her own account.'),(2,'Encoder','An encoder is allowed to edit records and accept/verify edits proposed by basic users and other encoders. Encoders may or may not be allowed access to all records below or at the same level, depending on prevailing system restrictions.'),(3,'Certifier','A certifier can approve the edits accepted or made by encoders. Certifiers may propose edits to their own records subject to encoder review, but cannot certify it themselves.'),(4,'Approver','An approver can authorize the release of e-signature-authenticated or manually signed records. Approvers cannot certify or approve their own records.'),(5,'Manager','A manager has the highest level of access to the functions of the system and could approve the records of the approvers. But, his/her own records can only be approved by at least two approvers.'),(9,'Maintainer','A maintainer will have no access to actual employee/user records, but they will be allowed to do database and settings backup operations.'),(10,'Developer','Although a developer theoretically will have unrestricted access to the system source code and even the data, he/she will have no actual access to user/employee data while logged on to the system, but can be given authorization to access these data for a very limited time (a span of a few minutes) by at least three levels of higher tier users.');
/*!40000 ALTER TABLE `ENUM_SERGS_Access_Level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Eligibility`
--

DROP TABLE IF EXISTS `Eligibility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Eligibility` (
  `eligibilityId` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `eligibility` varchar(500) NOT NULL,
  `eligibility_abbrev` varchar(20) DEFAULT NULL,
  `equivalent_eligibility` tinyint(3) unsigned DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`eligibilityId`),
  KEY `equivalent_eligibility` (`equivalent_eligibility`),
  CONSTRAINT `Eligibility_ibfk_1` FOREIGN KEY (`equivalent_eligibility`) REFERENCES `Eligibility` (`eligibilityId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Eligibility`
--

LOCK TABLES `Eligibility` WRITE;
/*!40000 ALTER TABLE `Eligibility` DISABLE KEYS */;
INSERT INTO `Eligibility` VALUES (1,'Career Service Sub-Professional (First Level Eligibility)','CS Subpro',NULL,NULL),(2,'Career Service Professional (Second Level Eligibility)','CS Pro',NULL,NULL),(3,'Honor Graduate',NULL,2,'Magna Cum Laude/Summa Cum Laude/Cum Laude'),(4,'RA 1080',NULL,2,NULL),(5,'RA 1080 (Teacher)','LPET/LET/PBET',2,'LPT/LET/PBET'),(6,'RA 1080 (CPA)','CPA',2,'Certified Public Accountant'),(7,'RA 1080 (Bar)','Lawyer/Bar',2,'Lawyer'),(8,'RA 1080 (Physician\'s Licensure Exam)',NULL,2,'Physician'),(9,'RA 1080 (Engineer)',NULL,2,NULL),(10,'RA 1080 (Architect)',NULL,2,NULL),(11,'RA 1080 (Dentist)',NULL,2,NULL),(12,'RA 1080 (Nursing Licensure Exam)',NULL,2,NULL),(13,'RA 1080 (Librarian)',NULL,2,'Librarian');
/*!40000 ALTER TABLE `Eligibility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Email_Address`
--

DROP TABLE IF EXISTS `Email_Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Email_Address` (
  `email_address` varchar(50) NOT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`email_address`),
  KEY `Email_Address_FK` (`personId`),
  CONSTRAINT `Email_Address_FK` FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Email_Address`
--

LOCK TABLES `Email_Address` WRITE;
/*!40000 ALTER TABLE `Email_Address` DISABLE KEYS */;
INSERT INTO `Email_Address` VALUES ('geovaniduqueza1939@yahoo.com',16),('jdc@yahoo.com',20),('jduke@gmail.com',21),('jarces@yahoo.com',41),('',91);
/*!40000 ALTER TABLE `Email_Address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Emp_Appointment`
--

DROP TABLE IF EXISTS `Emp_Appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Emp_Appointment` (
  `emp_appointmentId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(100) NOT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  `employeeId` varchar(50) NOT NULL,
  `appointment_number` varchar(50) DEFAULT NULL,
  `plantilla_item_number` varchar(50) DEFAULT NULL,
  `date_rangeId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`emp_appointmentId`),
  UNIQUE KEY `Emp_Appointment_id_IDX` (`emp_appointmentId`) USING BTREE,
  KEY `Emp_Appointment_FK_1` (`employeeId`),
  KEY `Emp_Appointment_FK` (`plantilla_item_number`),
  KEY `Emp_Appointment_FK_2` (`date_rangeId`),
  KEY `Emp_Appointment_FK_3` (`personId`),
  CONSTRAINT `Emp_Appointment_FK` FOREIGN KEY (`plantilla_item_number`) REFERENCES `Position` (`plantilla_item_number`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Emp_Appointment_FK_1` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Emp_Appointment_FK_2` FOREIGN KEY (`date_rangeId`) REFERENCES `Date_Range` (`date_rangeId`) ON UPDATE CASCADE,
  CONSTRAINT `Emp_Appointment_FK_3` FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Appointments may include both CSC Appointments and Job Order Appointments';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Emp_Appointment`
--

LOCK TABLES `Emp_Appointment` WRITE;
/*!40000 ALTER TABLE `Emp_Appointment` DISABLE KEYS */;
INSERT INTO `Emp_Appointment` VALUES (171,'Administrative Aide VI',1,'A1234567','A1234567',NULL,21),(172,'Administrative Assistant (LSB)',1,'A1234567','A1234567',NULL,6),(188,'Teacher I',2,'B3129847','B3129847',NULL,19),(189,'Accountant III',2,'B3129847','B3129847',NULL,10),(190,'Teacher II',2,'B3129847','B3129847',NULL,13);
/*!40000 ALTER TABLE `Emp_Appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Emp_Term_of_Service`
--

DROP TABLE IF EXISTS `Emp_Term_of_Service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Emp_Term_of_Service` (
  `emp_term_of_serviceId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date_rangeId` bigint(20) unsigned NOT NULL,
  `appointmentId` bigint(20) unsigned NOT NULL,
  `workplaceId` bigint(20) unsigned DEFAULT NULL,
  `status` tinyint(3) unsigned NOT NULL,
  `salary` float unsigned DEFAULT NULL,
  `branch` varchar(100) NOT NULL DEFAULT 'NM',
  `lwop_count` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `separation_date` date DEFAULT NULL,
  PRIMARY KEY (`emp_term_of_serviceId`),
  UNIQUE KEY `Emp_TermsOfService_id_IDX` (`emp_term_of_serviceId`) USING BTREE,
  KEY `Emp_Term_of_Service_FK` (`date_rangeId`),
  KEY `Emp_Term_of_Service_FK_1` (`appointmentId`),
  KEY `Emp_Term_of_Service_FK_2` (`workplaceId`),
  KEY `Emp_Term_of_Service_FK_3` (`status`),
  CONSTRAINT `Emp_Term_of_Service_FK` FOREIGN KEY (`date_rangeId`) REFERENCES `Date_Range` (`date_rangeId`) ON UPDATE CASCADE,
  CONSTRAINT `Emp_Term_of_Service_FK_1` FOREIGN KEY (`appointmentId`) REFERENCES `Emp_Appointment` (`emp_appointmentId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Emp_Term_of_Service_FK_2` FOREIGN KEY (`workplaceId`) REFERENCES `Workplace` (`workplaceId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Emp_Term_of_Service_FK_3` FOREIGN KEY (`status`) REFERENCES `ENUM_Emp_Appointment_Status` (`index`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=285 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Emp_Term_of_Service`
--

LOCK TABLES `Emp_Term_of_Service` WRITE;
/*!40000 ALTER TABLE `Emp_Term_of_Service` DISABLE KEYS */;
INSERT INTO `Emp_Term_of_Service` VALUES (253,22,171,NULL,2,NULL,'NM',0,NULL),(254,2,172,1,7,9020,'NM',0,NULL),(280,20,188,2,4,NULL,'NM',0,NULL),(281,8,188,2,1,20000,'NM',0,NULL),(282,9,188,2,1,20388,'NM',0,NULL),(283,11,189,3,3,46791,'NM',0,NULL),(284,14,190,2,1,30000,'NM',0,NULL);
/*!40000 ALTER TABLE `Emp_Term_of_Service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employee`
--

DROP TABLE IF EXISTS `Employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Employee` (
  `employeeId` varchar(50) NOT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  `is_temporary_empno` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`employeeId`),
  UNIQUE KEY `Employee_employeeId_IDX` (`employeeId`) USING BTREE,
  UNIQUE KEY `Employee_UN` (`personId`),
  CONSTRAINT `Employee_FK` FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employee`
--

LOCK TABLES `Employee` WRITE;
/*!40000 ALTER TABLE `Employee` DISABLE KEYS */;
INSERT INTO `Employee` VALUES ('A1234567',1,1),('B3129847',2,1),('F41234124',91,1);
/*!40000 ALTER TABLE `Employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Ethnicity`
--

DROP TABLE IF EXISTS `Ethnicity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Ethnicity` (
  `ethnicityId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ethnic_group` varchar(30) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`ethnicityId`),
  UNIQUE KEY `Ethnicity_UN` (`ethnic_group`),
  UNIQUE KEY `Ethnicity_ethnic_group_IDX` (`ethnic_group`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ethnicity`
--

LOCK TABLES `Ethnicity` WRITE;
/*!40000 ALTER TABLE `Ethnicity` DISABLE KEYS */;
INSERT INTO `Ethnicity` VALUES (8,'Ilocano',NULL),(9,'Tagalog',NULL),(10,'',NULL);
/*!40000 ALTER TABLE `Ethnicity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Institution`
--

DROP TABLE IF EXISTS `Institution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Institution` (
  `institutionId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `institution_name` varchar(500) NOT NULL,
  `umbrella_institutionId` bigint(20) unsigned DEFAULT NULL,
  `addressId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`institutionId`),
  UNIQUE KEY `Institution_Column1_IDX` (`institutionId`) USING BTREE,
  KEY `Institution_FK_1` (`umbrella_institutionId`),
  KEY `Institution_FK` (`addressId`),
  CONSTRAINT `Institution_FK` FOREIGN KEY (`addressId`) REFERENCES `Address` (`addressId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Institution_FK_1` FOREIGN KEY (`umbrella_institutionId`) REFERENCES `Institution` (`institutionId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Institution`
--

LOCK TABLES `Institution` WRITE;
/*!40000 ALTER TABLE `Institution` DISABLE KEYS */;
INSERT INTO `Institution` VALUES (1,'Department of Education',NULL,NULL),(2,'DepEd-Regional Office IV',1,NULL),(3,'DepEd-SDO Sto. Tomas City',2,1),(4,'San Roque ES',NULL,NULL),(5,'SDO',NULL,NULL);
/*!40000 ALTER TABLE `Institution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Job_Application`
--

DROP TABLE IF EXISTS `Job_Application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Job_Application` (
  `application_code` varchar(20) NOT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  `position_title_applied` varchar(100) DEFAULT NULL,
  `parenthetical_title_applied` varchar(100) DEFAULT NULL,
  `plantilla_item_number_applied` varchar(50) DEFAULT NULL,
  `present_school` varchar(200) DEFAULT NULL,
  `present_district` varchar(200) DEFAULT NULL,
  `present_position` varchar(100) DEFAULT NULL,
  `present_designation` varchar(100) DEFAULT NULL,
  `has_specific_education_required` tinyint(1) DEFAULT NULL,
  `educ_notes` longtext DEFAULT NULL,
  `has_specific_training` tinyint(1) DEFAULT NULL,
  `has_more_unrecorded_training` tinyint(1) DEFAULT NULL,
  `train_notes` longtext DEFAULT NULL,
  `has_specific_work_experience` tinyint(1) DEFAULT NULL,
  `has_more_unrecorded_work_experience` tinyint(1) DEFAULT NULL,
  `work_exp_notes` longtext DEFAULT NULL,
  `has_specific_competency_required` tinyint(1) DEFAULT NULL,
  `most_recent_performance_rating` float unsigned DEFAULT NULL,
  `performance_cse_gwa_rating` float unsigned DEFAULT NULL,
  `performance_cse_honor_grad` tinyint(3) unsigned DEFAULT NULL,
  `performance_notes` longtext DEFAULT NULL,
  `lept_rating` float unsigned DEFAULT NULL,
  `lept_notes` longtext DEFAULT NULL,
  `ppstcoi` float unsigned DEFAULT NULL,
  `coi_notes` longtext DEFAULT NULL,
  `ppstncoi` float unsigned DEFAULT NULL,
  `ncoi_notes` longtext DEFAULT NULL,
  `number_of_citation_movs` tinyint(3) unsigned DEFAULT NULL,
  `number_of_academic_award_movs` tinyint(3) unsigned DEFAULT NULL,
  `number_of_awards_external_office_search` tinyint(3) unsigned DEFAULT NULL,
  `number_of_awards_external_org_level_search` tinyint(3) unsigned DEFAULT NULL,
  `number_of_awards_central_co_level_search` tinyint(3) unsigned DEFAULT NULL,
  `number_of_awards_central_national_search` tinyint(3) unsigned DEFAULT NULL,
  `number_of_awards_regional_ro_level_search` tinyint(3) unsigned DEFAULT NULL,
  `number_of_awards_regional_national_search` tinyint(3) unsigned DEFAULT NULL,
  `number_of_awards_division_sdo_level_search` tinyint(3) unsigned DEFAULT NULL,
  `number_of_awards_division_national_search` tinyint(3) unsigned DEFAULT NULL,
  `number_of_awards_school_school_level_search` tinyint(3) unsigned DEFAULT NULL,
  `number_of_awards_school_sdo_level_search` tinyint(3) unsigned DEFAULT NULL,
  `trainer_award_level` tinyint(3) unsigned DEFAULT NULL,
  `number_of_research_proposal_only` tinyint(3) unsigned DEFAULT NULL,
  `number_of_research_proposal_ar` tinyint(3) unsigned DEFAULT NULL,
  `number_of_research_proposal_ar_util` tinyint(3) unsigned DEFAULT NULL,
  `number_of_research_proposal_ar_util_adopt` tinyint(3) unsigned DEFAULT NULL,
  `number_of_research_proposal_ar_util_cite` tinyint(3) unsigned DEFAULT NULL,
  `number_of_smetwg_issuance_cert` tinyint(3) unsigned DEFAULT NULL,
  `number_of_smetwg_issuance_cert_output` tinyint(3) unsigned DEFAULT NULL,
  `number_of_speakership_external_office_level` tinyint(3) unsigned DEFAULT NULL,
  `number_of_speakership_external_org_level` tinyint(3) unsigned DEFAULT NULL,
  `number_of_speakership_central_co_level` tinyint(3) unsigned DEFAULT NULL,
  `number_of_speakership_central_national_level` tinyint(3) unsigned DEFAULT NULL,
  `number_of_speakership_regional_ro_level` tinyint(3) unsigned DEFAULT NULL,
  `number_of_speakership_regional_national_level` tinyint(3) unsigned DEFAULT NULL,
  `number_of_speakership_division_sdo_level` tinyint(3) unsigned DEFAULT NULL,
  `number_of_speakership_division_regional_level` tinyint(3) unsigned DEFAULT NULL,
  `number_of_speakership_school_school_level` tinyint(3) unsigned DEFAULT NULL,
  `number_of_speakership_school_sdo_level` tinyint(3) unsigned DEFAULT NULL,
  `neap_facilitator_accreditation` tinyint(3) unsigned DEFAULT NULL,
  `accomplishments_notes` longtext DEFAULT NULL,
  `number_of_app_educ_r_actionplan` tinyint(3) unsigned DEFAULT NULL,
  `number_of_app_educ_r_actionplan_ar` tinyint(3) unsigned DEFAULT NULL,
  `number_of_app_educ_r_actionplan_ar_adoption` tinyint(3) unsigned DEFAULT NULL,
  `number_of_app_educ_nr_actionplan` tinyint(3) unsigned DEFAULT NULL,
  `number_of_app_educ_nr_actionplan_ar` tinyint(3) unsigned DEFAULT NULL,
  `number_of_app_educ_nr_actionplan_ar_adoption` tinyint(3) unsigned DEFAULT NULL,
  `app_educ_gwa` float unsigned DEFAULT NULL,
  `education_app_notes` longtext DEFAULT NULL,
  `number_of_app_train_relevant_cert_ap` tinyint(3) unsigned DEFAULT NULL,
  `number_of_app_train_relevant_cert_ap_arlocal` tinyint(3) unsigned DEFAULT NULL,
  `number_of_app_train_relevant_cert_ap_arlocal_arother` tinyint(3) unsigned DEFAULT NULL,
  `number_of_app_train_not_relevant_cert_ap` tinyint(3) unsigned DEFAULT NULL,
  `number_of_app_train_not_relevant_cert_ap_arlocal` tinyint(3) unsigned DEFAULT NULL,
  `number_of_app_train_not_relevant_cert_ap_arlocal_arother` tinyint(3) unsigned DEFAULT NULL,
  `training_app_notes` longtext DEFAULT NULL,
  `score_exam` float unsigned DEFAULT NULL,
  `score_skill` float unsigned DEFAULT NULL,
  `score_bei` float unsigned DEFAULT NULL,
  `potential_notes` longtext DEFAULT NULL,
  PRIMARY KEY (`application_code`),
  KEY `personId` (`personId`),
  KEY `plantilla_item_number_applied` (`plantilla_item_number_applied`),
  CONSTRAINT `Job_Application_ibfk_1` FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Job_Application_ibfk_2` FOREIGN KEY (`plantilla_item_number_applied`) REFERENCES `Position` (`plantilla_item_number`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Job_Application`
--

LOCK TABLES `Job_Application` WRITE;
/*!40000 ALTER TABLE `Job_Application` DISABLE KEYS */;
INSERT INTO `Job_Application` VALUES ('1018',20,'Administrative Assistant III',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('1019',21,'Administrative Assistant I',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Test Educ',NULL,1,'Test Train',NULL,0,'Test Work',NULL,0,NULL,NULL,'Test Perf',NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0,0,0,0,0,0,0,NULL,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,0,0,0,0,0,NULL,0,0,0,'Test Potential'),('1024',41,'Administrative Officer IV','Records','ADOF4-270047-2023',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,NULL,NULL,4.3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,1,0,0,0,0,0,0,NULL,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,NULL,1,0,1,0,0,0,NULL,NULL,0,1,0,0,0,0,NULL,90,0,0,NULL),('ADdskljfs1234',21,'Administrative Assistant III',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('fdsae5254',58,'Administrative Assistant I',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,NULL,NULL,NULL,85.4,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0,0,0,0,0,0,0,NULL,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,85.4,NULL,0,0,0,0,0,0,NULL,90,0,0,NULL),('mfsdsa453',59,'Administrative Officer V','Budget Officer','ADOF5-270051-2023',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('sdty456462',41,'Administrative Officer V',NULL,'ADOF5-270050-2023',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('TCH1-2023-00000',88,'Teacher I',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,0,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,90,NULL,27,NULL,18,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('u6556tdfgfasd',59,'Public Schools District Supervisor',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,0,NULL,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Job_Application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Leave`
--

DROP TABLE IF EXISTS `Leave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Leave` (
  `leaveId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date_range` bigint(20) unsigned NOT NULL,
  `dates_excluded` bigint(20) unsigned DEFAULT NULL,
  `dates_with_pay` bigint(20) unsigned DEFAULT NULL,
  `employeeId` varchar(50) NOT NULL,
  PRIMARY KEY (`leaveId`),
  UNIQUE KEY `Leave_id_IDX` (`leaveId`) USING BTREE,
  KEY `Leave_FK` (`date_range`),
  KEY `Leave_FK_1` (`dates_excluded`),
  KEY `Leave_FK_2` (`dates_with_pay`),
  KEY `Leave_FK_3` (`employeeId`),
  CONSTRAINT `Leave_FK` FOREIGN KEY (`date_range`) REFERENCES `Date_Range` (`date_rangeId`) ON UPDATE CASCADE,
  CONSTRAINT `Leave_FK_1` FOREIGN KEY (`dates_excluded`) REFERENCES `Date_Range` (`date_rangeId`) ON UPDATE CASCADE,
  CONSTRAINT `Leave_FK_2` FOREIGN KEY (`dates_with_pay`) REFERENCES `Date_Range` (`date_rangeId`) ON UPDATE CASCADE,
  CONSTRAINT `Leave_FK_3` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Leave`
--

LOCK TABLES `Leave` WRITE;
/*!40000 ALTER TABLE `Leave` DISABLE KEYS */;
/*!40000 ALTER TABLE `Leave` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Location`
--

DROP TABLE IF EXISTS `Location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Location` (
  `locationId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `location_name` varchar(100) NOT NULL,
  `location_type` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `latitude` smallint(6) DEFAULT NULL,
  `longitude` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`locationId`),
  UNIQUE KEY `Location_id_IDX` (`locationId`) USING BTREE,
  KEY `Location_FK` (`location_type`),
  CONSTRAINT `Location_FK` FOREIGN KEY (`location_type`) REFERENCES `ENUM_Location_Type` (`index`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Location`
--

LOCK TABLES `Location` WRITE;
/*!40000 ALTER TABLE `Location` DISABLE KEYS */;
INSERT INTO `Location` VALUES (1,'Philippines',1,NULL,NULL),(2,'Batangas',2,NULL,NULL),(3,'Sto. Tomas City',3,NULL,NULL),(4,'Lipa City',3,NULL,NULL),(5,'Malvar',4,NULL,NULL),(6,'Tanauan City',3,NULL,NULL),(7,'Laguna',2,NULL,NULL),(8,'Calamba City',3,NULL,NULL),(9,'Brgy. Poblacion IV',5,NULL,NULL),(10,'Brgy. Sta. Anastacia',5,NULL,NULL),(11,'Brgy. San Rafael',5,NULL,NULL),(12,'Brgy. Marawoy',5,NULL,NULL),(13,'Mt. Claire Village Subdivision',7,NULL,NULL),(14,'Block 19 Lot 15 Phase IV',9,NULL,NULL),(15,'Levitown Subdivision',7,NULL,NULL),(16,'Door 6 Recto Apartment',9,NULL,NULL),(17,'Caloocan City',3,NULL,NULL),(18,'Camarin',4,NULL,NULL),(19,'Brgy. 178',5,NULL,NULL),(20,'Kasoy St.',8,NULL,NULL),(21,'2157',9,NULL,NULL),(22,'Area D',6,NULL,NULL);
/*!40000 ALTER TABLE `Location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MPASIS_Committee`
--

DROP TABLE IF EXISTS `MPASIS_Committee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MPASIS_Committee` (
  `mpasis_committeeId` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `mpasis_committee` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`mpasis_committeeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MPASIS_Committee`
--

LOCK TABLES `MPASIS_Committee` WRITE;
/*!40000 ALTER TABLE `MPASIS_Committee` DISABLE KEYS */;
/*!40000 ALTER TABLE `MPASIS_Committee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MPASIS_History`
--

DROP TABLE IF EXISTS `MPASIS_History`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MPASIS_History` (
  `mpasis_historyId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `mpasis_action` tinyint(3) unsigned NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `temp_username` varchar(100) DEFAULT NULL,
  `application_code` varchar(100) DEFAULT NULL,
  `position_title` varchar(100) DEFAULT NULL,
  `plantilla_item_number` varchar(50) DEFAULT NULL,
  `username_op` varchar(100) DEFAULT NULL,
  `temp_username_op` varchar(100) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `remarks` longtext DEFAULT NULL,
  PRIMARY KEY (`mpasis_historyId`),
  KEY `MPASIS_History_FK` (`mpasis_action`),
  KEY `MPASIS_History_FK_3` (`plantilla_item_number`),
  KEY `MPASIS_History_FK_4` (`username_op`),
  KEY `MPASIS_History_FK_5` (`temp_username_op`),
  KEY `MPASIS_History_FK_1` (`username`),
  KEY `MPASIS_History_FK_2` (`temp_username`),
  CONSTRAINT `MPASIS_History_FK` FOREIGN KEY (`mpasis_action`) REFERENCES `ENUM_MPASIS_Action` (`index`) ON UPDATE CASCADE,
  CONSTRAINT `MPASIS_History_FK_1` FOREIGN KEY (`username`) REFERENCES `User` (`username`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `MPASIS_History_FK_2` FOREIGN KEY (`temp_username`) REFERENCES `Temp_User` (`username`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `MPASIS_History_FK_3` FOREIGN KEY (`plantilla_item_number`) REFERENCES `Position` (`plantilla_item_number`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1422 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MPASIS_History`
--

LOCK TABLES `MPASIS_History` WRITE;
/*!40000 ALTER TABLE `MPASIS_History` DISABLE KEYS */;
INSERT INTO `MPASIS_History` VALUES (1,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 14:27:26',NULL),(18,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-10 14:48:31',NULL),(19,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 15:18:40',NULL),(21,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 15:20:32',NULL),(23,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 15:21:12',NULL),(29,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 15:32:49',NULL),(30,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 15:33:51',NULL),(31,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 15:36:08',NULL),(38,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 15:47:23',NULL),(43,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 15:53:29',NULL),(44,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 15:55:18',NULL),(45,16,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'JDC','2023-04-10 15:59:13',NULL),(46,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 18:18:02',NULL),(47,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-10 23:59:43',NULL),(48,6,NULL,'GeoTheDuke',1013,'Administrative Officer V','ADOF5-270051-2023',NULL,NULL,'2023-04-11 03:24:59',NULL),(49,6,NULL,'GeoTheDuke',1014,'Administrative Officer V','ADOF5-270051-2023',NULL,NULL,'2023-04-11 03:27:52',NULL),(50,6,NULL,'GeoTheDuke',1015,'Administrative Officer V','ADOF5-270051-2023',NULL,NULL,'2023-04-11 03:28:11',NULL),(51,6,NULL,'GeoTheDuke',1016,'Administrative Officer V','ADOF5-270051-2023',NULL,NULL,'2023-04-11 03:28:16',NULL),(52,6,NULL,'GeoTheDuke',1017,'Administrative Officer V','ADOF5-270051-2023',NULL,NULL,'2023-04-11 03:30:04',NULL),(53,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-11 07:44:48',NULL),(54,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-11 23:30:23',NULL),(55,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-12 04:31:10',NULL),(56,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-12 12:04:17',NULL),(57,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-12 14:05:40',NULL),(58,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-12 19:08:55',NULL),(59,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-13 00:01:47',NULL),(60,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-13 02:06:26',NULL),(61,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-13 04:42:42',NULL),(62,6,NULL,'GeoTheDuke',1018,'Administrative Assistant III',NULL,NULL,NULL,'2023-04-13 05:11:48',NULL),(63,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-13 21:19:36',NULL),(64,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-14 00:20:17',NULL),(65,6,NULL,'GeoTheDuke',1019,'Administrative Assistant I',NULL,NULL,NULL,'2023-04-14 02:06:17',NULL),(66,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-14 03:25:43',NULL),(67,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-14 04:30:05',NULL),(68,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-15 03:52:29',NULL),(69,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-15 07:01:37',NULL),(70,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-15 08:55:06',NULL),(71,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-15 09:15:31',NULL),(72,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-15 10:20:09',NULL),(73,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-15 16:19:29',NULL),(74,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-16 01:02:21',NULL),(75,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-16 01:07:27',NULL),(76,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-16 01:16:10',NULL),(77,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-16 02:37:32',NULL),(78,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-16 06:23:40',NULL),(79,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-16 10:44:39',NULL),(80,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-16 12:10:28',NULL),(81,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-16 13:14:23',NULL),(82,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-16 14:54:26',NULL),(83,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-16 20:51:44',NULL),(84,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-16 23:07:18',NULL),(85,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-17 00:15:07',NULL),(86,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-17 04:44:06',NULL),(87,6,NULL,'GeoTheDuke',1023,'Administrative Officer IV',NULL,NULL,NULL,'2023-04-17 06:00:54',NULL),(88,6,NULL,'GeoTheDuke',1024,'Administrative Officer IV',NULL,NULL,NULL,'2023-04-17 06:01:56',NULL),(89,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-17 07:39:57',NULL),(90,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-17 07:40:09',NULL),(91,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-17 18:42:34',NULL),(92,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-17 21:12:13',NULL),(93,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-18 00:14:42',NULL),(94,8,NULL,'GeoTheDuke',1024,'Administrative Officer IV',NULL,NULL,NULL,'2023-04-18 00:31:55',NULL),(95,8,NULL,'GeoTheDuke',1024,'Administrative Officer IV',NULL,NULL,NULL,'2023-04-18 00:33:10',NULL),(96,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-18 07:55:22',NULL),(97,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-18 08:49:50',NULL),(98,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-18 09:06:18',NULL),(99,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:22:04',NULL),(100,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:29:57',NULL),(101,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:30:15',NULL),(102,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:31:44',NULL),(103,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:32:36',NULL),(104,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:33:34',NULL),(105,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:33:41',NULL),(106,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:34:25',NULL),(107,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:35:21',NULL),(108,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:36:08',NULL),(109,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:36:59',NULL),(110,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:37:23',NULL),(111,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:37:28',NULL),(112,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:40:06',NULL),(113,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:40:39',NULL),(114,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-04-18 19:43:28',NULL),(115,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-18 19:43:38',NULL),(116,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-18 21:43:55',NULL),(117,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-18 23:16:06',NULL),(118,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-19 01:20:10',NULL),(119,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-19 06:09:48',NULL),(120,6,NULL,NULL,1024,'Administrative Officer IV',NULL,NULL,NULL,'2023-04-19 06:13:58',NULL),(121,6,NULL,NULL,1024,'Administrative Officer IV',NULL,NULL,NULL,'2023-04-19 06:16:55',NULL),(122,6,NULL,NULL,1024,'Administrative Officer IV',NULL,NULL,NULL,'2023-04-19 06:17:49',NULL),(123,8,NULL,'GeoTheDuke',1024,'Administrative Officer IV',NULL,NULL,NULL,'2023-04-19 06:17:49',NULL),(124,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-20 01:43:53',NULL),(125,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-20 01:43:53',NULL),(126,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-20 01:43:58',NULL),(127,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-20 01:44:08',NULL),(128,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-20 01:45:15',NULL),(129,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-20 01:45:15',NULL),(130,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-20 08:58:46',NULL),(131,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-22 01:45:31',NULL),(132,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-22 02:56:50',NULL),(133,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-22 11:47:32',NULL),(134,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-22 15:35:51',NULL),(135,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-22 22:32:51',NULL),(136,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-23 07:12:06',NULL),(137,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-23 08:15:49',NULL),(138,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-23 12:03:19',NULL),(139,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-23 15:27:06',NULL),(140,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-23 23:26:25',NULL),(141,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-24 01:03:55',NULL),(142,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-24 02:00:32',NULL),(143,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-24 04:11:26',NULL),(144,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-24 04:49:49',NULL),(145,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-25 00:16:24',NULL),(146,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-25 03:12:44',NULL),(147,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-25 05:24:56',NULL),(148,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-25 06:01:00',NULL),(149,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-25 06:10:47',NULL),(150,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-25 06:17:26',NULL),(151,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-25 06:19:32',NULL),(152,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-26 00:23:55',NULL),(153,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-26 03:04:08',NULL),(154,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-27 03:43:10',NULL),(155,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-27 06:53:02',NULL),(156,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-27 08:24:07',NULL),(157,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-28 00:11:38',NULL),(158,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-28 05:14:56',NULL),(159,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-28 15:08:30',NULL),(160,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-29 05:09:57',NULL),(161,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-29 09:24:51',NULL),(162,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-29 13:07:49',NULL),(163,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-30 11:56:27',NULL),(164,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-04-30 13:40:10',NULL),(165,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-01 12:34:07',NULL),(166,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-01 17:12:10',NULL),(167,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-01 20:21:58',NULL),(168,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-01 23:55:31',NULL),(169,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-02 02:01:11',NULL),(170,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-02 04:14:48',NULL),(171,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-02 05:15:06',NULL),(172,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-02 06:47:37',NULL),(173,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-02 23:54:20',NULL),(174,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-03 04:25:13',NULL),(175,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-03 06:16:53',NULL),(176,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-04 00:14:27',NULL),(177,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-04 00:59:51',NULL),(178,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-04 02:16:21',NULL),(179,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-04 02:16:27',NULL),(180,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-04 03:47:32',NULL),(181,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-04 05:13:19',NULL),(182,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-04 06:12:49',NULL),(183,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-05 00:07:48',NULL),(184,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-05 05:07:46',NULL),(185,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-05 08:18:29',NULL),(186,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-07 13:50:39',NULL),(187,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-08 00:24:00',NULL),(188,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-08 03:46:24',NULL),(189,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-08 05:21:21',NULL),(190,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-08 08:09:13',NULL),(191,6,NULL,NULL,1019,'Administrative Assistant I',NULL,NULL,NULL,'2023-05-08 08:24:38',NULL),(192,8,NULL,'GeoTheDuke',1019,'Administrative Assistant I',NULL,NULL,NULL,'2023-05-08 08:24:39',NULL),(193,6,NULL,NULL,1019,'Administrative Assistant I',NULL,NULL,NULL,'2023-05-08 08:30:55',NULL),(194,8,NULL,'GeoTheDuke',1019,'Administrative Assistant I',NULL,NULL,NULL,'2023-05-08 08:30:55',NULL),(195,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-08 23:38:46',NULL),(196,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-09 03:06:10',NULL),(197,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-09 11:30:06',NULL),(198,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-10 00:03:50',NULL),(199,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-10 01:07:29',NULL),(200,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-10 02:57:04',NULL),(201,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-10 05:04:19',NULL),(202,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-10 13:08:23',NULL),(203,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-10 23:59:47',NULL),(204,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 02:00:41',NULL),(205,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 03:01:46',NULL),(206,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 04:35:46',NULL),(207,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 04:35:50',NULL),(208,22,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-05-11 07:30:24',NULL),(209,24,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-05-11 07:30:33',NULL),(210,22,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-05-11 07:38:58',NULL),(211,24,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-05-11 07:39:35',NULL),(212,22,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-05-11 07:39:51',NULL),(213,24,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-05-11 07:41:18',NULL),(214,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 07:41:35',NULL),(215,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 07:41:59',NULL),(216,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 07:42:23',NULL),(217,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 07:42:59',NULL),(218,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 07:43:15',NULL),(219,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 08:17:40',NULL),(220,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 12:53:29',NULL),(221,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-11 20:50:13',NULL),(222,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:01:41',NULL),(223,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:01:46',NULL),(224,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:02:36',NULL),(225,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:23:36',NULL),(226,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:24:06',NULL),(227,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:24:09',NULL),(228,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:28:50',NULL),(229,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:29:47',NULL),(230,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:45:38',NULL),(231,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:47:41',NULL),(232,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:48:35',NULL),(233,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:49:37',NULL),(234,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:50:30',NULL),(235,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:51:21',NULL),(236,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:52:09',NULL),(237,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:52:40',NULL),(238,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:53:51',NULL),(239,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:55:45',NULL),(240,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 21:57:41',NULL),(241,12,NULL,'GeoTheDuke',NULL,NULL,NULL,'geovaniduqueza1939@outlook.com',NULL,'2023-05-11 22:05:26',NULL),(242,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:05:40',NULL),(243,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:09:10',NULL),(244,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'JDC','2023-05-11 22:09:14',NULL),(245,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:09:48',NULL),(246,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'JDC','2023-05-11 22:09:58',NULL),(247,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:11:50',NULL),(248,12,NULL,'GeoTheDuke',NULL,NULL,NULL,'geovaniduqueza1939@outlook.com',NULL,'2023-05-11 22:12:00',NULL),(249,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:12:04',NULL),(250,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:14:46',NULL),(251,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'JDC','2023-05-11 22:14:54',NULL),(252,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:19:09',NULL),(253,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:19:15',NULL),(254,12,NULL,'GeoTheDuke',NULL,NULL,NULL,'geovaniduqueza1939@outlook.com',NULL,'2023-05-11 22:19:23',NULL),(255,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:19:28',NULL),(256,12,NULL,'GeoTheDuke',NULL,NULL,NULL,'geovaniduqueza1939@outlook.com',NULL,'2023-05-11 22:19:41',NULL),(257,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:19:46',NULL),(258,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:20:19',NULL),(259,12,NULL,'GeoTheDuke',NULL,NULL,NULL,'geovaniduqueza1939@outlook.com',NULL,'2023-05-11 22:20:27',NULL),(260,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-11 22:20:32',NULL),(261,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 00:16:36',NULL),(262,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 00:25:32',NULL),(263,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 00:31:08',NULL),(264,16,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'jrich','2023-05-12 00:35:10',NULL),(265,16,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'jrich','2023-05-12 00:35:30',NULL),(266,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 00:35:38',NULL),(267,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 00:35:50',NULL),(268,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 00:35:53',NULL),(269,23,NULL,NULL,NULL,NULL,NULL,'jrichal',NULL,'2023-05-12 00:36:03',NULL),(270,22,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-05-12 00:36:11',NULL),(271,11,NULL,NULL,NULL,NULL,NULL,'',NULL,'2023-05-12 00:43:59',NULL),(272,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 01:15:15',NULL),(273,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 01:15:24',NULL),(274,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 01:20:36',NULL),(275,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 01:21:26',NULL),(276,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 01:33:29',NULL),(277,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 01:38:05',NULL),(278,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 01:51:01',NULL),(279,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 01:52:43',NULL),(280,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 01:52:51',NULL),(281,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 01:53:23',NULL),(282,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 01:58:47',NULL),(283,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 01:59:44',NULL),(284,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:05:19',NULL),(285,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 02:07:04',NULL),(286,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:07:13',NULL),(287,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 02:10:57',NULL),(288,22,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-05-12 02:11:06',NULL),(289,11,NULL,NULL,NULL,NULL,NULL,'',NULL,'2023-05-12 02:11:12',NULL),(290,11,NULL,NULL,NULL,NULL,NULL,'',NULL,'2023-05-12 02:24:38',NULL),(291,11,NULL,NULL,NULL,NULL,NULL,'',NULL,'2023-05-12 02:26:08',NULL),(292,24,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-05-12 02:27:55',NULL),(293,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 02:28:01',NULL),(294,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:28:13',NULL),(295,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:33:38',NULL),(296,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:36:30',NULL),(297,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 02:36:33',NULL),(303,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 02:41:21',NULL),(304,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:41:30',NULL),(305,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 02:43:59',NULL),(312,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 02:51:51',NULL),(313,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:51:58',NULL),(314,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:53:14',NULL),(315,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:57:45',NULL),(316,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:58:48',NULL),(317,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:59:20',NULL),(318,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:59:26',NULL),(319,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 02:59:34',NULL),(320,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:01:22',NULL),(321,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:02:06',NULL),(322,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:02:08',NULL),(323,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:02:55',NULL),(324,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:02:59',NULL),(325,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:09:52',NULL),(326,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:13:38',NULL),(327,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:14:30',NULL),(328,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:14:32',NULL),(329,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:16:32',NULL),(330,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:16:57',NULL),(331,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:17:00',NULL),(332,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:17:06',NULL),(333,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:20:09',NULL),(334,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:20:12',NULL),(335,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:20:15',NULL),(336,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:21:06',NULL),(337,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:21:08',NULL),(338,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:21:14',NULL),(339,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:22:58',NULL),(340,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:23:45',NULL),(341,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:23:47',NULL),(342,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:23:53',NULL),(343,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:26:16',NULL),(344,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:26:18',NULL),(345,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:26:44',NULL),(346,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:26:48',NULL),(347,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'',NULL,'2023-05-12 03:26:51',NULL),(348,16,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'gm2','2023-05-12 04:02:30',NULL),(349,16,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'JDC','2023-05-12 05:06:05',NULL),(350,16,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'JSM','2023-05-12 05:11:51',NULL),(351,16,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'JSM','2023-05-12 05:13:09',NULL),(352,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 05:14:43',NULL),(353,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 05:14:50',NULL),(354,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-05-12 05:36:45',NULL),(355,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-05-12 05:38:05',NULL),(356,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-05-12 05:38:23',NULL),(357,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 07:35:14',NULL),(358,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 08:11:40',NULL),(359,16,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'JDC','2023-05-12 08:13:13',NULL),(360,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 09:10:12',NULL),(361,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-05-12 09:10:23',NULL),(362,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-12 09:10:31',NULL),(363,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-05-13 00:23:18',NULL),(364,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-13 00:23:27',NULL),(365,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 00:54:38',NULL),(366,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 01:36:12',NULL),(367,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 01:36:24',NULL),(368,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 04:57:37',NULL),(369,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 04:57:43',NULL),(370,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 04:58:00',NULL),(371,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 04:58:32',NULL),(372,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 04:58:41',NULL),(373,22,NULL,'jdc',NULL,NULL,NULL,NULL,NULL,'2023-05-14 10:59:09',NULL),(374,24,NULL,'JDC',NULL,NULL,NULL,NULL,NULL,'2023-05-14 10:59:24',NULL),(375,22,NULL,'jdc',NULL,NULL,NULL,NULL,NULL,'2023-05-14 10:59:46',NULL),(376,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-05-14 11:02:57',NULL),(377,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:03:06',NULL),(378,24,NULL,'JDC',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:05:09',NULL),(379,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:05:36',NULL),(380,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:11:45',NULL),(381,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:12:04',NULL),(382,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:12:14',NULL),(383,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:12:36',NULL),(384,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:22:35',NULL),(385,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:22:43',NULL),(386,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:41:00',NULL),(387,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:41:44',NULL),(388,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:41:51',NULL),(389,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:49:24',NULL),(390,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:49:24',NULL),(391,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:49:34',NULL),(392,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:49:46',NULL),(393,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:49:55',NULL),(394,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:49:55',NULL),(395,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:50:08',NULL),(396,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:51:19',NULL),(397,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:54:25',NULL),(398,24,NULL,'JDC',NULL,NULL,NULL,NULL,NULL,'2023-05-14 11:54:57',NULL),(399,24,NULL,'JDC',NULL,NULL,NULL,NULL,NULL,'2023-05-14 12:05:12',NULL),(400,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 12:06:10',NULL),(401,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 12:22:28',NULL),(402,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 15:36:49',NULL),(403,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 15:37:30',NULL),(404,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 16:05:01',NULL),(405,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 16:40:39',NULL),(406,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 18:23:37',NULL),(407,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-14 19:02:38',NULL),(408,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-15 00:06:35',NULL),(409,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-15 00:35:54',NULL),(410,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-15 02:14:49',NULL),(411,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-15 04:52:01',NULL),(412,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-15 07:14:07',NULL),(413,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-15 08:40:36',NULL),(414,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-15 23:49:26',NULL),(415,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-16 00:05:37',NULL),(416,6,NULL,NULL,1019,'Administrative Assistant I',NULL,NULL,NULL,'2023-05-16 01:58:05',NULL),(417,6,NULL,NULL,1019,'Administrative Assistant I',NULL,NULL,NULL,'2023-05-16 01:59:12',NULL),(418,8,NULL,'GeoTheDuke',1019,'Administrative Assistant I',NULL,NULL,NULL,'2023-05-16 01:59:12',NULL),(419,8,NULL,'GeoTheDuke',1019,'Administrative Assistant I',NULL,NULL,NULL,'2023-05-16 03:48:03',NULL),(420,8,NULL,'GeoTheDuke',1019,'Administrative Assistant I',NULL,NULL,NULL,'2023-05-16 03:48:54',NULL),(421,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-16 04:59:50',NULL),(422,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-16 05:37:28',NULL),(423,22,NULL,'JDC',NULL,NULL,NULL,NULL,NULL,'2023-05-16 07:42:06',NULL),(424,22,NULL,'JDC',NULL,NULL,NULL,NULL,NULL,'2023-05-16 07:43:41',NULL),(425,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-05-16 07:50:29',NULL),(426,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-16 07:50:36',NULL),(427,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-16 07:51:02',NULL),(428,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-16 08:52:51',NULL),(429,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:08:33',NULL),(430,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:08:39',NULL),(431,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:09:28',NULL),(432,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:10:37',NULL),(433,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:14:40',NULL),(434,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-05-17 00:15:20',NULL),(435,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:15:23',NULL),(436,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:15:49',NULL),(437,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:16:41',NULL),(438,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:21:31',NULL),(439,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:23:23',NULL),(440,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:23:37',NULL),(441,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:24:43',NULL),(442,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:25:36',NULL),(443,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:27:09',NULL),(444,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:28:02',NULL),(445,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:29:13',NULL),(446,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:29:27',NULL),(447,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 00:31:39',NULL),(448,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 05:08:20',NULL),(449,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-17 23:38:27',NULL),(450,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 00:02:39',NULL),(452,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 00:03:28',NULL),(454,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 00:05:33',NULL),(456,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 00:06:30',NULL),(458,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 00:07:40',NULL),(461,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 00:11:19',NULL),(462,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 00:15:45',NULL),(463,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 00:15:51',NULL),(464,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 00:16:07',NULL),(465,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 00:16:37',NULL),(466,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 00:16:44',NULL),(467,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:03:29',NULL),(468,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-05-18 01:04:14',NULL),(469,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:04:34','Retrieve applicant name or application code with the search string: 20'),(470,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:04:34','Retrieve applicant name or application code with the search string: 20'),(471,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:04:35','Retrieve applicant name or application code with the search string: 201'),(472,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:04:36','Retrieve applicant name or application code with the search string: 201'),(473,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:04:36','Retrieve applicant name or application code with the search string: 201'),(474,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:04:36','Retrieve applicant name or application code with the search string: 201'),(475,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:04:36','Retrieve applicant name or application code with the search string: n201'),(476,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:04:38','Retrieve applicant name or application code with the search string: n201'),(477,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:04:38','Retrieve applicant name or application code with the search string: n201'),(478,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:04:38','Retrieve applicant name or application code with the search string: n201'),(479,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:04:38','Retrieve applicant name or application code with the search string: n'),(480,8,NULL,'GeoTheDuke',1024,'Administrative Officer IV',NULL,NULL,NULL,'2023-05-18 01:05:11',NULL),(481,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:07:18','Retrieve applicant name or application code with the search string: n'),(482,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 01:57:20',NULL),(483,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:33:02','Retrieve applicant name or application code with the search string: n'),(484,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:33:17','Retrieve applicant name or application code with the search string: n'),(485,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:12','Retrieve applicant name or application code with the search string: D'),(486,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:12','Retrieve applicant name or application code with the search string: D'),(487,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:12','Retrieve applicant name or application code with the search string: Du'),(488,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:12','Retrieve applicant name or application code with the search string: Duk'),(489,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:12','Retrieve applicant name or application code with the search string: Duke'),(490,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:14','Retrieve applicant name or application code with the search string: Duk'),(491,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:16','Retrieve applicant name or application code with the search string: Duke'),(492,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:35','Retrieve applicant name or application code with the search string: D'),(493,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:35','Retrieve applicant name or application code with the search string: D'),(494,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:36','Retrieve applicant name or application code with the search string: Du'),(495,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:36','Retrieve applicant name or application code with the search string: Duke'),(496,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:37:36','Retrieve applicant name or application code with the search string: Duke'),(497,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:52:35',NULL),(498,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:52:48','Retrieve applicant name or application code with the search string: D'),(499,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:52:48','Retrieve applicant name or application code with the search string: Du'),(500,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:52:48','Retrieve applicant name or application code with the search string: Du'),(501,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:52:48','Retrieve applicant name or application code with the search string: Duke'),(502,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:52:48','Retrieve applicant name or application code with the search string: Duke'),(503,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:53:42','Retrieve applicant name or application code with the search string: d'),(504,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:53:42','Retrieve applicant name or application code with the search string: du'),(505,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:53:42','Retrieve applicant name or application code with the search string: duk'),(506,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:53:43','Retrieve applicant name or application code with the search string: duke'),(507,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:58:20','Retrieve applicant name or application code with the search string: 1'),(508,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:58:21','Retrieve applicant name or application code with the search string: 10'),(509,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:58:21','Retrieve applicant name or application code with the search string: 101'),(510,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:58:21','Retrieve applicant name or application code with the search string: 1019'),(511,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:58:32','Retrieve applicant name or application code with the search string: C'),(512,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:58:32','Retrieve applicant name or application code with the search string: C'),(513,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:58:32','Retrieve applicant name or application code with the search string: C'),(514,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:58:32','Retrieve applicant name or application code with the search string: Cr'),(515,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:58:32','Retrieve applicant name or application code with the search string: Cru'),(516,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 03:58:33','Retrieve applicant name or application code with the search string: Cruz'),(517,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:08:58','Retrieve applicant name or application code with the search string: 5'),(518,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:09:00','Retrieve applicant name or application code with the search string: %'),(519,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:09:01','Retrieve applicant name or application code with the search string: %'),(520,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:09:51','Retrieve applicant name or application code with the search string: 1'),(521,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:09:51','Retrieve applicant name or application code with the search string: 101'),(522,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:09:51','Retrieve applicant name or application code with the search string: 101'),(523,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:09:52','Retrieve applicant name or application code with the search string: 1018'),(524,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:10:29','Retrieve applicant name or application code with the search string: D'),(525,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:10:29','Retrieve applicant name or application code with the search string: D'),(526,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:10:29','Retrieve applicant name or application code with the search string: Du'),(527,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:10:29','Retrieve applicant name or application code with the search string: Duk'),(528,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:10:29','Retrieve applicant name or application code with the search string: Duke'),(529,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:15:26','Retrieve applicant name or application code with the search string: m'),(530,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:15:26','Retrieve applicant name or application code with the search string: mfs'),(531,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:15:26','Retrieve applicant name or application code with the search string: mfs'),(532,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:15:44','Retrieve applicant name or application code with the search string: s'),(533,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:15:44','Retrieve applicant name or application code with the search string: sd'),(534,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:15:44','Retrieve applicant name or application code with the search string: sd'),(535,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:15:44','Retrieve applicant name or application code with the search string: sdt'),(536,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:16:11','Retrieve applicant name or application code with the search string: 1'),(537,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:16:11','Retrieve applicant name or application code with the search string: 10'),(538,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:16:12','Retrieve applicant name or application code with the search string: 1024'),(539,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 04:16:12','Retrieve applicant name or application code with the search string: 1024'),(540,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 05:29:00',NULL),(541,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 05:29:06',NULL),(542,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 05:55:14',NULL),(543,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 05:55:25','Retrieve applicant name or application code with the search string: n'),(544,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 05:55:35','Retrieve applicant name or application code with the search string: 10'),(545,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 05:55:35','Retrieve applicant name or application code with the search string: 10'),(546,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 05:55:35','Retrieve applicant name or application code with the search string: 1018'),(547,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 05:55:35','Retrieve applicant name or application code with the search string: 1018'),(548,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 05:57:02','Retrieve applicant name or application code with the search string: n'),(549,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 06:33:48',NULL),(550,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 06:44:46',NULL),(551,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 07:09:39',NULL),(552,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 07:20:04','Retrieve applicant name or application code with the search string: n'),(553,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 07:26:42','Retrieve applicant name or application code with the search string: n'),(554,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:31:35',NULL),(555,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:31:42','Retrieve applicant name or application code with the search string: n'),(556,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:31:45','Retrieve applicant name or application code with the search string: n'),(557,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:36:42','Retrieve applicant name or application code with the search string: n'),(558,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:38:21','Retrieve applicant name or application code with the search string: n'),(559,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:47:42',NULL),(560,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:06','Retrieve applicant name or application code with the search string: f'),(561,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:07','Retrieve applicant name or application code with the search string: f'),(562,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:08','Retrieve applicant name or application code with the search string: g'),(563,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:09','Retrieve applicant name or application code with the search string: g'),(564,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:09','Retrieve applicant name or application code with the search string: r'),(565,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:10','Retrieve applicant name or application code with the search string: r'),(566,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:11','Retrieve applicant name or application code with the search string: e'),(567,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:11','Retrieve applicant name or application code with the search string: e'),(568,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:12','Retrieve applicant name or application code with the search string: f'),(569,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:13','Retrieve applicant name or application code with the search string: f'),(570,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:14','Retrieve applicant name or application code with the search string: b'),(571,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:16','Retrieve applicant name or application code with the search string: b'),(572,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:22','Retrieve applicant name or application code with the search string: n'),(573,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:23','Retrieve applicant name or application code with the search string: n'),(574,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:29','Retrieve applicant name or application code with the search string: n'),(575,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:29','Retrieve applicant name or application code with the search string: n'),(576,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:29','Retrieve applicant name or application code with the search string: ng'),(577,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:29','Retrieve applicant name or application code with the search string: ng'),(578,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:30','Retrieve applicant name or application code with the search string: ngf'),(579,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:30','Retrieve applicant name or application code with the search string: ngf'),(580,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:32','Retrieve applicant name or application code with the search string: ngf'),(581,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:33','Retrieve applicant name or application code with the search string: ng'),(582,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:33','Retrieve applicant name or application code with the search string: ng'),(583,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:33','Retrieve applicant name or application code with the search string: n'),(584,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:34','Retrieve applicant name or application code with the search string: n'),(585,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:35','Retrieve applicant name or application code with the search string: n'),(586,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:35','Retrieve applicant name or application code with the search string: n'),(587,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:36','Retrieve applicant name or application code with the search string: n'),(588,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:36','Retrieve applicant name or application code with the search string: nn'),(589,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:37','Retrieve applicant name or application code with the search string: nn'),(590,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:37','Retrieve applicant name or application code with the search string: n'),(591,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:39','Retrieve applicant name or application code with the search string: n'),(592,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:39','Retrieve applicant name or application code with the search string: n'),(593,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:39','Retrieve applicant name or application code with the search string: n'),(594,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:39','Retrieve applicant name or application code with the search string: n'),(595,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:40','Retrieve applicant name or application code with the search string: n'),(596,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:40','Retrieve applicant name or application code with the search string: nn'),(597,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:41','Retrieve applicant name or application code with the search string: nn'),(598,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:41','Retrieve applicant name or application code with the search string: n'),(599,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:42','Retrieve applicant name or application code with the search string: n'),(600,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:48:44','Retrieve applicant name or application code with the search string: n'),(601,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:38','Retrieve applicant name or application code with the search string: n'),(602,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:39','Retrieve applicant name or application code with the search string: n'),(603,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:39','Retrieve applicant name or application code with the search string: n'),(604,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:40','Retrieve applicant name or application code with the search string: nf'),(605,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:40','Retrieve applicant name or application code with the search string: nf'),(606,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:40','Retrieve applicant name or application code with the search string: nf'),(607,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:40','Retrieve applicant name or application code with the search string: nfd'),(608,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:40','Retrieve applicant name or application code with the search string: nfd'),(609,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:40','Retrieve applicant name or application code with the search string: nfd'),(610,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:41','Retrieve applicant name or application code with the search string: nfdf'),(611,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:43','Retrieve applicant name or application code with the search string: nfdf'),(612,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:43','Retrieve applicant name or application code with the search string: nfdf'),(613,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:43','Retrieve applicant name or application code with the search string: nfdfd'),(614,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:46','Retrieve applicant name or application code with the search string: nfdfd'),(615,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:46','Retrieve applicant name or application code with the search string: nfdf'),(616,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:47','Retrieve applicant name or application code with the search string: nfdf'),(617,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:47','Retrieve applicant name or application code with the search string: nfd'),(618,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:47','Retrieve applicant name or application code with the search string: nfd'),(619,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:47','Retrieve applicant name or application code with the search string: nf'),(620,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:48','Retrieve applicant name or application code with the search string: nf'),(621,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:48','Retrieve applicant name or application code with the search string: n'),(622,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:50','Retrieve applicant name or application code with the search string: n'),(623,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:51','Retrieve applicant name or application code with the search string: 1'),(624,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:51','Retrieve applicant name or application code with the search string: 1'),(625,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:51','Retrieve applicant name or application code with the search string: 10'),(626,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:51','Retrieve applicant name or application code with the search string: 10'),(627,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:51','Retrieve applicant name or application code with the search string: 10'),(628,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:51','Retrieve applicant name or application code with the search string: 10'),(629,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:52','Retrieve applicant name or application code with the search string: 102'),(630,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:52','Retrieve applicant name or application code with the search string: 102'),(631,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:52','Retrieve applicant name or application code with the search string: 10'),(632,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:53','Retrieve applicant name or application code with the search string: 10'),(633,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:53','Retrieve applicant name or application code with the search string: 1'),(634,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:53','Retrieve applicant name or application code with the search string: 1'),(635,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:54','Retrieve applicant name or application code with the search string: 1'),(636,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:54','Retrieve applicant name or application code with the search string: 1'),(637,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:54','Retrieve applicant name or application code with the search string: 1'),(638,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:49:54','Retrieve applicant name or application code with the search string: 10'),(639,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:50:03','Retrieve applicant name or application code with the search string: 10'),(640,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:50:03','Retrieve applicant name or application code with the search string: 10'),(641,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:50:04','Retrieve applicant name or application code with the search string: 10'),(642,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:50:04','Retrieve applicant name or application code with the search string: 1'),(643,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:50:04','Retrieve applicant name or application code with the search string: 1'),(644,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:12','Retrieve applicant name or application code with the search string: n'),(645,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:15','Retrieve applicant name or application code with the search string: n'),(646,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:17','Retrieve applicant name or application code with the search string: n'),(647,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:24','Retrieve applicant name or application code with the search string: n'),(648,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:24','Retrieve applicant name or application code with the search string: n'),(649,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:24','Retrieve applicant name or application code with the search string: nn'),(650,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:25','Retrieve applicant name or application code with the search string: nn'),(651,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:25','Retrieve applicant name or application code with the search string: n'),(652,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:27','Retrieve applicant name or application code with the search string: n'),(653,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:32','Retrieve applicant name or application code with the search string: n'),(654,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:33','Retrieve applicant name or application code with the search string: n'),(655,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:34','Retrieve applicant name or application code with the search string: n'),(656,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:35','Retrieve applicant name or application code with the search string: n'),(657,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:35','Retrieve applicant name or application code with the search string: n'),(658,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:36','Retrieve applicant name or application code with the search string: n'),(659,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:36','Retrieve applicant name or application code with the search string: n'),(660,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:38','Retrieve applicant name or application code with the search string: n'),(661,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:38','Retrieve applicant name or application code with the search string: n'),(662,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:39','Retrieve applicant name or application code with the search string: n'),(663,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:40','Retrieve applicant name or application code with the search string: n'),(664,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:54:46','Retrieve applicant name or application code with the search string: n'),(665,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:19','Retrieve applicant name or application code with the search string: n'),(666,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:19','Retrieve applicant name or application code with the search string: nn'),(667,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:20','Retrieve applicant name or application code with the search string: nnn'),(668,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:21','Retrieve applicant name or application code with the search string: nn'),(669,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:22','Retrieve applicant name or application code with the search string: n'),(670,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:24','Retrieve applicant name or application code with the search string: n'),(671,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:26','Retrieve applicant name or application code with the search string: nd'),(672,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:27','Retrieve applicant name or application code with the search string: n'),(673,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:27','Retrieve applicant name or application code with the search string: n'),(674,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:28','Retrieve applicant name or application code with the search string: n'),(675,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:30','Retrieve applicant name or application code with the search string: n'),(676,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:30','Retrieve applicant name or application code with the search string: nn'),(677,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:32','Retrieve applicant name or application code with the search string: n'),(678,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:34','Retrieve applicant name or application code with the search string: n'),(679,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:37','Retrieve applicant name or application code with the search string: n'),(680,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:38','Retrieve applicant name or application code with the search string: n'),(681,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:39','Retrieve applicant name or application code with the search string: nn'),(682,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:40','Retrieve applicant name or application code with the search string: n'),(683,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:42','Retrieve applicant name or application code with the search string: n'),(684,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:44','Retrieve applicant name or application code with the search string: n'),(685,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:45','Retrieve applicant name or application code with the search string: n'),(686,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:47','Retrieve applicant name or application code with the search string: n'),(687,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:49','Retrieve applicant name or application code with the search string: nn'),(688,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:50','Retrieve applicant name or application code with the search string: n'),(689,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:52','Retrieve applicant name or application code with the search string: n'),(690,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:53','Retrieve applicant name or application code with the search string: nn'),(691,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:54','Retrieve applicant name or application code with the search string: nnn'),(692,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:55','Retrieve applicant name or application code with the search string: nn'),(693,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:55','Retrieve applicant name or application code with the search string: n'),(694,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:57','Retrieve applicant name or application code with the search string: n'),(695,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:55:59','Retrieve applicant name or application code with the search string: n'),(696,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:01','Retrieve applicant name or application code with the search string: n'),(697,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:02','Retrieve applicant name or application code with the search string: nn'),(698,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:03','Retrieve applicant name or application code with the search string: n'),(699,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:04','Retrieve applicant name or application code with the search string: nn'),(700,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:04','Retrieve applicant name or application code with the search string: nnn'),(701,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:05','Retrieve applicant name or application code with the search string: nn'),(702,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:06','Retrieve applicant name or application code with the search string: n'),(703,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:08','Retrieve applicant name or application code with the search string: n'),(704,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:10','Retrieve applicant name or application code with the search string: n'),(705,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:13','Retrieve applicant name or application code with the search string: n'),(706,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:15','Retrieve applicant name or application code with the search string: n'),(707,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:15','Retrieve applicant name or application code with the search string: nn'),(708,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:16','Retrieve applicant name or application code with the search string: n'),(709,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:20','Retrieve applicant name or application code with the search string: n'),(710,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:27','Retrieve applicant name or application code with the search string: nn'),(711,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:28','Retrieve applicant name or application code with the search string: nnn'),(712,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:29','Retrieve applicant name or application code with the search string: nnng'),(713,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:30','Retrieve applicant name or application code with the search string: nnngn'),(714,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:31','Retrieve applicant name or application code with the search string: nnng'),(715,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:32','Retrieve applicant name or application code with the search string: nnn'),(716,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:32','Retrieve applicant name or application code with the search string: nn'),(717,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:32','Retrieve applicant name or application code with the search string: n'),(718,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:34','Retrieve applicant name or application code with the search string: n'),(719,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:35','Retrieve applicant name or application code with the search string: nn'),(720,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-18 08:56:36','Retrieve applicant name or application code with the search string: n'),(721,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:20:17',NULL),(722,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:30:27',NULL),(723,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:35:47','Retrieve applicant name or application code with the search string: n'),(724,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:35:52','Retrieve applicant name or application code with the search string: n'),(725,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:01','Retrieve applicant name or application code with the search string: n'),(726,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:06','Retrieve applicant name or application code with the search string: f'),(727,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:06','Retrieve applicant name or application code with the search string: fd'),(728,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:07','Retrieve applicant name or application code with the search string: f'),(729,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:08','Retrieve applicant name or application code with the search string: f'),(730,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:09','Retrieve applicant name or application code with the search string: n'),(731,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:11','Retrieve applicant name or application code with the search string: 1'),(732,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:14','Retrieve applicant name or application code with the search string: a'),(733,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:16','Retrieve applicant name or application code with the search string: %'),(734,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:16','Retrieve applicant name or application code with the search string: %'),(735,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:20','Retrieve applicant name or application code with the search string: %'),(736,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:21','Retrieve applicant name or application code with the search string: %'),(737,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:22','Retrieve applicant name or application code with the search string: %'),(738,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:23','Retrieve applicant name or application code with the search string: %'),(739,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:25','Retrieve applicant name or application code with the search string: %'),(740,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:36:25','Retrieve applicant name or application code with the search string: %'),(741,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:39:18','Retrieve applicant name or application code with the search string: n'),(742,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:14','Retrieve applicant name or application code with the search string: n'),(743,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:15','Retrieve applicant name or application code with the search string: n'),(744,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:16','Retrieve applicant name or application code with the search string: %'),(745,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:16','Retrieve applicant name or application code with the search string: %'),(746,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:20','Retrieve applicant name or application code with the search string: %'),(747,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:20','Retrieve applicant name or application code with the search string: %'),(748,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:21','Retrieve applicant name or application code with the search string: %'),(749,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:22','Retrieve applicant name or application code with the search string: %'),(750,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:23','Retrieve applicant name or application code with the search string: %'),(751,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:24','Retrieve applicant name or application code with the search string: %'),(752,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:24','Retrieve applicant name or application code with the search string: %'),(753,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:44:48','Retrieve applicant name or application code with the search string: n'),(754,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:45:05','Retrieve applicant name or application code with the search string: n'),(755,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:45:08','Retrieve applicant name or application code with the search string: n'),(756,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:45:09','Retrieve applicant name or application code with the search string: %'),(757,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:45:09','Retrieve applicant name or application code with the search string: %'),(758,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:45:17','Retrieve applicant name or application code with the search string: %'),(759,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:45:17','Retrieve applicant name or application code with the search string: %'),(760,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:45:46','Retrieve applicant name or application code with the search string: n'),(761,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:51:08','Retrieve applicant name or application code with the search string: sa'),(762,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:51:08','Retrieve applicant name or application code with the search string: sa'),(763,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:51:10','Retrieve applicant name or application code with the search string: s'),(764,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:53:05','Retrieve applicant name or application code with the search string: %'),(765,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:53:05','Retrieve applicant name or application code with the search string: %'),(766,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:18','Retrieve applicant name or application code with the search string: %'),(767,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:19','Retrieve applicant name or application code with the search string: %'),(768,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:20','Retrieve applicant name or application code with the search string: %'),(769,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:21','Retrieve applicant name or application code with the search string: %'),(770,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:22','Retrieve applicant name or application code with the search string: %'),(771,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:23','Retrieve applicant name or application code with the search string: %'),(772,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:24','Retrieve applicant name or application code with the search string: %'),(773,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:25','Retrieve applicant name or application code with the search string: %'),(774,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:26','Retrieve applicant name or application code with the search string: %'),(775,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:28','Retrieve applicant name or application code with the search string: %'),(776,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:29','Retrieve applicant name or application code with the search string: %'),(777,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:30','Retrieve applicant name or application code with the search string: %'),(778,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:32','Retrieve applicant name or application code with the search string: %'),(779,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:34','Retrieve applicant name or application code with the search string: %'),(780,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:38','Retrieve applicant name or application code with the search string: %'),(781,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:43','Retrieve applicant name or application code with the search string: %'),(782,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:43','Retrieve applicant name or application code with the search string: %'),(783,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:44','Retrieve applicant name or application code with the search string: %'),(784,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:45','Retrieve applicant name or application code with the search string: %'),(785,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:54:45','Retrieve applicant name or application code with the search string: %'),(786,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:59:34','Retrieve applicant name or application code with the search string: %'),(787,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 00:59:34','Retrieve applicant name or application code with the search string: %'),(788,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:07:09','Retrieve applicant name or application code with the search string: %'),(789,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:07:09','Retrieve applicant name or application code with the search string: %'),(790,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:07:31','Retrieve applicant name or application code with the search string: %'),(791,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:07:31','Retrieve applicant name or application code with the search string: %'),(792,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:26:45','Retrieve applicant name or application code with the search string:  n'),(793,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:26:45','Retrieve applicant name or application code with the search string:  n'),(794,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:26:47','Retrieve applicant name or application code with the search string:  '),(795,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:27:43','Retrieve applicant name or application code with the search string: n'),(796,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:28:42','Retrieve applicant name or application code with the search string: n'),(797,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:33:10','Retrieve applicant name or application code with the search string: %'),(798,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:33:10','Retrieve applicant name or application code with the search string: %'),(799,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:33:11','Retrieve applicant name or application code with the search string: %'),(800,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:40:34','Retrieve applicant name or application code with the search string: n'),(801,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:41:06','Retrieve applicant name or application code with the search string: %'),(802,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:41:06','Retrieve applicant name or application code with the search string: %'),(803,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:41:26','Retrieve applicant name or application code with the search string: n'),(804,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:41:58','Retrieve applicant name or application code with the search string: n'),(805,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:44:33','Retrieve applicant name or application code with the search string: n'),(806,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:44:38','Retrieve applicant name or application code with the search string: n'),(807,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:44:38','Retrieve applicant name or application code with the search string: n'),(808,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:44:47','Retrieve applicant name or application code with the search string: n'),(809,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:46:32','Retrieve applicant name or application code with the search string: n'),(810,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:47:25','Retrieve applicant name or application code with the search string: n'),(811,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:47:34','Retrieve applicant name or application code with the search string: n'),(812,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:48:26','Retrieve applicant name or application code with the search string: n'),(813,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:49:38','Retrieve applicant name or application code with the search string: n'),(814,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:51:43','Retrieve applicant name or application code with the search string: n'),(815,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:51:46','Retrieve applicant name or application code with the search string: n'),(816,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:51:46','Retrieve applicant name or application code with the search string: %'),(817,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:51:47','Retrieve applicant name or application code with the search string: %'),(818,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:52:32','Retrieve applicant name or application code with the search string: n'),(819,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:53:04','Retrieve applicant name or application code with the search string: n'),(820,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:54:37','Retrieve applicant name or application code with the search string: n'),(821,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:54:42','Retrieve applicant name or application code with the search string: n'),(822,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:55:09','Retrieve applicant name or application code with the search string: n'),(823,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:55:16','Retrieve applicant name or application code with the search string: n'),(824,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:55:17','Retrieve applicant name or application code with the search string: n'),(825,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:55:18','Retrieve applicant name or application code with the search string: n'),(826,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:55:18','Retrieve applicant name or application code with the search string: n'),(827,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:55:23','Retrieve applicant name or application code with the search string: n'),(828,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:55:23','Retrieve applicant name or application code with the search string: n'),(829,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:06','Retrieve applicant name or application code with the search string: n'),(830,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:16','Retrieve applicant name or application code with the search string: n'),(831,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:25','Retrieve applicant name or application code with the search string: n'),(832,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:33','Retrieve applicant name or application code with the search string: b'),(833,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:36','Retrieve applicant name or application code with the search string: b'),(834,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:36','Retrieve applicant name or application code with the search string: 1'),(835,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:36','Retrieve applicant name or application code with the search string: 1'),(836,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:37','Retrieve applicant name or application code with the search string: 10'),(837,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:39','Retrieve applicant name or application code with the search string: 10'),(838,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:39','Retrieve applicant name or application code with the search string: 10'),(839,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:40','Retrieve applicant name or application code with the search string: 10'),(840,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 01:56:41','Retrieve applicant name or application code with the search string: 101'),(841,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:02:54','Retrieve applicant name or application code with the search string: n'),(842,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:02:55','Retrieve applicant name or application code with the search string: n'),(843,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:03:02','Retrieve applicant name or application code with the search string: n'),(844,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:03:05','Retrieve applicant name or application code with the search string: n'),(845,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:03:05','Retrieve applicant name or application code with the search string: n'),(846,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:03:06','Retrieve applicant name or application code with the search string: m'),(847,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:05:44','Retrieve applicant name or application code with the search string: n'),(848,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:11:40','Retrieve applicant name or application code with the search string: n'),(849,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:14:19','Retrieve applicant name or application code with the search string: n'),(850,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:16:42','Retrieve applicant name or application code with the search string: n'),(851,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:17:02','Retrieve applicant name or application code with the search string: j'),(852,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:19:44','Retrieve applicant name or application code with the search string: n'),(853,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:20:06','Retrieve applicant name or application code with the search string: n'),(854,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:20:16','Retrieve applicant name or application code with the search string: n'),(855,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:20:26','Retrieve applicant name or application code with the search string: n'),(856,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:20:40','Retrieve applicant name or application code with the search string: n'),(857,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:21:29','Retrieve applicant name or application code with the search string: n'),(858,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:22:42','Retrieve applicant name or application code with the search string: n'),(859,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:22:45','Retrieve applicant name or application code with the search string: n'),(860,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:22:45','Retrieve applicant name or application code with the search string: n'),(861,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:22:51','Retrieve applicant name or application code with the search string: n'),(862,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:29:29','Retrieve applicant name or application code with the search string: n'),(863,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:35:41','Retrieve applicant name or application code with the search string: n'),(864,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:36:28','Retrieve applicant name or application code with the search string: n'),(865,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:36:53','Retrieve applicant name or application code with the search string: n'),(866,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:38:59','Retrieve applicant name or application code with the search string: n'),(867,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:39:19',NULL),(868,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:39:30','Retrieve applicant name or application code with the search string: n'),(869,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:43:14','Retrieve applicant name or application code with the search string: n'),(870,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:44:32','Retrieve applicant name or application code with the search string: n'),(871,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:57:24','Retrieve applicant name or application code with the search string: n'),(872,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:57:42','Retrieve applicant name or application code with the search string: n'),(873,6,NULL,NULL,1024,'Administrative Officer IV','ADOF4-270047-2023',NULL,NULL,'2023-05-19 02:58:57',NULL),(874,8,NULL,'GeoTheDuke',1024,'Administrative Officer IV',NULL,NULL,NULL,'2023-05-19 02:58:57',NULL),(875,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 02:59:09','Retrieve applicant name or application code with the search string: n'),(876,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 03:01:47','Retrieve applicant name or application code with the search string: n'),(877,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 03:03:16','Retrieve applicant name or application code with the search string: n'),(878,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 03:03:20','Retrieve applicant name or application code with the search string: na'),(879,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 03:03:36','Retrieve applicant name or application code with the search string: n'),(880,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 03:04:31','Retrieve applicant name or application code with the search string: n'),(881,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 03:04:35','Retrieve applicant name or application code with the search string: nn'),(882,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 03:16:14',NULL),(883,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 03:16:53','Retrieve applicant name or application code with the search string: n'),(884,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 04:01:42',NULL),(885,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 04:07:13',NULL),(886,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 04:07:30','Retrieve applicant name or application code with the search string: n'),(887,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 04:08:26','Retrieve applicant name or application code with the search string: N'),(888,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 05:01:29',NULL),(889,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 05:04:19',NULL),(890,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-05-19 06:45:13',NULL),(891,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 06:47:36',NULL),(892,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 06:59:26','Retrieve applicant name or application code with the search string: n'),(893,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:03:56','Retrieve applicant name or application code with the search string: te'),(894,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:03:56','Retrieve applicant name or application code with the search string: te'),(895,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:03:57','Retrieve applicant name or application code with the search string: tec'),(896,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:03:58','Retrieve applicant name or application code with the search string: te'),(897,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:03:58','Retrieve applicant name or application code with the search string: t'),(898,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:03:59','Retrieve applicant name or application code with the search string: t'),(899,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:03:59','Retrieve applicant name or application code with the search string: tch'),(900,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:03:59','Retrieve applicant name or application code with the search string: tch'),(901,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:08:38','Retrieve applicant name or application code with the search string: n'),(902,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:10:41','Retrieve applicant name or application code with the search string: n'),(903,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:02','Retrieve applicant name or application code with the search string: t'),(904,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:02','Retrieve applicant name or application code with the search string: tc'),(905,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:02','Retrieve applicant name or application code with the search string: tch'),(906,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:30','Retrieve applicant name or application code with the search string: t'),(907,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:30','Retrieve applicant name or application code with the search string: tc'),(908,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:31','Retrieve applicant name or application code with the search string: tch'),(909,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:40','Retrieve applicant name or application code with the search string: t'),(910,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:40','Retrieve applicant name or application code with the search string: th'),(911,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:42','Retrieve applicant name or application code with the search string: t'),(912,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:43','Retrieve applicant name or application code with the search string: tc'),(913,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:43','Retrieve applicant name or application code with the search string: tch'),(914,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:57','Retrieve applicant name or application code with the search string: t'),(915,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:57','Retrieve applicant name or application code with the search string: tc'),(916,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:12:57','Retrieve applicant name or application code with the search string: tch'),(917,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:27:37','Retrieve applicant name or application code with the search string: n'),(918,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:44:44','Retrieve applicant name or application code with the search string: t'),(919,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:44:45','Retrieve applicant name or application code with the search string: tc'),(920,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:44:45','Retrieve applicant name or application code with the search string: tch'),(921,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:46:09',NULL),(922,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 07:46:14','Retrieve applicant name or application code with the search string: n'),(923,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-05-19 07:49:59',NULL),(924,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:01:33','Retrieve applicant name or application code with the search string: t'),(925,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:01:33','Retrieve applicant name or application code with the search string: tc'),(926,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:01:33','Retrieve applicant name or application code with the search string: tch'),(927,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:08:36','Retrieve applicant name or application code with the search string: tch'),(928,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:09:51','Retrieve applicant name or application code with the search string: tch'),(929,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:12:49','Retrieve applicant name or application code with the search string: t'),(930,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:12:50','Retrieve applicant name or application code with the search string: tc'),(931,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:12:50','Retrieve applicant name or application code with the search string: tch'),(932,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:14:22','Retrieve applicant name or application code with the search string: n'),(933,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:16:11','Retrieve applicant name or application code with the search string: n'),(934,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:16:55','Retrieve applicant name or application code with the search string: t'),(935,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:16:55','Retrieve applicant name or application code with the search string: tc'),(936,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:16:57','Retrieve applicant name or application code with the search string: tch'),(937,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:19:14','Retrieve applicant name or application code with the search string: t'),(938,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:19:14','Retrieve applicant name or application code with the search string: tc'),(939,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:19:15','Retrieve applicant name or application code with the search string: tch'),(940,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:21:34','Retrieve applicant name or application code with the search string: t'),(941,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:21:34','Retrieve applicant name or application code with the search string: tc'),(942,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:21:34','Retrieve applicant name or application code with the search string: tch'),(943,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:22:05','Retrieve applicant name or application code with the search string: t'),(944,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:22:05','Retrieve applicant name or application code with the search string: tc'),(945,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:22:05','Retrieve applicant name or application code with the search string: tch'),(946,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:22:28','Retrieve applicant name or application code with the search string: n'),(947,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:22:47','Retrieve applicant name or application code with the search string: n'),(948,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:24:29','Retrieve applicant name or application code with the search string: n'),(949,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:25:58','Retrieve applicant name or application code with the search string: n'),(950,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-19 08:26:39','Retrieve applicant name or application code with the search string: n'),(951,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-20 00:57:57',NULL),(952,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-22 00:35:39',NULL),(953,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-22 00:37:33','Retrieve applicant name or application code with the search string: n'),(954,22,NULL,'geotheduke',NULL,NULL,NULL,NULL,NULL,'2023-05-22 00:42:04',NULL),(955,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-22 01:58:18',NULL),(956,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-22 03:35:28',NULL),(957,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-22 03:35:40','Retrieve applicant name or application code with the search string: n'),(958,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-22 03:35:42','Retrieve applicant name or application code with the search string: n'),(959,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-22 05:00:23',NULL),(960,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-22 08:58:58',NULL),(961,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 00:00:09',NULL),(962,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 01:10:17','Retrieve applicant name or application code with the search string: n'),(963,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 01:12:10','Retrieve applicant name or application code with the search string: t'),(964,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 01:12:10','Retrieve applicant name or application code with the search string: tc'),(965,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 01:12:11','Retrieve applicant name or application code with the search string: tch'),(966,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 01:32:06',NULL),(967,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 02:29:07','Retrieve applicant name or application code with the search string: n'),(968,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 02:30:24','Retrieve applicant name or application code with the search string: n'),(969,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 02:35:05',NULL),(970,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 02:53:44','Retrieve applicant name or application code with the search string: t'),(971,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 02:53:44','Retrieve applicant name or application code with the search string: tc'),(972,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 02:53:44','Retrieve applicant name or application code with the search string: tc2'),(973,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 02:53:46','Retrieve applicant name or application code with the search string: tc'),(974,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:05:39','Retrieve applicant name or application code with the search string: t'),(975,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:05:39','Retrieve applicant name or application code with the search string: tc'),(976,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:05:39','Retrieve applicant name or application code with the search string: tch'),(977,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:07:29','Retrieve applicant name or application code with the search string: t'),(978,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:07:30','Retrieve applicant name or application code with the search string: tc'),(979,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:07:30','Retrieve applicant name or application code with the search string: tc'),(980,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:07:30','Retrieve applicant name or application code with the search string: tcj'),(981,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:07:31','Retrieve applicant name or application code with the search string: tc'),(982,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:07:31','Retrieve applicant name or application code with the search string: tch'),(983,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:08:07','Retrieve applicant name or application code with the search string: n'),(984,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:08:32','Retrieve applicant name or application code with the search string: t'),(985,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:08:33','Retrieve applicant name or application code with the search string: tc'),(986,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:08:33','Retrieve applicant name or application code with the search string: tch'),(987,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:09:30','Retrieve applicant name or application code with the search string: t'),(988,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:09:30','Retrieve applicant name or application code with the search string: tc'),(989,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:09:30','Retrieve applicant name or application code with the search string: tch'),(990,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:11:40','Retrieve applicant name or application code with the search string: t'),(991,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:11:41','Retrieve applicant name or application code with the search string: tc'),(992,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:12:31','Retrieve applicant name or application code with the search string: n'),(993,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:13:08','Retrieve applicant name or application code with the search string: n'),(994,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:14:18','Retrieve applicant name or application code with the search string: n'),(995,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:17:25','Retrieve applicant name or application code with the search string: f'),(996,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:17:28','Retrieve applicant name or application code with the search string: c'),(997,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:17:29','Retrieve applicant name or application code with the search string: ch'),(998,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:17:39','Retrieve applicant name or application code with the search string: c'),(999,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:17:39','Retrieve applicant name or application code with the search string: ch'),(1000,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:20:01','Retrieve applicant name or application code with the search string: t'),(1001,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:20:02','Retrieve applicant name or application code with the search string: tc'),(1002,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:20:03','Retrieve applicant name or application code with the search string: tch'),(1003,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:21:24','Retrieve applicant name or application code with the search string: n'),(1004,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:22:55','Retrieve applicant name or application code with the search string: n'),(1005,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:24:03','Retrieve applicant name or application code with the search string: n'),(1006,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:40:00','Retrieve applicant name or application code with the search string: n'),(1007,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:40:25','Retrieve applicant name or application code with the search string: t'),(1008,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:40:26','Retrieve applicant name or application code with the search string: tc'),(1009,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:50:12','Retrieve applicant name or application code with the search string: n'),(1010,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:53:52','Retrieve applicant name or application code with the search string: t'),(1011,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:53:52','Retrieve applicant name or application code with the search string: tc'),(1012,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:53:53','Retrieve applicant name or application code with the search string: tch'),(1013,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 03:59:12','Retrieve applicant name or application code with the search string: n'),(1014,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:07:52',NULL),(1015,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:08:06','Retrieve applicant name or application code with the search string: n'),(1016,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:09:32','Retrieve applicant name or application code with the search string: n'),(1017,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:14:03','Retrieve applicant name or application code with the search string: t'),(1018,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:14:03','Retrieve applicant name or application code with the search string: t'),(1019,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:14:03','Retrieve applicant name or application code with the search string: tc'),(1020,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:14:05','Retrieve applicant name or application code with the search string: tch'),(1021,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:22:20','Retrieve applicant name or application code with the search string: n'),(1022,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:24:43','Retrieve applicant name or application code with the search string: n'),(1023,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:29:24','Retrieve applicant name or application code with the search string: n'),(1024,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:30:51','Retrieve applicant name or application code with the search string: n'),(1025,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:40:16',NULL),(1026,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:40:21','Retrieve applicant name or application code with the search string: n'),(1027,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:49:02','Retrieve applicant name or application code with the search string: t'),(1028,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 05:49:02','Retrieve applicant name or application code with the search string: tc'),(1029,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:14:04',NULL),(1030,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:14:09','Retrieve applicant name or application code with the search string: n'),(1031,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:16:39','Retrieve applicant name or application code with the search string: n'),(1032,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:17:34','Retrieve applicant name or application code with the search string: n'),(1033,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:28:17','Retrieve applicant name or application code with the search string: n'),(1034,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:32:30','Retrieve applicant name or application code with the search string: n'),(1035,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:36:47','Retrieve applicant name or application code with the search string: n'),(1036,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:38:31','Retrieve applicant name or application code with the search string: n'),(1037,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:41:01',NULL),(1038,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:41:12','Retrieve applicant name or application code with the search string: n'),(1039,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:50:53','Retrieve applicant name or application code with the search string: n'),(1040,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:53:30','Retrieve applicant name or application code with the search string: n'),(1041,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 06:53:37','Retrieve applicant name or application code with the search string: n'),(1042,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 07:20:15','Retrieve applicant name or application code with the search string: n'),(1043,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 07:22:24','Retrieve applicant name or application code with the search string: n'),(1044,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 07:36:05','Retrieve applicant name or application code with the search string: n'),(1045,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 08:10:18',NULL),(1046,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-23 23:59:39',NULL),(1047,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:07:50','Retrieve applicant name or application code with the search string: n'),(1048,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:14:04','Retrieve applicant name or application code with the search string: n'),(1049,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:23:55','Retrieve applicant name or application code with the search string: n'),(1050,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:24:49','Retrieve applicant name or application code with the search string: m'),(1051,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:24:50','Retrieve applicant name or application code with the search string: n'),(1052,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:36:20','Retrieve applicant name or application code with the search string: n'),(1053,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:39:44','Retrieve applicant name or application code with the search string: n'),(1054,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:43:06','Retrieve applicant name or application code with the search string: n'),(1055,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:43:44','Retrieve applicant name or application code with the search string: n'),(1056,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:44:18','Retrieve applicant name or application code with the search string: n'),(1057,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:44:20','Retrieve applicant name or application code with the search string: n'),(1058,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:45:59','Retrieve applicant name or application code with the search string: n'),(1059,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:46:01','Retrieve applicant name or application code with the search string: n'),(1060,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:49:58','Retrieve applicant name or application code with the search string: n'),(1061,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 00:50:00','Retrieve applicant name or application code with the search string: n'),(1062,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 01:25:08','Retrieve applicant name or application code with the search string: 10'),(1063,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 01:25:08','Retrieve applicant name or application code with the search string: 10'),(1064,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 01:25:08','Retrieve applicant name or application code with the search string: 1024'),(1065,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 01:25:08','Retrieve applicant name or application code with the search string: 1024'),(1066,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 01:35:16','Retrieve applicant name or application code with the search string: n'),(1067,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 01:35:17','Retrieve applicant name or application code with the search string: n'),(1068,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 02:36:06','Retrieve applicant name or application code with the search string: n'),(1069,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 03:23:09',NULL),(1070,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 04:44:52',NULL),(1071,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 05:02:14',NULL),(1072,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 05:50:22',NULL),(1073,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 05:50:28',NULL),(1074,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 06:46:22',NULL),(1075,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 06:46:28',NULL),(1076,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 06:47:49','Retrieve applicant name or application code with the search string: n'),(1077,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 06:57:21',NULL),(1078,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 06:58:30','Retrieve applicant name or application code with the search string: n'),(1079,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 07:05:48',NULL),(1080,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-24 08:41:53','Retrieve applicant name or application code with the search string: n'),(1081,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 00:12:57',NULL),(1082,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 00:13:59',NULL),(1083,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-05-25 00:48:28',NULL),(1084,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 00:50:21',NULL),(1085,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 00:53:47','Retrieve applicant name or application code with the search string: n'),(1086,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 00:54:09',NULL),(1087,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 00:59:16',NULL),(1088,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 01:17:27',NULL),(1089,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 01:20:07',NULL),(1090,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 01:22:17',NULL),(1091,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 01:41:17',NULL),(1092,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 02:26:11',NULL),(1093,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 05:07:46',NULL),(1094,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 05:16:50',NULL),(1095,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 05:17:20',NULL),(1096,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 05:43:13',NULL),(1097,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 05:43:23',NULL),(1098,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 05:53:44',NULL),(1099,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 05:58:13',NULL),(1100,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 05:58:18',NULL),(1101,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:00:23',NULL),(1102,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:00:27',NULL),(1103,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:01:56',NULL),(1104,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:02:01',NULL),(1105,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:03:08',NULL),(1106,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:03:16',NULL),(1107,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:03:48',NULL),(1108,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:03:59',NULL),(1109,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:09:46',NULL),(1110,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:10:34',NULL),(1111,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:11:26',NULL),(1112,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:12:10',NULL),(1113,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:15:40',NULL),(1114,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:22:16',NULL),(1115,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:22:26',NULL),(1116,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:23:28',NULL),(1118,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:26:05',NULL),(1119,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:26:10',NULL),(1125,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:27:00',NULL),(1126,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:27:10',NULL),(1127,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:29:12',NULL),(1128,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:29:18',NULL),(1129,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:30:12',NULL),(1130,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:30:17',NULL),(1133,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:32:08',NULL),(1134,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:32:16',NULL),(1135,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:33:15',NULL),(1136,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:33:25',NULL),(1137,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:35:47',NULL),(1138,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:35:53',NULL),(1141,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:37:31',NULL),(1142,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:37:37',NULL),(1143,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:38:02',NULL),(1144,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:41:20',NULL),(1145,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:49:07',NULL),(1146,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:49:13',NULL),(1147,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:52:14',NULL),(1148,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:52:55',NULL),(1149,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:54:41',NULL),(1150,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 06:56:33',NULL),(1151,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 07:15:37',NULL),(1152,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 07:22:23',NULL),(1153,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 07:25:12',NULL),(1154,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 07:27:39',NULL),(1155,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 07:28:52',NULL),(1156,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 07:35:47','Retrieve applicant name or application code with the search string: n'),(1157,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 07:37:17',NULL),(1158,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-25 08:29:18',NULL),(1159,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-26 00:18:12',NULL),(1160,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-26 00:21:05',NULL),(1161,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-26 03:08:17',NULL),(1162,22,NULL,'JDC',NULL,NULL,NULL,NULL,NULL,'2023-05-26 03:28:15',NULL),(1163,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-26 03:29:56',NULL),(1164,22,NULL,'jdc',NULL,NULL,NULL,NULL,NULL,'2023-05-26 03:30:25',NULL),(1165,24,NULL,'JDC',NULL,NULL,NULL,NULL,NULL,'2023-05-26 03:31:35',NULL),(1166,22,NULL,'jdc',NULL,NULL,NULL,NULL,NULL,'2023-05-26 03:33:05',NULL),(1167,24,NULL,'JDC',NULL,NULL,NULL,NULL,NULL,'2023-05-26 03:33:42',NULL),(1168,24,NULL,'JDC',NULL,NULL,NULL,NULL,NULL,'2023-05-26 03:34:22',NULL),(1169,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-26 05:12:52',NULL),(1170,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-26 07:53:26',NULL),(1171,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 00:24:00',NULL),(1172,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 00:25:12',NULL),(1173,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 00:55:30',NULL),(1174,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 01:06:13',NULL),(1175,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 01:07:39',NULL),(1176,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 01:36:35',NULL),(1177,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 01:36:52',NULL),(1178,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 01:37:15',NULL),(1179,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 01:45:45',NULL),(1180,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 01:46:09',NULL),(1181,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 05:24:50',NULL),(1182,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 06:14:28',NULL),(1183,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-29 08:15:59',NULL),(1184,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-30 00:01:39',NULL),(1185,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-30 00:04:30',NULL),(1186,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-30 00:46:10',NULL),(1187,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-30 06:17:42',NULL),(1188,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-30 06:39:51',NULL),(1189,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-30 08:42:37',NULL),(1190,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-31 00:47:34',NULL),(1191,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-31 00:57:03',NULL),(1192,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-31 04:41:40',NULL),(1193,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-31 05:36:00',NULL),(1194,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-05-31 06:46:31',NULL),(1195,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke ',NULL,'2023-06-01 00:15:12',NULL),(1196,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-01 00:15:25',NULL),(1197,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-01 04:57:43',NULL),(1198,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-01 06:44:29',NULL),(1199,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-01 08:47:37',NULL),(1200,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-02 00:32:16',NULL),(1201,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-02 01:44:24',NULL),(1202,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-02 04:46:49',NULL),(1203,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-02 05:27:15','Retrieve applicant name or application code with the search string: n'),(1204,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-02 06:40:40',NULL),(1205,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-05 00:30:44',NULL),(1206,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-05 00:31:20','Retrieve applicant name or application code with the search string: n'),(1207,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-05 00:31:23','Retrieve applicant name or application code with the search string: n'),(1208,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-05 00:32:39',NULL),(1209,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-05 02:36:54',NULL),(1210,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-05 04:57:31',NULL),(1211,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-05 05:00:14',NULL),(1212,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-05 06:01:28',NULL),(1213,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-06 00:13:56',NULL),(1214,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-06 02:18:55',NULL),(1215,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-06 03:43:16',NULL),(1216,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-06 04:19:01',NULL),(1217,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-06 05:37:09',NULL),(1218,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-06 07:11:51',NULL),(1219,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-06 08:56:11',NULL),(1220,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 00:08:02',NULL),(1221,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 01:15:07',NULL),(1222,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 02:52:06',NULL),(1223,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 04:57:54',NULL),(1224,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 07:36:31',NULL),(1225,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 07:37:43',NULL),(1226,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 07:58:28','Retrieve applicant name or application code with the search string:  '),(1227,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 07:59:00','Retrieve applicant name or application code with the search string: 10'),(1228,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 07:59:00','Retrieve applicant name or application code with the search string: 10'),(1229,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 07:59:00','Retrieve applicant name or application code with the search string: 101'),(1230,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 07:59:03','Retrieve applicant name or application code with the search string: 10'),(1231,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 07:59:03','Retrieve applicant name or application code with the search string: 1'),(1232,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 07:59:07','Retrieve applicant name or application code with the search string: 10'),(1233,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 07:59:07','Retrieve applicant name or application code with the search string: 10'),(1234,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-07 23:23:41',NULL),(1235,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-08 00:13:46','Retrieve applicant name or application code with the search string: n'),(1236,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-08 00:13:47','Retrieve applicant name or application code with the search string: n'),(1237,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-08 01:50:38',NULL),(1238,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-08 03:21:26',NULL),(1239,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-08 06:39:12',NULL),(1240,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-08 07:57:14',NULL),(1241,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 02:08:15',NULL),(1242,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 02:09:03','Retrieve applicant name or application code with the search string: n'),(1243,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 02:13:26','Retrieve applicant name or application code with the search string: n'),(1244,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 02:15:39','Retrieve applicant name or application code with the search string: n'),(1245,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 02:15:53','Retrieve applicant name or application code with the search string: n'),(1246,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 02:35:27','Retrieve applicant name or application code with the search string: n'),(1247,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 02:39:14','Retrieve applicant name or application code with the search string: n'),(1248,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 02:41:22','Retrieve applicant name or application code with the search string: n'),(1249,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 03:39:54','Retrieve applicant name or application code with the search string: n'),(1250,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 03:53:48',NULL),(1251,23,NULL,NULL,NULL,NULL,NULL,'GeoTheDuke',NULL,'2023-06-09 04:21:45',NULL),(1252,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 04:21:53',NULL),(1253,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 05:41:24',NULL),(1254,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 05:53:11',NULL),(1255,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-09 07:03:22','Retrieve applicant name or application code with the search string: n'),(1256,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-11 03:58:58',NULL),(1257,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-11 04:50:20',NULL),(1258,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-13 00:10:39',NULL),(1259,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-13 01:55:15',NULL),(1260,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-13 01:55:43',NULL),(1261,1,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-13 02:12:26','Added Positions; Value string: '),(1262,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-13 05:28:52',NULL),(1263,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-13 08:14:49',NULL),(1264,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-13 08:45:02',NULL),(1265,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-14 00:06:19',NULL),(1266,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-14 00:42:42',NULL),(1267,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-14 05:08:28',NULL),(1268,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-14 07:01:19',NULL),(1269,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-15 05:22:33',NULL),(1270,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-15 23:17:13',NULL),(1271,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-16 04:39:28',NULL),(1272,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-16 06:12:03',NULL),(1273,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:12:09',NULL),(1274,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:22:26',NULL),(1275,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:24:16',NULL),(1276,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:29:14',NULL),(1277,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:39:33',NULL),(1278,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:41:14',NULL),(1279,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:41:33',NULL),(1280,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:42:11',NULL),(1281,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:44:07',NULL),(1282,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:45:16',NULL),(1283,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:46:42',NULL),(1284,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:48:11',NULL),(1285,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 06:49:44',NULL),(1286,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 07:10:34',NULL),(1287,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 07:17:28',NULL),(1288,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-16 07:32:17',NULL),(1289,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 07:34:07',NULL),(1290,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 07:34:49',NULL),(1291,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-06-16 07:35:05',NULL),(1292,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-18 23:19:58',NULL),(1293,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-19 01:42:50',NULL),(1294,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-19 03:25:08',NULL),(1295,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-19 06:10:55',NULL),(1296,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-19 08:19:54',NULL),(1297,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-19 08:39:06',NULL),(1298,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-20 00:36:44',NULL),(1299,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-20 00:41:53',NULL),(1300,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-20 01:00:17',NULL),(1301,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-20 01:00:48',NULL),(1302,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-20 06:41:39',NULL),(1303,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-20 08:35:05',NULL),(1304,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-21 01:40:58',NULL),(1305,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-21 01:42:14',NULL),(1306,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-21 05:30:57',NULL),(1307,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-21 05:36:17',NULL),(1308,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-06-21 05:48:47',NULL),(1309,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-21 05:50:33',NULL),(1310,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-06-21 05:51:58',NULL),(1311,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-21 08:23:13',NULL),(1312,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-22 02:58:50',NULL),(1313,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-06-22 03:06:01',NULL),(1314,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-22 08:06:24',NULL),(1315,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-22 08:07:44',NULL),(1316,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-06-22 08:07:59',NULL),(1317,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-22 08:11:27',NULL),(1318,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-06-22 08:12:51',NULL),(1319,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-06-22 08:16:56',NULL),(1320,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-06-22 08:17:14',NULL),(1321,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-06-27 04:25:02',NULL),(1322,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 01:50:57',NULL),(1323,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:15:24',NULL),(1324,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:18:14',NULL),(1325,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 02:37:22',NULL),(1326,22,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-07-05 02:37:30',NULL),(1327,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-07-05 02:37:51',NULL),(1328,23,NULL,NULL,NULL,NULL,NULL,'geovaniduqueza1939@outlook.com',NULL,'2023-07-05 02:38:00',NULL),(1329,22,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-07-05 02:38:16',NULL),(1330,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-07-05 02:38:34',NULL),(1331,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 02:38:42',NULL),(1332,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:38:54',NULL),(1333,13,NULL,'GeoTheDuke',NULL,NULL,NULL,'geovaniduqueza1939@outlook.com',NULL,'2023-07-05 02:39:02',NULL),(1334,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 02:39:08',NULL),(1335,22,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-07-05 02:40:18',NULL),(1336,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-07-05 02:40:38',NULL),(1337,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:40:59',NULL),(1338,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:42:05',NULL),(1339,16,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'gdiamant','2023-07-05 02:44:37',NULL),(1340,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:44:52',NULL),(1341,16,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'gdiamnt','2023-07-05 02:45:04',NULL),(1342,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:45:04',NULL),(1343,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:45:25',NULL),(1344,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:45:28',NULL),(1345,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:45:31',NULL),(1346,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'gdiamant','2023-07-05 02:45:36',NULL),(1347,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:45:36',NULL),(1348,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:45:52',NULL),(1349,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:45:57',NULL),(1350,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 02:46:00',NULL),(1351,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-05 03:02:17',NULL),(1352,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 03:47:07','Retrieve applicant name or application code with the search string: nn'),(1353,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 03:47:44','Retrieve applicant name or application code with the search string: n'),(1354,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 03:47:45','Retrieve applicant name or application code with the search string: nn'),(1355,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-07-05 05:05:14',NULL),(1356,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 05:05:41',NULL),(1357,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 05:05:56',NULL),(1358,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-07-05 05:06:14',NULL),(1359,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-07-05 05:13:41',NULL),(1360,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-07-05 05:14:38',NULL),(1361,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-07-05 05:14:45',NULL),(1362,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-07-05 05:16:09',NULL),(1363,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-07-05 05:17:55',NULL),(1364,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-07-05 05:18:01',NULL),(1365,18,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,'GeoTheDuke','2023-07-05 05:19:21',NULL),(1366,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 06:00:56','Retrieve applicant name or application code with the search string: nn'),(1367,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 06:01:28','Retrieve applicant name or application code with the search string: n'),(1368,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-05 07:35:36',NULL),(1369,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-06 13:01:33',NULL),(1370,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-06 13:59:19',NULL),(1371,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-06 14:03:24',NULL),(1372,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-06 14:05:02',NULL),(1373,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-06 14:06:27',NULL),(1374,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-07 08:51:35',NULL),(1375,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-07-07 08:58:50',NULL),(1376,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-07-08 08:58:02',NULL),(1377,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-08 11:26:00',NULL),(1378,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-10 02:07:33','Retrieve applicant name or application code with the search string: n'),(1379,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-10 02:07:50','Retrieve applicant name or application code with the search string: n'),(1380,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-10 02:08:12','Retrieve applicant name or application code with the search string: n'),(1381,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-10 02:08:19','Retrieve applicant name or application code with the search string: a'),(1382,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-10 02:08:20','Retrieve applicant name or application code with the search string: ad'),(1383,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-10 02:08:20','Retrieve applicant name or application code with the search string: add'),(1384,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-10 02:09:44','Retrieve applicant name or application code with the search string: na'),(1385,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-10 02:09:48','Retrieve applicant name or application code with the search string: n'),(1386,11,NULL,'GeoTheDuke',NULL,NULL,NULL,'%',NULL,'2023-07-10 02:13:19',NULL),(1387,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:14','Retrieve applicant name or application code with the search string: n'),(1388,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:15','Retrieve applicant name or application code with the search string: n'),(1389,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:33','Retrieve applicant name or application code with the search string: 2'),(1390,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:34','Retrieve applicant name or application code with the search string: 20'),(1391,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:34','Retrieve applicant name or application code with the search string: 20'),(1392,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:35','Retrieve applicant name or application code with the search string: 2'),(1393,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:36','Retrieve applicant name or application code with the search string: T'),(1394,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:37','Retrieve applicant name or application code with the search string: TC'),(1395,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:37','Retrieve applicant name or application code with the search string: TCH'),(1396,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:37','Retrieve applicant name or application code with the search string: TCH'),(1397,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:38','Retrieve applicant name or application code with the search string: TCH1'),(1398,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:39','Retrieve applicant name or application code with the search string: TCH1-'),(1399,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:39','Retrieve applicant name or application code with the search string: TCH1-2'),(1400,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:39','Retrieve applicant name or application code with the search string: TCH1-20'),(1401,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:40','Retrieve applicant name or application code with the search string: TCH1-2023'),(1402,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:40','Retrieve applicant name or application code with the search string: TCH1-2023'),(1403,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:41','Retrieve applicant name or application code with the search string: TCH1-2023-'),(1404,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:42','Retrieve applicant name or application code with the search string: TCH1-2023-0'),(1405,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:42','Retrieve applicant name or application code with the search string: TCH1-2023-00'),(1406,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:43','Retrieve applicant name or application code with the search string: TCH1-2023-000'),(1407,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:46','Retrieve applicant name or application code with the search string: TCH1-2023-00'),(1408,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:46','Retrieve applicant name or application code with the search string: TCH1-2023-0'),(1409,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:01:48','Retrieve applicant name or application code with the search string: TCH1-2023-'),(1410,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:28:38','Retrieve applicant name or application code with the search string: b'),(1411,7,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-18 00:28:41','Retrieve applicant name or application code with the search string: n'),(1412,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-20 00:42:06',NULL),(1413,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-07-20 00:42:47',NULL),(1414,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-20 00:43:06',NULL),(1415,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-07-20 00:43:32',NULL),(1416,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-20 00:45:40',NULL),(1417,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-20 00:45:46',NULL),(1418,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-20 01:17:07',NULL),(1419,24,'geovaniduqueza1939@outlook.com',NULL,NULL,NULL,NULL,NULL,NULL,'2023-07-20 01:42:00',NULL),(1420,24,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-21 02:46:26',NULL),(1421,22,NULL,'GeoTheDuke',NULL,NULL,NULL,NULL,NULL,'2023-07-21 03:03:16',NULL);
/*!40000 ALTER TABLE `MPASIS_History` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MPASIS_Role`
--

DROP TABLE IF EXISTS `MPASIS_Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MPASIS_Role` (
  `mpasis_assigned_roleId` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `employeeId` varchar(50) DEFAULT NULL,
  `personId` bigint(20) unsigned DEFAULT NULL,
  `mpasis_roleIndex` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`mpasis_assigned_roleId`),
  KEY `MPASIS_Role_FK` (`mpasis_roleIndex`),
  KEY `MPASIS_Role_ibfk_1` (`employeeId`),
  KEY `MPASIS_Role_ibfk_2` (`personId`),
  CONSTRAINT `MPASIS_Role_FK` FOREIGN KEY (`mpasis_roleIndex`) REFERENCES `ENUM_MPASIS_Role_Type` (`mpasis_roleIndex`) ON UPDATE CASCADE,
  CONSTRAINT `MPASIS_Role_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `MPASIS_Role_ibfk_2` FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MPASIS_Role`
--

LOCK TABLES `MPASIS_Role` WRITE;
/*!40000 ALTER TABLE `MPASIS_Role` DISABLE KEYS */;
/*!40000 ALTER TABLE `MPASIS_Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MPS_Increment_Table_Education`
--

DROP TABLE IF EXISTS `MPS_Increment_Table_Education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MPS_Increment_Table_Education` (
  `education_increment_level` tinyint(3) unsigned NOT NULL,
  `baseline_educational_attainment` tinyint(3) unsigned NOT NULL,
  `baseline_postgraduate_units` tinyint(3) unsigned DEFAULT NULL,
  `complete_academic_requirements` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Complete academic requirements completed towards the next post-graduate degree',
  PRIMARY KEY (`education_increment_level`),
  KEY `baseline_educational_attainment` (`baseline_educational_attainment`),
  CONSTRAINT `MPS_Increment_Table_Education_ibfk_1` FOREIGN KEY (`baseline_educational_attainment`) REFERENCES `ENUM_Educational_Attainment` (`index`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MPS_Increment_Table_Education`
--

LOCK TABLES `MPS_Increment_Table_Education` WRITE;
/*!40000 ALTER TABLE `MPS_Increment_Table_Education` DISABLE KEYS */;
INSERT INTO `MPS_Increment_Table_Education` VALUES (0,0,NULL,0),(1,1,NULL,0),(2,2,NULL,0),(3,3,NULL,0),(4,4,NULL,0),(5,5,NULL,0),(6,6,NULL,0),(7,6,6,0),(8,6,9,0),(9,6,12,0),(10,6,15,0),(11,6,18,0),(12,6,21,0),(13,6,24,0),(14,6,27,0),(15,6,30,0),(16,6,33,0),(17,6,36,0),(18,6,39,0),(19,6,42,0),(20,6,NULL,1),(21,7,NULL,0),(22,7,3,0),(23,7,6,0),(24,7,9,0),(25,7,12,0),(26,7,15,0),(27,7,18,0),(28,7,21,0),(29,7,24,0),(30,7,NULL,1),(31,8,NULL,0);
/*!40000 ALTER TABLE `MPS_Increment_Table_Education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PM_Cycle`
--

DROP TABLE IF EXISTS `PM_Cycle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PM_Cycle` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date_range` bigint(20) unsigned NOT NULL,
  `descriptive_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PM_Cycle_id_IDX` (`id`) USING BTREE,
  KEY `PM_Cycle_FK` (`date_range`),
  CONSTRAINT `PM_Cycle_FK` FOREIGN KEY (`date_range`) REFERENCES `Date_Range` (`date_rangeId`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Performance Management Cycle';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PM_Cycle`
--

LOCK TABLES `PM_Cycle` WRITE;
/*!40000 ALTER TABLE `PM_Cycle` DISABLE KEYS */;
INSERT INTO `PM_Cycle` VALUES (1,3,'Fiscal Year 2022'),(2,4,'School Year 2022-2023'),(3,5,'Fiscal Year 2023');
/*!40000 ALTER TABLE `PM_Cycle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PM_Framework`
--

DROP TABLE IF EXISTS `PM_Framework`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PM_Framework` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `framework_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  `basis` varchar(100) DEFAULT NULL COMMENT 'Documentary/legal bases',
  PRIMARY KEY (`id`),
  UNIQUE KEY `PM_Framework_id_IDX` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Performance Management Framework; different sets of MFO''s, KRA''s, and Objectives that can be used to suggest Performance Management Plans';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PM_Framework`
--

LOCK TABLES `PM_Framework` WRITE;
/*!40000 ALTER TABLE `PM_Framework` DISABLE KEYS */;
/*!40000 ALTER TABLE `PM_Framework` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PM_KRA`
--

DROP TABLE IF EXISTS `PM_KRA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PM_KRA` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kra` mediumtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `mfoId` int(10) unsigned NOT NULL,
  `frameworkId` mediumint(8) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Performance_KRA_id_IDX` (`id`) USING BTREE,
  KEY `PM_KRA_FK` (`mfoId`),
  KEY `PM_KRA_FK_1` (`frameworkId`),
  CONSTRAINT `PM_KRA_FK` FOREIGN KEY (`mfoId`) REFERENCES `PM_MFO` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `PM_KRA_FK_1` FOREIGN KEY (`frameworkId`) REFERENCES `PM_Framework` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Key Result Areas for Performance Management';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PM_KRA`
--

LOCK TABLES `PM_KRA` WRITE;
/*!40000 ALTER TABLE `PM_KRA` DISABLE KEYS */;
/*!40000 ALTER TABLE `PM_KRA` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PM_MFO`
--

DROP TABLE IF EXISTS `PM_MFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PM_MFO` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mfo` mediumtext NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Performance_MFO_index_IDX` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Major Final Output for Performance Management; may refer to services or products of performance';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PM_MFO`
--

LOCK TABLES `PM_MFO` WRITE;
/*!40000 ALTER TABLE `PM_MFO` DISABLE KEYS */;
/*!40000 ALTER TABLE `PM_MFO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PM_MOV`
--

DROP TABLE IF EXISTS `PM_MOV`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PM_MOV` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mov` mediumtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PM_MOV_id_IDX` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Methods of Verification for Performance Management Objectives; each may be used for various objectives';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PM_MOV`
--

LOCK TABLES `PM_MOV` WRITE;
/*!40000 ALTER TABLE `PM_MOV` DISABLE KEYS */;
/*!40000 ALTER TABLE `PM_MOV` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PM_Objective`
--

DROP TABLE IF EXISTS `PM_Objective`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PM_Objective` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `objective` mediumtext NOT NULL,
  `description` longtext DEFAULT NULL,
  `kraId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Performance_Objectives_id_IDX` (`id`) USING BTREE,
  KEY `PM_Objective_FK` (`kraId`),
  CONSTRAINT `PM_Objective_FK` FOREIGN KEY (`kraId`) REFERENCES `PM_KRA` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Performance Objectives for Performance Management';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PM_Objective`
--

LOCK TABLES `PM_Objective` WRITE;
/*!40000 ALTER TABLE `PM_Objective` DISABLE KEYS */;
/*!40000 ALTER TABLE `PM_Objective` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PM_PI`
--

DROP TABLE IF EXISTS `PM_PI`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PM_PI` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `plan_objectiveId` bigint(20) unsigned NOT NULL,
  `performance_indicator` longtext NOT NULL,
  `score` tinyint(3) unsigned NOT NULL COMMENT 'allowed values: 1-5',
  `plan_pi_status` tinyint(3) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `initiator` enum('ratee','rater') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Performance_Indicators_id_IDX` (`id`) USING BTREE,
  KEY `PM_PI_timestamp_IDX` (`timestamp`) USING BTREE,
  KEY `PM_PI_FK` (`plan_objectiveId`),
  KEY `PM_PI_FK_1` (`plan_pi_status`),
  CONSTRAINT `PM_PI_FK` FOREIGN KEY (`plan_objectiveId`) REFERENCES `PM_Plan_Objective` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PM_PI_FK_1` FOREIGN KEY (`plan_pi_status`) REFERENCES `ENUM_PM_Plan_Item_Status` (`index`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Performance Indicators for Performance Management Objectives; rubrics criteria';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PM_PI`
--

LOCK TABLES `PM_PI` WRITE;
/*!40000 ALTER TABLE `PM_PI` DISABLE KEYS */;
/*!40000 ALTER TABLE `PM_PI` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PM_Plan`
--

DROP TABLE IF EXISTS `PM_Plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PM_Plan` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rateeId` varchar(50) NOT NULL COMMENT 'employeeId',
  `pm_cycle` int(10) unsigned NOT NULL,
  `raterId` varchar(50) DEFAULT NULL COMMENT 'employeeId',
  `approverId` varchar(50) DEFAULT NULL COMMENT 'employeeId',
  `plan_status` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `RPMS_Performance_Monitoring_id_IDX` (`id`) USING BTREE,
  KEY `PM_Plan_FK` (`rateeId`),
  KEY `PM_Plan_FK_1` (`raterId`),
  KEY `PM_Plan_FK_2` (`approverId`),
  KEY `PM_Plan_FK_3` (`plan_status`),
  CONSTRAINT `PM_Plan_FK` FOREIGN KEY (`rateeId`) REFERENCES `Employee` (`employeeId`) ON UPDATE CASCADE,
  CONSTRAINT `PM_Plan_FK_1` FOREIGN KEY (`raterId`) REFERENCES `Employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `PM_Plan_FK_2` FOREIGN KEY (`approverId`) REFERENCES `Employee` (`employeeId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `PM_Plan_FK_3` FOREIGN KEY (`plan_status`) REFERENCES `ENUM_PM_Plan_Status` (`index`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Performance Management Plan for Employees; one plan every PM cycle';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PM_Plan`
--

LOCK TABLES `PM_Plan` WRITE;
/*!40000 ALTER TABLE `PM_Plan` DISABLE KEYS */;
/*!40000 ALTER TABLE `PM_Plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PM_Plan_History`
--

DROP TABLE IF EXISTS `PM_Plan_History`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PM_Plan_History` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `planId` bigint(20) unsigned NOT NULL,
  `mod_description` longtext NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `initiator` enum('ratee','rater','approver') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PM_Plan_History_id_IDX` (`id`) USING BTREE,
  KEY `PM_Plan_History_FK` (`planId`),
  CONSTRAINT `PM_Plan_History_FK` FOREIGN KEY (`planId`) REFERENCES `PM_Plan` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PM_Plan_History`
--

LOCK TABLES `PM_Plan_History` WRITE;
/*!40000 ALTER TABLE `PM_Plan_History` DISABLE KEYS */;
/*!40000 ALTER TABLE `PM_Plan_History` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PM_Plan_MOV`
--

DROP TABLE IF EXISTS `PM_Plan_MOV`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PM_Plan_MOV` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `movId` int(10) unsigned NOT NULL,
  `plan_objectiveId` bigint(20) unsigned NOT NULL,
  `plan_mov_status` tinyint(3) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `initiator` enum('ratee','rater') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PM_Plan_MOV_id_IDX` (`id`) USING BTREE,
  KEY `PM_Plan_MOV_FK` (`movId`),
  KEY `PM_Plan_MOV_FK_1` (`plan_objectiveId`),
  KEY `PM_Plan_MOV_FK_2` (`plan_mov_status`),
  CONSTRAINT `PM_Plan_MOV_FK` FOREIGN KEY (`movId`) REFERENCES `PM_MOV` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `PM_Plan_MOV_FK_1` FOREIGN KEY (`plan_objectiveId`) REFERENCES `PM_Plan_Objective` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PM_Plan_MOV_FK_2` FOREIGN KEY (`plan_mov_status`) REFERENCES `ENUM_PM_Plan_Item_Status` (`index`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Methods of Verification for Performance Management Objectives; each may be used for various objectives';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PM_Plan_MOV`
--

LOCK TABLES `PM_Plan_MOV` WRITE;
/*!40000 ALTER TABLE `PM_Plan_MOV` DISABLE KEYS */;
/*!40000 ALTER TABLE `PM_Plan_MOV` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PM_Plan_Objective`
--

DROP TABLE IF EXISTS `PM_Plan_Objective`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PM_Plan_Objective` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `planId` bigint(20) unsigned NOT NULL,
  `objectiveId` bigint(20) unsigned NOT NULL,
  `plan_objective_status` tinyint(3) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `initiator` enum('ratee','rater') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PM_Plan_Objective_id_IDX` (`id`) USING BTREE,
  KEY `PM_Plan_Objective_FK` (`planId`),
  KEY `PM_Plan_Objective_FK_1` (`objectiveId`),
  KEY `PM_Plan_Objective_FK_2` (`plan_objective_status`),
  CONSTRAINT `PM_Plan_Objective_FK` FOREIGN KEY (`planId`) REFERENCES `PM_Plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PM_Plan_Objective_FK_1` FOREIGN KEY (`objectiveId`) REFERENCES `PM_Objective` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `PM_Plan_Objective_FK_2` FOREIGN KEY (`plan_objective_status`) REFERENCES `ENUM_PM_Plan_Item_Status` (`index`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Objectives for Performance Management chosen by Employee Ratees';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PM_Plan_Objective`
--

LOCK TABLES `PM_Plan_Objective` WRITE;
/*!40000 ALTER TABLE `PM_Plan_Objective` DISABLE KEYS */;
/*!40000 ALTER TABLE `PM_Plan_Objective` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Person`
--

DROP TABLE IF EXISTS `Person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Person` (
  `personId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `given_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `family_name` varchar(100) DEFAULT NULL,
  `spouse_name` varchar(20) DEFAULT NULL,
  `ext_name` varchar(100) DEFAULT NULL,
  `post_nominal` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` bigint(20) unsigned DEFAULT NULL,
  `sex` enum('Male','Female') DEFAULT NULL,
  `age` tinyint(3) unsigned DEFAULT NULL,
  `civil_status` tinyint(3) unsigned DEFAULT NULL,
  `religionId` int(10) unsigned DEFAULT NULL,
  `ethnicityId` int(10) unsigned DEFAULT NULL,
  `permanent_addressId` bigint(20) unsigned DEFAULT NULL,
  `present_addressId` bigint(20) unsigned DEFAULT NULL,
  `educational_attainment` tinyint(3) unsigned DEFAULT NULL,
  `postgraduate_units` tinyint(3) unsigned DEFAULT NULL COMMENT 'this will be phased-out in favor of a new table',
  `complete_academic_requirements` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`personId`),
  UNIQUE KEY `Person_id_IDX` (`personId`) USING BTREE,
  KEY `Person_FK` (`civil_status`),
  KEY `Person_FK_1` (`religionId`),
  KEY `Person_FK_3` (`permanent_addressId`),
  KEY `Person_FK_4` (`present_addressId`),
  KEY `Person_FK_5` (`educational_attainment`),
  KEY `Person_FK_2` (`ethnicityId`),
  KEY `Person_FK_6` (`birth_place`),
  CONSTRAINT `Person_FK` FOREIGN KEY (`civil_status`) REFERENCES `ENUM_Civil_Status` (`index`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Person_FK_1` FOREIGN KEY (`religionId`) REFERENCES `Religion` (`religionId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Person_FK_2` FOREIGN KEY (`ethnicityId`) REFERENCES `Ethnicity` (`ethnicityId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Person_FK_3` FOREIGN KEY (`permanent_addressId`) REFERENCES `Address` (`addressId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Person_FK_4` FOREIGN KEY (`present_addressId`) REFERENCES `Address` (`addressId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Person_FK_5` FOREIGN KEY (`educational_attainment`) REFERENCES `ENUM_Educational_Attainment` (`index`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Person_FK_6` FOREIGN KEY (`birth_place`) REFERENCES `Address` (`addressId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Person`
--

LOCK TABLES `Person` WRITE;
/*!40000 ALTER TABLE `Person` DISABLE KEYS */;
INSERT INTO `Person` VALUES (1,'Geovani','Pascua','Duqueza',NULL,NULL,'','1984-06-03',86,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Myrene','Culambo','Melor','Duqueza',NULL,NULL,'1979-11-29',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'Michael',NULL,NULL,NULL,NULL,NULL,'1521-03-21',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'Juan',NULL,NULL,NULL,NULL,NULL,'1898-06-12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,'Geovani',NULL,'Duqueza',NULL,NULL,NULL,NULL,NULL,'Male',38,2,6,8,NULL,15,5,NULL,NULL),(17,'Geovani',NULL,'Duqueza',NULL,NULL,NULL,NULL,NULL,'Male',38,2,6,8,NULL,16,5,NULL,NULL),(18,'Geovani',NULL,'Duqueza',NULL,NULL,NULL,NULL,NULL,'Male',38,2,6,8,NULL,17,5,NULL,NULL),(19,'Geovani',NULL,'Duqueza',NULL,NULL,NULL,NULL,NULL,'Male',38,2,6,8,NULL,18,5,NULL,NULL),(20,'Juan',NULL,'dela Cruz',NULL,'Jr.',NULL,'1998-06-12',NULL,'Male',20,1,7,9,NULL,19,5,NULL,NULL),(21,'Johnny',NULL,'Duke',NULL,NULL,NULL,NULL,NULL,'Male',29,1,6,9,NULL,81,5,NULL,NULL),(41,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,82,6,NULL,NULL),(42,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,45,6,NULL,NULL),(43,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,46,6,NULL,NULL),(44,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,47,6,NULL,NULL),(45,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,48,6,NULL,NULL),(46,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,49,6,NULL,NULL),(47,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,50,6,NULL,NULL),(48,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,51,6,NULL,NULL),(49,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,52,6,NULL,NULL),(50,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,53,6,NULL,NULL),(51,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,54,6,NULL,NULL),(52,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,55,6,NULL,NULL),(53,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,56,6,NULL,NULL),(54,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,57,6,NULL,NULL),(55,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,58,6,NULL,NULL),(56,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,59,6,NULL,NULL),(57,'Joanna',NULL,'Arces',NULL,NULL,NULL,NULL,NULL,'Female',24,1,7,9,NULL,61,6,NULL,NULL),(58,'John',NULL,'Cruz',NULL,NULL,NULL,NULL,NULL,'Male',19,1,NULL,9,NULL,62,5,NULL,NULL),(59,'Juana',NULL,'Sta. Maria','delos Santos',NULL,NULL,NULL,NULL,'Female',32,2,7,9,NULL,78,7,NULL,NULL),(77,'Juan',NULL,'dela Cruz',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(78,'Juan',NULL,'dela Cruz',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(79,'Juan',NULL,'dela Cruz',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(82,'Juana',NULL,'Sta. Maria',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(83,'Juan',NULL,'dela Cruz',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(88,'Niccolo',NULL,'Machiavelli',NULL,NULL,NULL,NULL,NULL,'Male',19,1,NULL,10,NULL,84,6,NULL,NULL),(91,'Marah','','Miller','','','','1979-11-29',87,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Person_Disability`
--

DROP TABLE IF EXISTS `Person_Disability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Person_Disability` (
  `person_disabilityId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `personId` bigint(20) unsigned NOT NULL,
  `disabilityId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`person_disabilityId`),
  KEY `personId` (`personId`),
  KEY `disabilityId` (`disabilityId`),
  CONSTRAINT `Person_Disability_ibfk_1` FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Person_Disability_ibfk_2` FOREIGN KEY (`disabilityId`) REFERENCES `Disability` (`disabilityId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Person_Disability`
--

LOCK TABLES `Person_Disability` WRITE;
/*!40000 ALTER TABLE `Person_Disability` DISABLE KEYS */;
INSERT INTO `Person_Disability` VALUES (9,16,7),(10,17,7),(11,18,7),(12,19,7),(16,21,7);
/*!40000 ALTER TABLE `Person_Disability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Position`
--

DROP TABLE IF EXISTS `Position`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Position` (
  `plantilla_item_number` varchar(50) NOT NULL,
  `position_title` varchar(100) NOT NULL,
  `parenthetical_title` varchar(100) NULL DEFAULT '',
  `salary_grade` tinyint(3) unsigned NOT NULL,
  `position_categoryId` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `place_of_assignment` longtext DEFAULT NULL,
  `required_educational_attainment` tinyint(3) unsigned DEFAULT NULL,
  `specific_education_required` varchar(500) DEFAULT NULL,
  `required_training_hours` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `specific_training_required` varchar(500) DEFAULT NULL,
  `required_work_experience_years` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `specific_work_experience_required` varchar(500) DEFAULT NULL,
  `competency` longtext DEFAULT NULL,
  `filled` tinyint(1) NOT NULL DEFAULT 0,
  `eligibility_string` varchar(500) DEFAULT NULL,
  `final_deliberation_date` date DEFAULT NULL,
  PRIMARY KEY (`plantilla_item_number`),
  KEY `required_educational_attainment` (`required_educational_attainment`),
  KEY `category` (`position_categoryId`),
  KEY `Position_position_title_IDX` (`position_title`) USING BTREE,
  KEY `Position_parenthetical_title_IDX` (`parenthetical_title`) USING BTREE,
  KEY `Position_FK` (`salary_grade`),
  CONSTRAINT `Position_ibfk_2` FOREIGN KEY (`required_educational_attainment`) REFERENCES `ENUM_Educational_Attainment` (`index`) ON UPDATE CASCADE,
  CONSTRAINT `Position_ibfk_3` FOREIGN KEY (`position_categoryId`) REFERENCES `Position_Category` (`position_categoryId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Position`
--

LOCK TABLES `Position` WRITE;
/*!40000 ALTER TABLE `Position` DISABLE KEYS */;
INSERT INTO `Position` VALUES ('A3-270053-2023','Accountant III','',19,4,NULL,6,'Bachelor\'s degree in Commerce/Business Administration major in Accounting',8,NULL,2,NULL,NULL,0,'RA 1080 (CPA)',NULL),('ADA4-270022-2023','Administrative Aide IV','',4,5,NULL,4,NULL,0,NULL,0,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADA6-270021-2023','Administrative Aide VI','',6,5,NULL,5,NULL,0,NULL,0,NULL,NULL,0,'Career Service Sub-Professional (First Level Eligibility)',NULL),('ADAS1-270023-2023','Administrative Assistant I','',7,4,NULL,5,NULL,0,NULL,0,NULL,NULL,0,'Career Service Sub-Professional (First Level Eligibility)',NULL),('ADAS1-270024-2023','Administrative Assistant I','',7,4,NULL,5,NULL,0,NULL,0,NULL,NULL,0,'Career Service Sub-Professional (First Level Eligibility)',NULL),('ADAS1-270025-2023','Administrative Assistant I','',7,4,NULL,5,NULL,0,NULL,0,NULL,NULL,0,'Career Service Sub-Professional (First Level Eligibility)',NULL),('ADAS1-270026-2023','Administrative Assistant I','',7,4,NULL,5,NULL,0,NULL,0,NULL,NULL,0,'Career Service Sub-Professional (First Level Eligibility)',NULL),('ADAS1-270027-2023','Administrative Assistant I','',7,4,NULL,5,NULL,0,NULL,0,NULL,NULL,0,'Career Service Sub-Professional (First Level Eligibility)',NULL),('ADAS1-270028-2023','Administrative Assistant I','',7,4,NULL,5,NULL,0,NULL,0,NULL,NULL,0,'Career Service Sub-Professional (First Level Eligibility)',NULL),('ADAS1-270029-2023','Administrative Assistant I','',7,4,NULL,5,NULL,0,NULL,0,NULL,NULL,0,'Career Service Sub-Professional (First Level Eligibility)',NULL),('ADAS1-270030-2023','Administrative Assistant I','',7,4,NULL,5,NULL,0,NULL,0,NULL,NULL,0,'Career Service Sub-Professional (First Level Eligibility)',NULL),('ADAS2-270031-2023','Administrative Assistant II','',8,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service Sub-Professional (First Level Eligibility)',NULL),('ADAS2-270032-2023','Administrative Assistant II','',8,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service Sub-Professional (First Level Eligibility)',NULL),('ADAS3-270033-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADAS3-270034-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADAS3-270035-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADAS3-270036-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADAS3-270037-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADAS3-270038-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADAS3-270039-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADAS3-270040-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADAS3-270041-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADAS3-270042-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADAS3-270043-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADAS3-270044-2023','Administrative Assistant III','',9,4,NULL,5,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Sub-Prof)',NULL),('ADOF2-270045-2023','Administrative Officer II','',11,4,NULL,6,'Bachelor\'s degree relevant to the job',0,NULL,0,NULL,NULL,0,'Career Service (Professional)/ Second Level Eligibility',NULL),('ADOF4-270046-2023','Administrative Officer IV','HRMO',15,4,NULL,6,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Prof)',NULL),('ADOF4-270047-2023','Administrative Officer IV','Records',15,4,NULL,6,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Prof)',NULL),('ADOF4-270048-2023','Administrative Officer IV','Supply Officer',15,4,NULL,6,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Prof)',NULL),('ADOF4-270049-2023','Administrative Officer IV','Cashier',15,4,NULL,6,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Prof)',NULL),('ADOF5-270050-2023','Administrative Officer V','',18,4,NULL,6,NULL,8,NULL,2,NULL,NULL,0,'Career Service (Prof)',NULL),('ADOF5-270051-2023','Administrative Officer V','Budget Officer',18,4,NULL,6,NULL,8,NULL,2,NULL,NULL,0,'Career Service (Prof)',NULL),('ATY3-270054-2023','Attorney III','',21,4,NULL,6,'Bachelor of Law',4,NULL,1,NULL,NULL,0,'RA 1080 (Bar)',NULL),('CES-270020-2023','Chief Education Supervisor','',24,3,NULL,7,NULL,24,'24 hours of training in management and supervision',4,'4 years in position/s involving management and supervision',NULL,0,'RA 1080 (Teacher)/PBET',NULL),('CES-270021-2023','Chief Education Supervisor','',24,3,NULL,7,NULL,24,'24 hours of training in management and supervision',4,'4 years in position/s involving management and supervision',NULL,0,'RA 1080 (Teacher)/PBET',NULL),('DENT2-270010-2023','Dentist II','',17,4,NULL,6,'Doctor of Dental Medicine',4,NULL,1,NULL,NULL,0,'RA 1080 (Dentist)',NULL),('DENT2-270011-2023','Dentist II','',17,4,NULL,6,'Doctor of Dental Medicine',4,NULL,1,NULL,NULL,0,'RA 1080 (Dentist)',NULL),('ENG3-270017-2023','Engineer III','',19,4,NULL,6,'Bachelor\'s degree relevant to the job',8,NULL,2,NULL,NULL,0,'RA 1080 (Engineer/Architect)',NULL),('EPS2-270007-2023','Education Program Specialist II','',16,3,NULL,6,'Bachelor\'s degree in Education or its Equivalent',4,NULL,2,'2 years experience in education research, development, implementation, or other relevant experience',NULL,0,'RA 1080; Career Service (Professional) Appropriate Eligibility for Second Level Position',NULL),('EPS2-270008-2023','Education Program Specialist II','',16,3,NULL,6,'Bachelor\'s degree in Education or its Equivalent',4,NULL,2,'2 years experience in education research, development, implementation, or other relevant experience',NULL,0,'RA 1080; Career Service (Professional) Appropriate Eligibility for Second Level Position',NULL),('EPS2-270009-2023','Education Program Specialist II','',16,3,NULL,6,'Bachelor\'s degree in Education or its Equivalent',4,NULL,2,'2 years experience in education research, development, implementation, or other relevant experience',NULL,0,'RA 1080; Career Service (Professional) Appropriate Eligibility for Second Level Position',NULL),('EPS2-270010-2023','Education Program Specialist II','',16,3,NULL,6,'Bachelor\'s degree in Education or its equivalent',4,NULL,2,'2 years experience in education research, development, implementation, or other relevant experience',NULL,0,'RA 1080; Career Service (Professional) Appropriate Eligibility for Second Level Position',NULL),('EPS2-270011-2023','Education Program Specialist II','',16,3,NULL,6,'Bachelor\'s degree in Education or its equivalent',4,NULL,2,'2 years experience in education research, development, implementation, or other relevant experience',NULL,0,'RA 1080; Career Service (Professional) Appropriate Eligibility for Second Level Position',NULL),('EPSVR-270019-2023','Education Program Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree with specific area of specialization',8,NULL,2,'2 years as Principal or 2 years as Head Teacher or 2 years as Master Teacher',NULL,0,'RA 1080 (Teacher)',NULL),('EPSVR-270020-2023','Education Program Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree with specific area of specialization',8,NULL,2,'2 years as Principal or 2 years as Head Teacher or 2 years as Master Teacher',NULL,0,'RA 1080 (Teacher)',NULL),('EPSVR-270021-2023','Education Program Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree with specific area of specialization',8,NULL,2,'2 years as Principal or 2 years as Head Teacher or 2 years as Master Teacher',NULL,0,'RA 1080 (Teacher)',NULL),('EPSVR-270022-2023','Education Program Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree with specific area of specialization',8,NULL,2,'2 years as Principal or 2 years as Head Teacher or 2 years as Master Teacher',NULL,0,'RA 1080 (Teacher)',NULL),('EPSVR-270023-2023','Education Program Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree with specific area of specialization',8,NULL,2,'2 years as Principal or 2 years as Head Teacher or 2 years as Master Teacher',NULL,0,'RA 1080 (Teacher)',NULL),('EPSVR-270024-2023','Education Program Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree with specific area of specialization',8,NULL,2,'2 years as Principal or 2 years as Head Teacher or 2 years as Master Teacher',NULL,0,'RA 1080 (Teacher)',NULL),('EPSVR-270025-2023','Education Program Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree with specific area of specialization',8,NULL,2,'2 years as Principal or 2 years as Head Teacher or 2 years as Master Teacher',NULL,0,'RA 1080 (Teacher)',NULL),('EPSVR-270026-2023','Education Program Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree with specific area of specialization',8,NULL,2,'2 years as Principal or 2 years as Head Teacher or 2 years as Master Teacher',NULL,0,'RA 1080 (Teacher)',NULL),('EPSVR-270027-2023','Education Program Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree with specific area of specialization',8,NULL,2,'2 years as Principal or 2 years as Head Teacher or 2 years as Master Teacher',NULL,0,'RA 1080 (Teacher)',NULL),('EPSVR-270028-2023','Education Program Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree with specific area of specialization',8,NULL,2,'2 years as Principal or 2 years as Head Teacher or 2 years as Master Teacher',NULL,0,'RA 1080 (Teacher)',NULL),('EPSVR-270029-2023','Education Program Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree with specific area of specialization',8,NULL,2,'2 years as Principal or 2 years as Head Teacher or 2 years as Master Teacher',NULL,0,'RA 1080 (Teacher)',NULL),('ITO1-270052-2023','Information Technology Officer I','',19,4,NULL,6,'Bachelor\'s degree relevant to the job',8,NULL,2,NULL,NULL,0,'Career Service (Professional) Second Level Eligibility',NULL),('LIB2-270003-2023','Librarian II','',15,3,NULL,6,'Bachelor\'s degree in Library Science or Information Science or Bachelor of Science in Education/Arts Major in Library Science',4,NULL,1,NULL,NULL,0,'RA 1080',NULL),('MDOF3-270018-2023','Medical Officer III','',21,4,NULL,6,'Doctor of Medicine (preferably with MA in Public Health, Public Administration, Management, Health Education or relevant field)',4,NULL,1,'At least 1 year of relevant experience in the practice of Medicine',NULL,0,'RA 1080 (Physician\'s Licensure Exam)',NULL),('NURS2-270002-2023','Nurse II','',16,4,NULL,6,'Bachelor of Science in Nursing',4,NULL,2,NULL,NULL,0,'RA 1080 (Nursing Licensure Exam)',NULL),('NURS2-270003-2023','Nurse II','',16,4,NULL,6,'Bachelor of Science in Nursing',4,NULL,2,NULL,NULL,0,'RA 1080 (Nursing Licensure Exam)',NULL),('NURS2-270004-2023','Nurse II','',16,4,NULL,6,'Bachelor of Science in Nursing',4,NULL,2,NULL,NULL,0,'RA 1080 (Nursing Licensure Exam)',NULL),('NURS2-270005-2023','Nurse II','',16,4,NULL,6,'Bachelor of Science in Nursing',4,NULL,2,NULL,NULL,0,'RA 1080 (Nursing Licensure Exam)',NULL),('NURS2-270006-2023','Nurse II','',16,4,NULL,6,'Bachelor of Science in Nursing',4,NULL,2,NULL,NULL,0,'RA 1080 (Nursing Licensure Exam)',NULL),('PDO2-270001-2023','Project Development Officer II','',15,4,NULL,6,'Bachelor\'s degree relevant to the job',4,NULL,1,NULL,NULL,0,'Career Service (Professional) Second Level Eligibility',NULL),('PDO2-270002-2023','Project Development Officer II','',15,4,NULL,6,NULL,4,NULL,1,NULL,NULL,0,'Career Service (Prof)',NULL),('PLO3-270012-2023','Planning Officer III','',18,4,NULL,6,'Bachelor\'s degree relevant to the job',8,NULL,2,NULL,NULL,0,'Career Service (Professional) Appropriate Eligibility for Second Level Position',NULL),('PSDS-270012-2023','Public Schools District Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree',16,NULL,5,'5 years cumulative experience in instructional supervision and school management',NULL,0,'RA 1080 (Teacher)',NULL),('PSDS-270013-2023','Public Schools District Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree',16,NULL,5,'5 years cumulative experience in instructional supervision and school management',NULL,0,'RA 1080 (Teacher)',NULL),('PSDS-270014-2023','Public Schools District Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree',16,NULL,5,'5 years cumulative experience in instructional supervision and school management',NULL,0,'RA 1080 (Teacher)',NULL),('PSDS-270015-2023','Public Schools District Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree',16,NULL,5,'5 years cumulative experience in instructional supervision and school management',NULL,0,'RA 1080 (Teacher)',NULL),('PSDS-270016-2023','Public Schools District Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree',16,NULL,5,'5 years cumulative experience in instructional supervision and school management',NULL,0,'RA 1080 (Teacher)',NULL),('PSDS-270017-2023','Public Schools District Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree',16,NULL,5,'5 years cumulative experience in instructional supervision and school management',NULL,0,'RA 1080 (Teacher)',NULL),('PSDS-270018-2023','Public Schools District Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree',16,NULL,5,'5 years cumulative experience in instructional supervision and school management',NULL,0,'RA 1080 (Teacher)',NULL),('PSDS-270019-2023','Public Schools District Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree',16,NULL,5,'5 years cumulative experience in instructional supervision and school management',NULL,0,'RA 1080 (Teacher)',NULL),('PSDS-270020-2023','Public Schools District Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree',16,NULL,5,'5 years cumulative experience in instructional supervision and school management',NULL,0,'RA 1080 (Teacher)',NULL),('PSDS-270021-2023','Public Schools District Supervisor','',22,3,NULL,7,'Master\'s degree in Education or other relevant Master\'s degree',16,NULL,5,'5 years cumulative experience in instructional supervision and school management',NULL,0,'RA 1080 (Teacher)',NULL),('SREPS-270013-2023','Senior Education Program Specialist','',19,3,NULL,6,'Bachelor\'s degree in Education or its equivalent and completion of academic requirements for master\'s degree relevant to the job',8,NULL,2,'2 years experience in education research, development, implementation, or other relevant experience',NULL,0,'RA 1080; Career Service (Professional) Appropriate Eligibility for Second Level Position',NULL),('SREPS-270014-2023','Senior Education Program Specialist','',19,3,NULL,6,'Bachelor\'s degree in Education or its equivalent and completion of academic requirements for master\'s degree relevant to the job',8,NULL,2,'2 years experience in education research, development, implementation, or other relevant experience',NULL,0,'RA 1080; Career Service (Professional) Appropriate Eligibility for Second Level Position',NULL),('SREPS-270015-2023','Senior Education Program Specialist','',19,3,NULL,6,'Bachelor\'s degree in Education or its equivalent and completion of academic requirements for master\'s degree relevant to the job',8,NULL,2,'2 years experience in education research, development, implementation, or other relevant experience',NULL,0,'RA 1080; Career Service (Professional) Appropriate Eligibility for Second Level Position',NULL),('SREPS-270016-2023','Senior Education Program Specialist','',19,3,NULL,6,'Bachelor\'s degree in Education or its equivalent and completion of academic requirements for master\'s degree relevant to the job',8,NULL,2,'2 years experience in education research, development, implementation, or other relevant experience',NULL,0,'RA 1080; Career Service (Professional) Appropriate Eligibility for Second Level Position',NULL),('TCH1-000000-0000','Teacher I','',10,1,'Schools Division of Sto. Tomas City',6,'Bachelor\'s degree in Education or any bachelor\'s degree with 18 units of Professional Education',0,NULL,0,NULL,NULL,0,NULL,NULL),('TCH2-000000-0000','Teacher II','',11,0,NULL,NULL,NULL,0,NULL,0,NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `Position` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Position_Category`
--

DROP TABLE IF EXISTS `Position_Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Position_Category` (
  `position_categoryId` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `position_category` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`position_categoryId`),
  UNIQUE KEY `Position_Category_position_categoryId_IDX` (`position_categoryId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Position_Category`
--

LOCK TABLES `Position_Category` WRITE;
/*!40000 ALTER TABLE `Position_Category` DISABLE KEYS */;
INSERT INTO `Position_Category` VALUES (0,'Unknown',NULL),(1,'Teaching',NULL),(2,'School Administration',NULL),(3,'Related-Teaching',NULL),(4,'Non-Teaching (Non-General Services)',NULL),(5,'Non-Teaching (General Services)',NULL);
/*!40000 ALTER TABLE `Position_Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Relevant_Eligibility`
--

DROP TABLE IF EXISTS `Relevant_Eligibility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Relevant_Eligibility` (
  `relevant_eligibilityId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `application_code` varchar(20) NOT NULL,
  `eligibilityId` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`relevant_eligibilityId`),
  KEY `eligibilityId` (`eligibilityId`),
  KEY `Relevant_Eligibility_FK` (`application_code`),
  CONSTRAINT `Relevant_Eligibility_FK` FOREIGN KEY (`application_code`) REFERENCES `Job_Application` (`application_code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Relevant_Eligibility_ibfk_2` FOREIGN KEY (`eligibilityId`) REFERENCES `Eligibility` (`eligibilityId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Relevant_Eligibility`
--

LOCK TABLES `Relevant_Eligibility` WRITE;
/*!40000 ALTER TABLE `Relevant_Eligibility` DISABLE KEYS */;
INSERT INTO `Relevant_Eligibility` VALUES (12,'1018',1),(21,'sdty456462',2),(22,'sdty456462',5),(23,'fdsae5254',1),(24,'u6556tdfgfasd',1),(25,'u6556tdfgfasd',2),(26,'u6556tdfgfasd',5),(27,'u6556tdfgfasd',7),(40,'mfsdsa453',1),(41,'mfsdsa453',2),(42,'mfsdsa453',5),(43,'mfsdsa453',7),(52,'ADdskljfs1234',1),(53,'ADdskljfs1234',2),(54,'1019',1),(55,'1019',2),(56,'1024',2),(57,'1024',6),(59,'TCH1-2023-00000',5);
/*!40000 ALTER TABLE `Relevant_Eligibility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Relevant_Training`
--

DROP TABLE IF EXISTS `Relevant_Training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Relevant_Training` (
  `relevant_trainingId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `descriptive_name` longtext NOT NULL,
  `hours` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `application_code` varchar(20) NOT NULL,
  PRIMARY KEY (`relevant_trainingId`),
  KEY `Relevant_Training_FK` (`application_code`),
  CONSTRAINT `Relevant_Training_FK` FOREIGN KEY (`application_code`) REFERENCES `Job_Application` (`application_code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Relevant_Training`
--

LOCK TABLES `Relevant_Training` WRITE;
/*!40000 ALTER TABLE `Relevant_Training` DISABLE KEYS */;
INSERT INTO `Relevant_Training` VALUES (11,'Clerical',4,'1018'),(26,'ICT Training',16,'sdty456462'),(27,'School Administration',12,'u6556tdfgfasd'),(28,'ICT',8,'u6556tdfgfasd'),(35,'School Administration',12,'mfsdsa453'),(36,'ICT',8,'mfsdsa453'),(41,'IT Support',100,'ADdskljfs1234'),(42,'IT Support',100,'1019'),(43,'ICT Training',16,'1024');
/*!40000 ALTER TABLE `Relevant_Training` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Relevant_Work_Experience`
--

DROP TABLE IF EXISTS `Relevant_Work_Experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Relevant_Work_Experience` (
  `relevant_work_experienceId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `descriptive_name` longtext NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `application_code` varchar(20) NOT NULL,
  PRIMARY KEY (`relevant_work_experienceId`),
  KEY `Relevant_Work_Experience_FK` (`application_code`),
  CONSTRAINT `Relevant_Work_Experience_FK` FOREIGN KEY (`application_code`) REFERENCES `Job_Application` (`application_code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Relevant_Work_Experience`
--

LOCK TABLES `Relevant_Work_Experience` WRITE;
/*!40000 ALTER TABLE `Relevant_Work_Experience` DISABLE KEYS */;
INSERT INTO `Relevant_Work_Experience` VALUES (8,'','2019-06-02','2020-11-04','1018'),(17,'Administrative Assistant','2020-09-14','2022-09-12','sdty456462'),(18,'Secretary','2020-10-12','2023-04-05','sdty456462'),(19,'Master Teacher I','2014-06-17','2017-03-03','u6556tdfgfasd'),(20,'Principal I','2017-03-04',NULL,'u6556tdfgfasd'),(27,'Master Teacher I','2014-06-17','2017-03-03','mfsdsa453'),(28,'Principal I','2017-03-04',NULL,'mfsdsa453'),(33,'Data Tech at SPI','2010-06-10','2013-05-20','ADdskljfs1234'),(34,'Data Tech at SPI','2010-06-10','2013-05-20','1019'),(35,'Administrative Assistant','2020-09-14','2022-09-12','1024'),(36,'Secretary','2020-10-12','2023-04-05','1024');
/*!40000 ALTER TABLE `Relevant_Work_Experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Religion`
--

DROP TABLE IF EXISTS `Religion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Religion` (
  `religionId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `religion` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`religionId`),
  UNIQUE KEY `Religion_religion_IDX` (`religion`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Religion`
--

LOCK TABLES `Religion` WRITE;
/*!40000 ALTER TABLE `Religion` DISABLE KEYS */;
INSERT INTO `Religion` VALUES (6,'Iglesia Ni Cristo',NULL),(7,'Roman Catholic',NULL);
/*!40000 ALTER TABLE `Religion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Required_Eligibility`
--

DROP TABLE IF EXISTS `Required_Eligibility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Required_Eligibility` (
  `required_eligibilityId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `plantilla_item_number` varchar(50) NOT NULL,
  `eligibilityId` tinyint(3) unsigned NOT NULL,
  `eligibilityId2` tinyint(3) unsigned DEFAULT NULL,
  `eligibilityId3` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`required_eligibilityId`),
  UNIQUE KEY `Required_Eligibility_id_IDX` (`required_eligibilityId`) USING BTREE,
  KEY `Required_Eligibility_FK` (`plantilla_item_number`),
  KEY `Required_Eligibility_FK_1` (`eligibilityId`),
  KEY `Required_Eligibility_FK_2` (`eligibilityId2`),
  KEY `Required_Eligibility_FK_3` (`eligibilityId3`),
  CONSTRAINT `Required_Eligibility_FK` FOREIGN KEY (`plantilla_item_number`) REFERENCES `Position` (`plantilla_item_number`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Required_Eligibility_FK_1` FOREIGN KEY (`eligibilityId`) REFERENCES `Eligibility` (`eligibilityId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Required_Eligibility_FK_2` FOREIGN KEY (`eligibilityId2`) REFERENCES `Eligibility` (`eligibilityId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Required_Eligibility_FK_3` FOREIGN KEY (`eligibilityId3`) REFERENCES `Eligibility` (`eligibilityId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Each position can have multiple eligibilities. 3 alternative eligibilities can be specified at a time. Required eligibiities (any of which may have up to 3 alternatives each) may be specified multiple numbers of times.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Required_Eligibility`
--

LOCK TABLES `Required_Eligibility` WRITE;
/*!40000 ALTER TABLE `Required_Eligibility` DISABLE KEYS */;
INSERT INTO `Required_Eligibility` VALUES (1,'ATY3-270054-2023',7,NULL,NULL),(2,'A3-270053-2023',6,NULL,NULL),(3,'ITO1-270052-2023',2,NULL,NULL),(4,'ADOF5-270050-2023',2,NULL,NULL),(5,'ADOF5-270051-2023',2,NULL,NULL),(6,'ADOF4-270046-2023',2,NULL,NULL),(7,'ADOF4-270047-2023',2,NULL,NULL),(8,'ADOF4-270048-2023',2,NULL,NULL),(9,'ADOF4-270049-2023',2,NULL,NULL),(10,'ADOF2-270045-2023',2,NULL,NULL),(11,'ADAS3-270033-2023',1,NULL,NULL),(12,'ADAS3-270034-2023',1,NULL,NULL),(13,'ADAS3-270035-2023',1,NULL,NULL),(14,'ADAS3-270036-2023',1,NULL,NULL),(15,'ADAS3-270037-2023',1,NULL,NULL),(16,'ADAS3-270038-2023',1,NULL,NULL),(17,'ADAS3-270039-2023',1,NULL,NULL),(18,'ADAS3-270040-2023',1,NULL,NULL),(19,'ADAS3-270041-2023',1,NULL,NULL),(20,'ADAS3-270042-2023',1,NULL,NULL),(21,'ADAS3-270043-2023',1,NULL,NULL),(22,'ADAS3-270044-2023',1,NULL,NULL),(23,'ADAS2-270031-2023',1,NULL,NULL),(24,'ADAS2-270032-2023',1,NULL,NULL),(25,'ADAS1-270023-2023',1,NULL,NULL),(26,'ADAS1-270024-2023',1,NULL,NULL),(27,'ADAS1-270025-2023',1,NULL,NULL),(28,'ADAS1-270026-2023',1,NULL,NULL),(29,'ADAS1-270027-2023',1,NULL,NULL),(30,'ADAS1-270028-2023',1,NULL,NULL),(31,'ADAS1-270029-2023',1,NULL,NULL),(32,'ADAS1-270030-2023',1,NULL,NULL),(33,'ADA4-270022-2023',1,NULL,NULL),(34,'CES-270021-2023',5,NULL,NULL),(35,'EPSVR-270020-2023',5,NULL,NULL),(36,'EPSVR-270021-2023',5,NULL,NULL),(37,'EPSVR-270022-2023',5,NULL,NULL),(38,'EPSVR-270023-2023',5,NULL,NULL),(39,'EPSVR-270024-2023',5,NULL,NULL),(40,'EPSVR-270025-2023',5,NULL,NULL),(41,'EPSVR-270026-2023',5,NULL,NULL),(42,'EPSVR-270027-2023',5,NULL,NULL),(43,'EPSVR-270028-2023',5,NULL,NULL),(44,'EPSVR-270029-2023',5,NULL,NULL),(45,'PSDS-270012-2023',5,NULL,NULL),(46,'PSDS-270013-2023',5,NULL,NULL),(47,'PSDS-270014-2023',5,NULL,NULL),(48,'PSDS-270015-2023',5,NULL,NULL),(49,'PSDS-270016-2023',5,NULL,NULL),(50,'PSDS-270017-2023',5,NULL,NULL),(51,'PSDS-270018-2023',5,NULL,NULL),(52,'PSDS-270019-2023',5,NULL,NULL),(53,'PSDS-270020-2023',5,NULL,NULL),(54,'PSDS-270021-2023',5,NULL,NULL),(55,'EPS2-270010-2023',4,2,NULL),(56,'EPS2-270011-2023',4,2,NULL),(57,'LIB2-270003-2023',4,NULL,NULL),(58,'PDO2-270002-2023',2,NULL,NULL),(59,'ADA6-270021-2023',1,NULL,NULL),(60,'CES-270020-2023',5,NULL,NULL),(61,'EPSVR-270019-2023',5,NULL,NULL),(62,'MDOF3-270018-2023',8,NULL,NULL),(63,'ENG3-270017-2023',8,9,NULL),(64,'SREPS-270013-2023',4,2,NULL),(65,'SREPS-270014-2023',4,2,NULL),(66,'SREPS-270015-2023',4,2,NULL),(67,'SREPS-270016-2023',4,2,NULL),(68,'PLO3-270012-2023',2,NULL,NULL),(69,'DENT2-270010-2023',11,NULL,NULL),(70,'DENT2-270011-2023',11,NULL,NULL),(71,'EPS2-270007-2023',4,2,NULL),(72,'EPS2-270008-2023',4,2,NULL),(73,'EPS2-270009-2023',4,2,NULL),(74,'NURS2-270002-2023',12,NULL,NULL),(75,'NURS2-270003-2023',12,NULL,NULL),(76,'NURS2-270004-2023',12,NULL,NULL),(77,'NURS2-270005-2023',12,NULL,NULL),(78,'NURS2-270006-2023',12,NULL,NULL),(79,'PDO2-270001-2023',2,NULL,NULL),(80,'TCH1-000000-0000',5,NULL,NULL);
/*!40000 ALTER TABLE `Required_Eligibility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SET_Address_Location`
--

DROP TABLE IF EXISTS `SET_Address_Location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SET_Address_Location` (
  `address_locationId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `addressId` bigint(20) unsigned NOT NULL,
  `locationId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`address_locationId`),
  UNIQUE KEY `Address_Location_id_IDX` (`address_locationId`) USING BTREE,
  KEY `SET_Address_Location_FK` (`addressId`),
  KEY `SET_Address_Location_FK_1` (`locationId`),
  CONSTRAINT `SET_Address_Location_FK` FOREIGN KEY (`addressId`) REFERENCES `Address` (`addressId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SET_Address_Location_FK_1` FOREIGN KEY (`locationId`) REFERENCES `Location` (`locationId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SET_Address_Location`
--

LOCK TABLES `SET_Address_Location` WRITE;
/*!40000 ALTER TABLE `SET_Address_Location` DISABLE KEYS */;
INSERT INTO `SET_Address_Location` VALUES (1,1,9),(2,1,3),(3,1,2),(4,1,1),(5,2,14),(6,2,13),(7,2,10),(8,2,3),(9,2,2),(10,2,1),(11,3,16),(12,3,15),(13,3,12),(14,3,4),(15,3,2),(16,3,1);
/*!40000 ALTER TABLE `SET_Address_Location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Salary_Table`
--

DROP TABLE IF EXISTS `Salary_Table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Salary_Table` (
  `salary_gradeId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `salary_grade` tinyint(3) unsigned NOT NULL,
  `step_increment` tinyint(3) unsigned NOT NULL,
  `salary` float NOT NULL DEFAULT 0,
  `effectivity_date` date NOT NULL,
  PRIMARY KEY (`salary_gradeId`)
) ENGINE=InnoDB AUTO_INCREMENT=1033 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Salary_Table`
--

LOCK TABLES `Salary_Table` WRITE;
/*!40000 ALTER TABLE `Salary_Table` DISABLE KEYS */;
INSERT INTO `Salary_Table` VALUES (1,1,1,11551,'2020-01-01'),(2,2,1,12276,'2020-01-01'),(3,3,1,13019,'2020-01-01'),(4,4,1,13807,'2020-01-01'),(5,5,1,14641,'2020-01-01'),(6,6,1,15524,'2020-01-01'),(7,7,1,16458,'2020-01-01'),(8,8,1,17505,'2020-01-01'),(9,9,1,18763,'2020-01-01'),(10,10,1,20219,'2020-01-01'),(11,11,1,22316,'2020-01-01'),(12,12,1,24495,'2020-01-01'),(13,13,1,26754,'2020-01-01'),(14,14,1,29277,'2020-01-01'),(15,15,1,32053,'2020-01-01'),(16,16,1,35106,'2020-01-01'),(17,17,1,38464,'2020-01-01'),(18,18,1,42159,'2020-01-01'),(19,19,1,46791,'2020-01-01'),(20,20,1,52703,'2020-01-01'),(21,21,1,59353,'2020-01-01'),(22,22,1,66867,'2020-01-01'),(23,23,1,75359,'2020-01-01'),(24,24,1,85074,'2020-01-01'),(25,25,1,96985,'2020-01-01'),(26,26,1,109593,'2020-01-01'),(27,27,1,123839,'2020-01-01'),(28,28,1,139939,'2020-01-01'),(29,29,1,158131,'2020-01-01'),(30,30,1,178688,'2020-01-01'),(31,31,1,262965,'2020-01-01'),(32,32,1,313512,'2020-01-01'),(33,33,1,395858,'2020-01-01'),(34,1,2,11647,'2020-01-01'),(35,2,2,12369,'2020-01-01'),(36,3,2,13119,'2020-01-01'),(37,4,2,13914,'2020-01-01'),(38,5,2,14754,'2020-01-01'),(39,6,2,15643,'2020-01-01'),(40,7,2,16585,'2020-01-01'),(41,8,2,17663,'2020-01-01'),(42,9,2,18920,'2020-01-01'),(43,10,2,20388,'2020-01-01'),(44,11,2,22600,'2020-01-01'),(45,12,2,24779,'2020-01-01'),(46,13,2,27067,'2020-01-01'),(47,14,2,29621,'2020-01-01'),(48,15,2,32431,'2020-01-01'),(49,16,2,35522,'2020-01-01'),(50,17,2,38922,'2020-01-01'),(51,18,2,42662,'2020-01-01'),(52,19,2,47530,'2020-01-01'),(53,20,2,53537,'2020-01-01'),(54,21,2,60296,'2020-01-01'),(55,22,2,67933,'2020-01-01'),(56,23,2,76563,'2020-01-01'),(57,24,2,86462,'2020-01-01'),(58,25,2,98568,'2020-01-01'),(59,26,2,111381,'2020-01-01'),(60,27,2,125861,'2020-01-01'),(61,28,2,142223,'2020-01-01'),(62,29,2,160712,'2020-01-01'),(63,30,2,181604,'2020-01-01'),(64,31,2,268101,'2020-01-01'),(65,32,2,319835,'2020-01-01'),(66,33,2,407734,'2020-01-01'),(67,1,3,11745,'2020-01-01'),(68,2,3,12464,'2020-01-01'),(69,3,3,13220,'2020-01-01'),(70,4,3,14020,'2020-01-01'),(71,5,3,14867,'2020-01-01'),(72,6,3,15763,'2020-01-01'),(73,7,3,16713,'2020-01-01'),(74,8,3,17823,'2020-01-01'),(75,9,3,19078,'2020-01-01'),(76,10,3,20558,'2020-01-01'),(77,11,3,22889,'2020-01-01'),(78,12,3,25067,'2020-01-01'),(79,13,3,27383,'2020-01-01'),(80,14,3,29969,'2020-01-01'),(81,15,3,32814,'2020-01-01'),(82,16,3,35943,'2020-01-01'),(83,17,3,39385,'2020-01-01'),(84,18,3,43172,'2020-01-01'),(85,19,3,48281,'2020-01-01'),(86,20,3,54386,'2020-01-01'),(87,21,3,61255,'2020-01-01'),(88,22,3,69017,'2020-01-01'),(89,23,3,77788,'2020-01-01'),(90,24,3,87874,'2020-01-01'),(91,25,3,100176,'2020-01-01'),(92,26,3,113200,'2020-01-01'),(93,27,3,127915,'2020-01-01'),(94,28,3,144544,'2020-01-01'),(95,29,3,163335,'2020-01-01'),(96,30,3,184568,'2020-01-01'),(97,31,3,273338,'2020-01-01'),(98,32,3,326285,'2020-01-01'),(99,1,4,11843,'2020-01-01'),(100,2,4,12560,'2020-01-01'),(101,3,4,13322,'2020-01-01'),(102,4,4,14128,'2020-01-01'),(103,5,4,14981,'2020-01-01'),(104,6,4,15884,'2020-01-01'),(105,7,4,16841,'2020-01-01'),(106,8,4,17984,'2020-01-01'),(107,9,4,19238,'2020-01-01'),(108,10,4,20731,'2020-01-01'),(109,11,4,23181,'2020-01-01'),(110,12,4,25358,'2020-01-01'),(111,13,4,27703,'2020-01-01'),(112,14,4,30322,'2020-01-01'),(113,15,4,33202,'2020-01-01'),(114,16,4,36369,'2020-01-01'),(115,17,4,39854,'2020-01-01'),(116,18,4,43687,'2020-01-01'),(117,19,4,49044,'2020-01-01'),(118,20,4,55248,'2020-01-01'),(119,21,4,62229,'2020-01-01'),(120,22,4,70118,'2020-01-01'),(121,23,4,79034,'2020-01-01'),(122,24,4,89308,'2020-01-01'),(123,25,4,101811,'2020-01-01'),(124,26,4,115047,'2020-01-01'),(125,27,4,130003,'2020-01-01'),(126,28,4,146903,'2020-01-01'),(127,29,4,166001,'2020-01-01'),(128,30,4,187581,'2020-01-01'),(129,31,4,278676,'2020-01-01'),(130,32,4,332865,'2020-01-01'),(131,1,5,11942,'2020-01-01'),(132,2,5,12657,'2020-01-01'),(133,3,5,13424,'2020-01-01'),(134,4,5,14236,'2020-01-01'),(135,5,5,15096,'2020-01-01'),(136,6,5,16007,'2020-01-01'),(137,7,5,16970,'2020-01-01'),(138,8,5,18146,'2020-01-01'),(139,9,5,19399,'2020-01-01'),(140,10,5,20903,'2020-01-01'),(141,11,5,23477,'2020-01-01'),(142,12,5,25653,'2020-01-01'),(143,13,5,28028,'2020-01-01'),(144,14,5,30678,'2020-01-01'),(145,15,5,33594,'2020-01-01'),(146,16,5,36801,'2020-01-01'),(147,17,5,40329,'2020-01-01'),(148,18,5,44210,'2020-01-01'),(149,19,5,49820,'2020-01-01'),(150,20,5,56125,'2020-01-01'),(151,21,5,63220,'2020-01-01'),(152,22,5,71237,'2020-01-01'),(153,23,5,80324,'2020-01-01'),(154,24,5,90766,'2020-01-01'),(155,25,5,103473,'2020-01-01'),(156,26,5,116925,'2020-01-01'),(157,27,5,132125,'2020-01-01'),(158,28,5,149300,'2020-01-01'),(159,29,5,168710,'2020-01-01'),(160,30,5,190642,'2020-01-01'),(161,31,5,284120,'2020-01-01'),(162,32,5,339577,'2020-01-01'),(163,1,6,12042,'2020-01-01'),(164,2,6,12754,'2020-01-01'),(165,3,6,13527,'2020-01-01'),(166,4,6,14345,'2020-01-01'),(167,5,6,15212,'2020-01-01'),(168,6,6,16129,'2020-01-01'),(169,7,6,17101,'2020-01-01'),(170,8,6,18310,'2020-01-01'),(171,9,6,19561,'2020-01-01'),(172,10,6,21079,'2020-01-01'),(173,11,6,23778,'2020-01-01'),(174,12,6,25952,'2020-01-01'),(175,13,6,28356,'2020-01-01'),(176,14,6,31039,'2020-01-01'),(177,15,6,33991,'2020-01-01'),(178,16,6,37238,'2020-01-01'),(179,17,6,40810,'2020-01-01'),(180,18,6,44739,'2020-01-01'),(181,19,6,50608,'2020-01-01'),(182,20,6,57016,'2020-01-01'),(183,21,6,64226,'2020-01-01'),(184,22,6,72375,'2020-01-01'),(185,23,6,81635,'2020-01-01'),(186,24,6,92248,'2020-01-01'),(187,25,6,105162,'2020-01-01'),(188,26,6,118833,'2020-01-01'),(189,27,6,134281,'2020-01-01'),(190,28,6,151738,'2020-01-01'),(191,29,6,171464,'2020-01-01'),(192,30,6,193754,'2020-01-01'),(193,31,6,289669,'2020-01-01'),(194,32,6,346426,'2020-01-01'),(195,1,7,12143,'2020-01-01'),(196,2,7,12852,'2020-01-01'),(197,3,7,13631,'2020-01-01'),(198,4,7,14456,'2020-01-01'),(199,5,7,15329,'2020-01-01'),(200,6,7,16253,'2020-01-01'),(201,7,7,17231,'2020-01-01'),(202,8,7,18476,'2020-01-01'),(203,9,7,19725,'2020-01-01'),(204,10,7,21254,'2020-01-01'),(205,11,7,24082,'2020-01-01'),(206,12,7,26254,'2020-01-01'),(207,13,7,28688,'2020-01-01'),(208,14,7,31405,'2020-01-01'),(209,15,7,34393,'2020-01-01'),(210,16,7,37681,'2020-01-01'),(211,17,7,41296,'2020-01-01'),(212,18,7,45274,'2020-01-01'),(213,19,7,51410,'2020-01-01'),(214,20,7,57921,'2020-01-01'),(215,21,7,65249,'2020-01-01'),(216,22,7,73531,'2020-01-01'),(217,23,7,82967,'2020-01-01'),(218,24,7,93753,'2020-01-01'),(219,25,7,106879,'2020-01-01'),(220,26,7,120772,'2020-01-01'),(221,27,7,136473,'2020-01-01'),(222,28,7,154215,'2020-01-01'),(223,29,7,174262,'2020-01-01'),(224,30,7,196916,'2020-01-01'),(225,31,7,295327,'2020-01-01'),(226,32,7,353413,'2020-01-01'),(227,1,8,12244,'2020-01-01'),(228,2,8,12950,'2020-01-01'),(229,3,8,13736,'2020-01-01'),(230,4,8,14567,'2020-01-01'),(231,5,8,15446,'2020-01-01'),(232,6,8,16378,'2020-01-01'),(233,7,8,17364,'2020-01-01'),(234,8,8,18643,'2020-01-01'),(235,9,8,19890,'2020-01-01'),(236,10,8,21432,'2020-01-01'),(237,11,8,24391,'2020-01-01'),(238,12,8,26560,'2020-01-01'),(239,13,8,29025,'2020-01-01'),(240,14,8,31775,'2020-01-01'),(241,15,8,34801,'2020-01-01'),(242,16,8,38128,'2020-01-01'),(243,17,8,41789,'2020-01-01'),(244,18,8,45816,'2020-01-01'),(245,19,8,52224,'2020-01-01'),(246,20,8,58841,'2020-01-01'),(247,21,8,66289,'2020-01-01'),(248,22,8,74705,'2020-01-01'),(249,23,8,84321,'2020-01-01'),(250,24,8,95283,'2020-01-01'),(251,25,8,108623,'2020-01-01'),(252,26,8,122744,'2020-01-01'),(253,27,8,138701,'2020-01-01'),(254,28,8,156731,'2020-01-01'),(255,29,8,177107,'2020-01-01'),(256,30,8,200130,'2020-01-01'),(257,31,8,301095,'2020-01-01'),(258,32,8,360539,'2020-01-01'),(259,1,1,12034,'2021-01-01'),(260,2,1,12790,'2021-01-01'),(261,3,1,13572,'2021-01-01'),(262,4,1,14400,'2021-01-01'),(263,5,1,15275,'2021-01-01'),(264,6,1,16200,'2021-01-01'),(265,7,1,17179,'2021-01-01'),(266,8,1,18251,'2021-01-01'),(267,9,1,19552,'2021-01-01'),(268,10,1,21205,'2021-01-01'),(269,11,1,23877,'2021-01-01'),(270,12,1,26052,'2021-01-01'),(271,13,1,28276,'2021-01-01'),(272,14,1,30799,'2021-01-01'),(273,15,1,33575,'2021-01-01'),(274,16,1,36628,'2021-01-01'),(275,17,1,39986,'2021-01-01'),(276,18,1,43681,'2021-01-01'),(277,19,1,48313,'2021-01-01'),(278,20,1,54251,'2021-01-01'),(279,21,1,60901,'2021-01-01'),(280,22,1,68415,'2021-01-01'),(281,23,1,76907,'2021-01-01'),(282,24,1,86742,'2021-01-01'),(283,25,1,98886,'2021-01-01'),(284,26,1,111742,'2021-01-01'),(285,27,1,126267,'2021-01-01'),(286,28,1,142683,'2021-01-01'),(287,29,1,161231,'2021-01-01'),(288,30,1,182191,'2021-01-01'),(289,31,1,268121,'2021-01-01'),(290,32,1,319660,'2021-01-01'),(291,33,1,403620,'2021-01-01'),(292,1,2,12134,'2021-01-01'),(293,2,2,12888,'2021-01-01'),(294,3,2,13677,'2021-01-01'),(295,4,2,14511,'2021-01-01'),(296,5,2,15393,'2021-01-01'),(297,6,2,16325,'2021-01-01'),(298,7,2,17311,'2021-01-01'),(299,8,2,18417,'2021-01-01'),(300,9,2,19715,'2021-01-01'),(301,10,2,21382,'2021-01-01'),(302,11,2,24161,'2021-01-01'),(303,12,2,26336,'2021-01-01'),(304,13,2,28589,'2021-01-01'),(305,14,2,31143,'2021-01-01'),(306,15,2,33953,'2021-01-01'),(307,16,2,37044,'2021-01-01'),(308,17,2,40444,'2021-01-01'),(309,18,2,44184,'2021-01-01'),(310,19,2,49052,'2021-01-01'),(311,20,2,55085,'2021-01-01'),(312,21,2,61844,'2021-01-01'),(313,22,2,69481,'2021-01-01'),(314,23,2,78111,'2021-01-01'),(315,24,2,88158,'2021-01-01'),(316,25,2,100500,'2021-01-01'),(317,26,2,113565,'2021-01-01'),(318,27,2,128329,'2021-01-01'),(319,28,2,145011,'2021-01-01'),(320,29,2,163863,'2021-01-01'),(321,30,2,185165,'2021-01-01'),(322,31,2,273358,'2021-01-01'),(323,32,2,326107,'2021-01-01'),(324,33,2,415728,'2021-01-01'),(325,1,3,12236,'2021-01-01'),(326,2,3,12987,'2021-01-01'),(327,3,3,13781,'2021-01-01'),(328,4,3,14622,'2021-01-01'),(329,5,3,15511,'2021-01-01'),(330,6,3,16450,'2021-01-01'),(331,7,3,17444,'2021-01-01'),(332,8,3,18583,'2021-01-01'),(333,9,3,19880,'2021-01-01'),(334,10,3,21561,'2021-01-01'),(335,11,3,24450,'2021-01-01'),(336,12,3,26624,'2021-01-01'),(337,13,3,28905,'2021-01-01'),(338,14,3,31491,'2021-01-01'),(339,15,3,34336,'2021-01-01'),(340,16,3,37465,'2021-01-01'),(341,17,3,40907,'2021-01-01'),(342,18,3,44694,'2021-01-01'),(343,19,3,49803,'2021-01-01'),(344,20,3,55934,'2021-01-01'),(345,21,3,62803,'2021-01-01'),(346,22,3,70565,'2021-01-01'),(347,23,3,79336,'2021-01-01'),(348,24,3,89597,'2021-01-01'),(349,25,3,102140,'2021-01-01'),(350,26,3,115419,'2021-01-01'),(351,27,3,130423,'2021-01-01'),(352,28,3,147378,'2021-01-01'),(353,29,3,166537,'2021-01-01'),(354,30,3,188187,'2021-01-01'),(355,31,3,278697,'2021-01-01'),(356,32,3,332682,'2021-01-01'),(357,1,4,12339,'2021-01-01'),(358,2,4,13087,'2021-01-01'),(359,3,4,13888,'2021-01-01'),(360,4,4,14735,'2021-01-01'),(361,5,4,15630,'2021-01-01'),(362,6,4,16577,'2021-01-01'),(363,7,4,17578,'2021-01-01'),(364,8,4,18751,'2021-01-01'),(365,9,4,20046,'2021-01-01'),(366,10,4,21741,'2021-01-01'),(367,11,4,24742,'2021-01-01'),(368,12,4,26915,'2021-01-01'),(369,13,4,29225,'2021-01-01'),(370,14,4,31844,'2021-01-01'),(371,15,4,34724,'2021-01-01'),(372,16,4,37891,'2021-01-01'),(373,17,4,41376,'2021-01-01'),(374,18,4,45209,'2021-01-01'),(375,19,4,50566,'2021-01-01'),(376,20,4,56796,'2021-01-01'),(377,21,4,63777,'2021-01-01'),(378,22,4,71666,'2021-01-01'),(379,23,4,80583,'2021-01-01'),(380,24,4,91059,'2021-01-01'),(381,25,4,103808,'2021-01-01'),(382,26,4,117303,'2021-01-01'),(383,27,4,132552,'2021-01-01'),(384,28,4,149784,'2021-01-01'),(385,29,4,169256,'2021-01-01'),(386,30,4,191259,'2021-01-01'),(387,31,4,284140,'2021-01-01'),(388,32,4,339392,'2021-01-01'),(389,1,5,12442,'2021-01-01'),(390,2,5,13187,'2021-01-01'),(391,3,5,13995,'2021-01-01'),(392,4,5,14848,'2021-01-01'),(393,5,5,15750,'2021-01-01'),(394,6,5,16704,'2021-01-01'),(395,7,5,17713,'2021-01-01'),(396,8,5,18920,'2021-01-01'),(397,9,5,20214,'2021-01-01'),(398,10,5,21923,'2021-01-01'),(399,11,5,25038,'2021-01-01'),(400,12,5,27210,'2021-01-01'),(401,13,5,29550,'2021-01-01'),(402,14,5,32200,'2021-01-01'),(403,15,5,35116,'2021-01-01'),(404,16,5,38323,'2021-01-01'),(405,17,5,41851,'2021-01-01'),(406,18,5,45732,'2021-01-01'),(407,19,5,51342,'2021-01-01'),(408,20,5,57673,'2021-01-01'),(409,21,5,64768,'2021-01-01'),(410,22,5,72785,'2021-01-01'),(411,23,5,81899,'2021-01-01'),(412,24,5,92545,'2021-01-01'),(413,25,5,105502,'2021-01-01'),(414,26,5,119217,'2021-01-01'),(415,27,5,134715,'2021-01-01'),(416,28,5,152228,'2021-01-01'),(417,29,5,172018,'2021-01-01'),(418,30,5,194380,'2021-01-01'),(419,31,5,289691,'2021-01-01'),(420,32,5,346236,'2021-01-01'),(421,1,6,12545,'2021-01-01'),(422,2,6,13288,'2021-01-01'),(423,3,6,14101,'2021-01-01'),(424,4,6,14961,'2021-01-01'),(425,5,6,15871,'2021-01-01'),(426,6,6,16832,'2021-01-01'),(427,7,6,17849,'2021-01-01'),(428,8,6,19091,'2021-01-01'),(429,9,6,20382,'2021-01-01'),(430,10,6,22106,'2021-01-01'),(431,11,6,25339,'2021-01-01'),(432,12,6,27509,'2021-01-01'),(433,13,6,29878,'2021-01-01'),(434,14,6,32561,'2021-01-01'),(435,15,6,35513,'2021-01-01'),(436,16,6,38760,'2021-01-01'),(437,17,6,42332,'2021-01-01'),(438,18,6,46261,'2021-01-01'),(439,19,6,52130,'2021-01-01'),(440,20,6,58564,'2021-01-01'),(441,21,6,65774,'2021-01-01'),(442,22,6,73923,'2021-01-01'),(443,23,6,83235,'2021-01-01'),(444,24,6,94057,'2021-01-01'),(445,25,6,107224,'2021-01-01'),(446,26,6,121163,'2021-01-01'),(447,27,6,136914,'2021-01-01'),(448,28,6,154714,'2021-01-01'),(449,29,6,174826,'2021-01-01'),(450,30,6,197553,'2021-01-01'),(451,31,6,295349,'2021-01-01'),(452,32,6,353218,'2021-01-01'),(453,1,7,12651,'2021-01-01'),(454,2,7,13390,'2021-01-01'),(455,3,7,14210,'2021-01-01'),(456,4,7,15077,'2021-01-01'),(457,5,7,15993,'2021-01-01'),(458,6,7,16962,'2021-01-01'),(459,7,7,17985,'2021-01-01'),(460,8,7,19264,'2021-01-01'),(461,9,7,20553,'2021-01-01'),(462,10,7,22291,'2021-01-01'),(463,11,7,25643,'2021-01-01'),(464,12,7,27811,'2021-01-01'),(465,13,7,30210,'2021-01-01'),(466,14,7,32927,'2021-01-01'),(467,15,7,35915,'2021-01-01'),(468,16,7,39203,'2021-01-01'),(469,17,7,42818,'2021-01-01'),(470,18,7,46796,'2021-01-01'),(471,19,7,52932,'2021-01-01'),(472,20,7,59469,'2021-01-01'),(473,21,7,66797,'2021-01-01'),(474,22,7,75079,'2021-01-01'),(475,23,7,84594,'2021-01-01'),(476,24,7,95592,'2021-01-01'),(477,25,7,108974,'2021-01-01'),(478,26,7,123140,'2021-01-01'),(479,27,7,139149,'2021-01-01'),(480,28,7,157239,'2021-01-01'),(481,29,7,177679,'2021-01-01'),(482,30,7,200777,'2021-01-01'),(483,31,7,301117,'2021-01-01'),(484,32,7,360342,'2021-01-01'),(485,1,8,12756,'2021-01-01'),(486,2,8,13493,'2021-01-01'),(487,3,8,14319,'2021-01-01'),(488,4,8,15192,'2021-01-01'),(489,5,8,16115,'2021-01-01'),(490,6,8,17092,'2021-01-01'),(491,7,8,18124,'2021-01-01'),(492,8,8,19438,'2021-01-01'),(493,9,8,20725,'2021-01-01'),(494,10,8,22477,'2021-01-01'),(495,11,8,25952,'2021-01-01'),(496,12,8,28117,'2021-01-01'),(497,13,8,30547,'2021-01-01'),(498,14,8,33297,'2021-01-01'),(499,15,8,36323,'2021-01-01'),(500,16,8,39650,'2021-01-01'),(501,17,8,43311,'2021-01-01'),(502,18,8,47338,'2021-01-01'),(503,19,8,53746,'2021-01-01'),(504,20,8,60389,'2021-01-01'),(505,21,8,67837,'2021-01-01'),(506,22,8,76253,'2021-01-01'),(507,23,8,85975,'2021-01-01'),(508,24,8,97152,'2021-01-01'),(509,25,8,110753,'2021-01-01'),(510,26,8,125150,'2021-01-01'),(511,27,8,141420,'2021-01-01'),(512,28,8,159804,'2021-01-01'),(513,29,8,180579,'2021-01-01'),(514,30,8,204054,'2021-01-01'),(515,31,8,306999,'2021-01-01'),(516,32,8,367609,'2021-01-01'),(517,1,1,12517,'2022-01-01'),(518,2,1,13305,'2022-01-01'),(519,3,1,14125,'2022-01-01'),(520,4,1,14993,'2022-01-01'),(521,5,1,15909,'2022-01-01'),(522,6,1,16877,'2022-01-01'),(523,7,1,17899,'2022-01-01'),(524,8,1,18998,'2022-01-01'),(525,9,1,20340,'2022-01-01'),(526,10,1,22190,'2022-01-01'),(527,11,1,25439,'2022-01-01'),(528,12,1,27608,'2022-01-01'),(529,13,1,29798,'2022-01-01'),(530,14,1,32321,'2022-01-01'),(531,15,1,35097,'2022-01-01'),(532,16,1,38150,'2022-01-01'),(533,17,1,41508,'2022-01-01'),(534,18,1,45203,'2022-01-01'),(535,19,1,49835,'2022-01-01'),(536,20,1,55799,'2022-01-01'),(537,21,1,62449,'2022-01-01'),(538,22,1,69963,'2022-01-01'),(539,23,1,78455,'2022-01-01'),(540,24,1,88410,'2022-01-01'),(541,25,1,100788,'2022-01-01'),(542,26,1,113891,'2022-01-01'),(543,27,1,128696,'2022-01-01'),(544,28,1,145427,'2022-01-01'),(545,29,1,164332,'2022-01-01'),(546,30,1,185695,'2022-01-01'),(547,31,1,273278,'2022-01-01'),(548,32,1,325807,'2022-01-01'),(549,33,1,411382,'2022-01-01'),(550,1,2,12621,'2022-01-01'),(551,2,2,13406,'2022-01-01'),(552,3,2,14234,'2022-01-01'),(553,4,2,15109,'2022-01-01'),(554,5,2,16032,'2022-01-01'),(555,6,2,17007,'2022-01-01'),(556,7,2,18037,'2022-01-01'),(557,8,2,19170,'2022-01-01'),(558,9,2,20509,'2022-01-01'),(559,10,2,22376,'2022-01-01'),(560,11,2,25723,'2022-01-01'),(561,12,2,27892,'2022-01-01'),(562,13,2,30111,'2022-01-01'),(563,14,2,32665,'2022-01-01'),(564,15,2,35475,'2022-01-01'),(565,16,2,38566,'2022-01-01'),(566,17,2,41966,'2022-01-01'),(567,18,2,45706,'2022-01-01'),(568,19,2,50574,'2022-01-01'),(569,20,2,56633,'2022-01-01'),(570,21,2,63392,'2022-01-01'),(571,22,2,71029,'2022-01-01'),(572,23,2,79659,'2022-01-01'),(573,24,2,89853,'2022-01-01'),(574,25,2,102433,'2022-01-01'),(575,26,2,115749,'2022-01-01'),(576,27,2,130797,'2022-01-01'),(577,28,2,147800,'2022-01-01'),(578,29,2,167015,'2022-01-01'),(579,30,2,188726,'2022-01-01'),(580,31,2,278615,'2022-01-01'),(581,32,2,332378,'2022-01-01'),(582,33,2,423723,'2022-01-01'),(583,1,3,12728,'2022-01-01'),(584,2,3,13509,'2022-01-01'),(585,3,3,14343,'2022-01-01'),(586,4,3,15224,'2022-01-01'),(587,5,3,16155,'2022-01-01'),(588,6,3,17137,'2022-01-01'),(589,7,3,18176,'2022-01-01'),(590,8,3,19343,'2022-01-01'),(591,9,3,20681,'2022-01-01'),(592,10,3,22563,'2022-01-01'),(593,11,3,26012,'2022-01-01'),(594,12,3,28180,'2022-01-01'),(595,13,3,30427,'2022-01-01'),(596,14,3,33013,'2022-01-01'),(597,15,3,35858,'2022-01-01'),(598,16,3,38987,'2022-01-01'),(599,17,3,42429,'2022-01-01'),(600,18,3,46216,'2022-01-01'),(601,19,3,51325,'2022-01-01'),(602,20,3,57482,'2022-01-01'),(603,21,3,64351,'2022-01-01'),(604,22,3,72113,'2022-01-01'),(605,23,3,80884,'2022-01-01'),(606,24,3,91320,'2022-01-01'),(607,25,3,104105,'2022-01-01'),(608,26,3,117639,'2022-01-01'),(609,27,3,132931,'2022-01-01'),(610,28,3,150213,'2022-01-01'),(611,29,3,169740,'2022-01-01'),(612,30,3,191806,'2022-01-01'),(613,31,3,284057,'2022-01-01'),(614,32,3,339080,'2022-01-01'),(615,1,4,12834,'2022-01-01'),(616,2,4,13613,'2022-01-01'),(617,3,4,14454,'2022-01-01'),(618,4,4,15341,'2022-01-01'),(619,5,4,16279,'2022-01-01'),(620,6,4,17269,'2022-01-01'),(621,7,4,18315,'2022-01-01'),(622,8,4,19518,'2022-01-01'),(623,9,4,20854,'2022-01-01'),(624,10,4,22752,'2022-01-01'),(625,11,4,26304,'2022-01-01'),(626,12,4,28471,'2022-01-01'),(627,13,4,30747,'2022-01-01'),(628,14,4,33366,'2022-01-01'),(629,15,4,36246,'2022-01-01'),(630,16,4,39413,'2022-01-01'),(631,17,4,42898,'2022-01-01'),(632,18,4,46731,'2022-01-01'),(633,19,4,52088,'2022-01-01'),(634,20,4,58344,'2022-01-01'),(635,21,4,65325,'2022-01-01'),(636,22,4,73214,'2022-01-01'),(637,23,4,82133,'2022-01-01'),(638,24,4,92810,'2022-01-01'),(639,25,4,105804,'2022-01-01'),(640,26,4,119558,'2022-01-01'),(641,27,4,135101,'2022-01-01'),(642,28,4,152664,'2022-01-01'),(643,29,4,172511,'2022-01-01'),(644,30,4,194937,'2022-01-01'),(645,31,4,289605,'2022-01-01'),(646,32,4,345918,'2022-01-01'),(647,1,5,12941,'2022-01-01'),(648,2,5,13718,'2022-01-01'),(649,3,5,14565,'2022-01-01'),(650,4,5,15459,'2022-01-01'),(651,5,5,16404,'2022-01-01'),(652,6,5,17402,'2022-01-01'),(653,7,5,18455,'2022-01-01'),(654,8,5,19694,'2022-01-01'),(655,9,5,21029,'2022-01-01'),(656,10,5,22942,'2022-01-01'),(657,11,5,26600,'2022-01-01'),(658,12,5,28766,'2022-01-01'),(659,13,5,31072,'2022-01-01'),(660,14,5,33722,'2022-01-01'),(661,15,5,36638,'2022-01-01'),(662,16,5,39845,'2022-01-01'),(663,17,5,43373,'2022-01-01'),(664,18,5,47254,'2022-01-01'),(665,19,5,52864,'2022-01-01'),(666,20,5,59221,'2022-01-01'),(667,21,5,66316,'2022-01-01'),(668,22,5,74333,'2022-01-01'),(669,23,5,83474,'2022-01-01'),(670,24,5,94325,'2022-01-01'),(671,25,5,107531,'2022-01-01'),(672,26,5,121510,'2022-01-01'),(673,27,5,137306,'2022-01-01'),(674,28,5,155155,'2022-01-01'),(675,29,5,175326,'2022-01-01'),(676,30,5,198118,'2022-01-01'),(677,31,5,295262,'2022-01-01'),(678,32,5,352894,'2022-01-01'),(679,1,6,13049,'2022-01-01'),(680,2,6,13823,'2022-01-01'),(681,3,6,14676,'2022-01-01'),(682,4,6,15577,'2022-01-01'),(683,5,6,16530,'2022-01-01'),(684,6,6,17535,'2022-01-01'),(685,7,6,18598,'2022-01-01'),(686,8,6,19872,'2022-01-01'),(687,9,6,21204,'2022-01-01'),(688,10,6,23134,'2022-01-01'),(689,11,6,26901,'2022-01-01'),(690,12,6,29065,'2022-01-01'),(691,13,6,31400,'2022-01-01'),(692,14,6,34083,'2022-01-01'),(693,15,6,37035,'2022-01-01'),(694,16,6,40282,'2022-01-01'),(695,17,6,43854,'2022-01-01'),(696,18,6,47783,'2022-01-01'),(697,19,6,53652,'2022-01-01'),(698,20,6,60112,'2022-01-01'),(699,21,6,67322,'2022-01-01'),(700,22,6,75471,'2022-01-01'),(701,23,6,84836,'2022-01-01'),(702,24,6,95865,'2022-01-01'),(703,25,6,109286,'2022-01-01'),(704,26,6,123493,'2022-01-01'),(705,27,6,139547,'2022-01-01'),(706,28,6,157689,'2022-01-01'),(707,29,6,178188,'2022-01-01'),(708,30,6,201352,'2022-01-01'),(709,31,6,301028,'2022-01-01'),(710,32,6,360011,'2022-01-01'),(711,1,7,13159,'2022-01-01'),(712,2,7,13929,'2022-01-01'),(713,3,7,14790,'2022-01-01'),(714,4,7,15698,'2022-01-01'),(715,5,7,16657,'2022-01-01'),(716,6,7,17670,'2022-01-01'),(717,7,7,18740,'2022-01-01'),(718,8,7,20052,'2022-01-01'),(719,9,7,21382,'2022-01-01'),(720,10,7,23327,'2022-01-01'),(721,11,7,27205,'2022-01-01'),(722,12,7,29367,'2022-01-01'),(723,13,7,31732,'2022-01-01'),(724,14,7,34449,'2022-01-01'),(725,15,7,37437,'2022-01-01'),(726,16,7,40725,'2022-01-01'),(727,17,7,44340,'2022-01-01'),(728,18,7,48318,'2022-01-01'),(729,19,7,54454,'2022-01-01'),(730,20,7,61017,'2022-01-01'),(731,21,7,68345,'2022-01-01'),(732,22,7,76627,'2022-01-01'),(733,23,7,86220,'2022-01-01'),(734,24,7,97430,'2022-01-01'),(735,25,7,111070,'2022-01-01'),(736,26,7,125508,'2022-01-01'),(737,27,7,141825,'2022-01-01'),(738,28,7,160262,'2022-01-01'),(739,29,7,181096,'2022-01-01'),(740,30,7,204638,'2022-01-01'),(741,31,7,306908,'2022-01-01'),(742,32,7,367272,'2022-01-01'),(743,1,8,13268,'2022-01-01'),(744,2,8,14035,'2022-01-01'),(745,3,8,14903,'2022-01-01'),(746,4,8,15818,'2022-01-01'),(747,5,8,16784,'2022-01-01'),(748,6,8,17806,'2022-01-01'),(749,7,8,18884,'2022-01-01'),(750,8,8,20233,'2022-01-01'),(751,9,8,21561,'2022-01-01'),(752,10,8,23522,'2022-01-01'),(753,11,8,27514,'2022-01-01'),(754,12,8,29673,'2022-01-01'),(755,13,8,32069,'2022-01-01'),(756,14,8,34819,'2022-01-01'),(757,15,8,37845,'2022-01-01'),(758,16,8,41172,'2022-01-01'),(759,17,8,44833,'2022-01-01'),(760,18,8,48860,'2022-01-01'),(761,19,8,55268,'2022-01-01'),(762,20,8,61937,'2022-01-01'),(763,21,8,69385,'2022-01-01'),(764,22,8,77801,'2022-01-01'),(765,23,8,87628,'2022-01-01'),(766,24,8,99020,'2022-01-01'),(767,25,8,112883,'2022-01-01'),(768,26,8,127557,'2022-01-01'),(769,27,8,144140,'2022-01-01'),(770,28,8,162877,'2022-01-01'),(771,29,8,184052,'2022-01-01'),(772,30,8,207978,'2022-01-01'),(773,31,8,312902,'2022-01-01'),(774,32,8,374678,'2022-01-01'),(775,1,1,13000,'2023-01-01'),(776,2,1,13819,'2023-01-01'),(777,3,1,14678,'2023-01-01'),(778,4,1,15586,'2023-01-01'),(779,5,1,16543,'2023-01-01'),(780,6,1,17553,'2023-01-01'),(781,7,1,18620,'2023-01-01'),(782,8,1,19744,'2023-01-01'),(783,9,1,21129,'2023-01-01'),(784,10,1,23176,'2023-01-01'),(785,11,1,27000,'2023-01-01'),(786,12,1,29165,'2023-01-01'),(787,13,1,31320,'2023-01-01'),(788,14,1,33843,'2023-01-01'),(789,15,1,36619,'2023-01-01'),(790,16,1,39672,'2023-01-01'),(791,17,1,43030,'2023-01-01'),(792,18,1,46725,'2023-01-01'),(793,19,1,51357,'2023-01-01'),(794,20,1,57347,'2023-01-01'),(795,21,1,63997,'2023-01-01'),(796,22,1,71511,'2023-01-01'),(797,23,1,80003,'2023-01-01'),(798,24,1,90078,'2023-01-01'),(799,25,1,102690,'2023-01-01'),(800,26,1,116040,'2023-01-01'),(801,27,1,131124,'2023-01-01'),(802,28,1,148171,'2023-01-01'),(803,29,1,167432,'2023-01-01'),(804,30,1,189199,'2023-01-01'),(805,31,1,278434,'2023-01-01'),(806,32,1,331954,'2023-01-01'),(807,33,1,419144,'2023-01-01'),(808,1,2,13109,'2023-01-01'),(809,2,2,13925,'2023-01-01'),(810,3,2,14792,'2023-01-01'),(811,4,2,15706,'2023-01-01'),(812,5,2,16671,'2023-01-01'),(813,6,2,17688,'2023-01-01'),(814,7,2,18763,'2023-01-01'),(815,8,2,19923,'2023-01-01'),(816,9,2,21304,'2023-01-01'),(817,10,2,23370,'2023-01-01'),(818,11,2,27284,'2023-01-01'),(819,12,2,29449,'2023-01-01'),(820,13,2,31633,'2023-01-01'),(821,14,2,34187,'2023-01-01'),(822,15,2,36997,'2023-01-01'),(823,16,2,40088,'2023-01-01'),(824,17,2,43488,'2023-01-01'),(825,18,2,47228,'2023-01-01'),(826,19,2,52096,'2023-01-01'),(827,20,2,58181,'2023-01-01'),(828,21,2,64940,'2023-01-01'),(829,22,2,72577,'2023-01-01'),(830,23,2,81207,'2023-01-01'),(831,24,2,91548,'2023-01-01'),(832,25,2,104366,'2023-01-01'),(833,26,2,117933,'2023-01-01'),(834,27,2,133264,'2023-01-01'),(835,28,2,150589,'2023-01-01'),(836,29,2,170166,'2023-01-01'),(837,30,2,192286,'2023-01-01'),(838,31,2,283872,'2023-01-01'),(839,32,2,338649,'2023-01-01'),(840,33,2,431718,'2023-01-01'),(841,1,3,13219,'2023-01-01'),(842,2,3,14032,'2023-01-01'),(843,3,3,14905,'2023-01-01'),(844,4,3,15827,'2023-01-01'),(845,5,3,16799,'2023-01-01'),(846,6,3,17824,'2023-01-01'),(847,7,3,18907,'2023-01-01'),(848,8,3,20104,'2023-01-01'),(849,9,3,21483,'2023-01-01'),(850,10,3,23565,'2023-01-01'),(851,11,3,27573,'2023-01-01'),(852,12,3,29737,'2023-01-01'),(853,13,3,31949,'2023-01-01'),(854,14,3,34535,'2023-01-01'),(855,15,3,37380,'2023-01-01'),(856,16,3,40509,'2023-01-01'),(857,17,3,43951,'2023-01-01'),(858,18,3,47738,'2023-01-01'),(859,19,3,52847,'2023-01-01'),(860,20,3,59030,'2023-01-01'),(861,21,3,65899,'2023-01-01'),(862,22,3,73661,'2023-01-01'),(863,23,3,82432,'2023-01-01'),(864,24,3,93043,'2023-01-01'),(865,25,3,106069,'2023-01-01'),(866,26,3,119858,'2023-01-01'),(867,27,3,135440,'2023-01-01'),(868,28,3,153047,'2023-01-01'),(869,29,3,172943,'2023-01-01'),(870,30,3,195425,'2023-01-01'),(871,31,3,289416,'2023-01-01'),(872,32,3,345478,'2023-01-01'),(873,1,4,13329,'2023-01-01'),(874,2,4,14140,'2023-01-01'),(875,3,4,15020,'2023-01-01'),(876,4,4,15948,'2023-01-01'),(877,5,4,16928,'2023-01-01'),(878,6,4,17962,'2023-01-01'),(879,7,4,19053,'2023-01-01'),(880,8,4,20285,'2023-01-01'),(881,9,4,21663,'2023-01-01'),(882,10,4,23762,'2023-01-01'),(883,11,4,27865,'2023-01-01'),(884,12,4,30028,'2023-01-01'),(885,13,4,32269,'2023-01-01'),(886,14,4,34888,'2023-01-01'),(887,15,4,37768,'2023-01-01'),(888,16,4,40935,'2023-01-01'),(889,17,4,44420,'2023-01-01'),(890,18,4,48253,'2023-01-01'),(891,19,4,53610,'2023-01-01'),(892,20,4,59892,'2023-01-01'),(893,21,4,66873,'2023-01-01'),(894,22,4,74762,'2023-01-01'),(895,23,4,83683,'2023-01-01'),(896,24,4,94562,'2023-01-01'),(897,25,4,107800,'2023-01-01'),(898,26,4,121814,'2023-01-01'),(899,27,4,137650,'2023-01-01'),(900,28,4,155545,'2023-01-01'),(901,29,4,175766,'2023-01-01'),(902,30,4,198615,'2023-01-01'),(903,31,4,295069,'2023-01-01'),(904,32,4,352445,'2023-01-01'),(905,1,5,13441,'2023-01-01'),(906,2,5,14248,'2023-01-01'),(907,3,5,15136,'2023-01-01'),(908,4,5,16071,'2023-01-01'),(909,5,5,17057,'2023-01-01'),(910,6,5,18100,'2023-01-01'),(911,7,5,19198,'2023-01-01'),(912,8,5,20468,'2023-01-01'),(913,9,5,21844,'2023-01-01'),(914,10,5,23961,'2023-01-01'),(915,11,5,28161,'2023-01-01'),(916,12,5,30323,'2023-01-01'),(917,13,5,32594,'2023-01-01'),(918,14,5,35244,'2023-01-01'),(919,15,5,38160,'2023-01-01'),(920,16,5,41367,'2023-01-01'),(921,17,5,44895,'2023-01-01'),(922,18,5,48776,'2023-01-01'),(923,19,5,54386,'2023-01-01'),(924,20,5,60769,'2023-01-01'),(925,21,5,67864,'2023-01-01'),(926,22,5,75881,'2023-01-01'),(927,23,5,85049,'2023-01-01'),(928,24,5,96105,'2023-01-01'),(929,25,5,109560,'2023-01-01'),(930,26,5,123803,'2023-01-01'),(931,27,5,139897,'2023-01-01'),(932,28,5,158083,'2023-01-01'),(933,29,5,178634,'2023-01-01'),(934,30,5,201856,'2023-01-01'),(935,31,5,300833,'2023-01-01'),(936,32,5,359553,'2023-01-01'),(937,1,6,13553,'2023-01-01'),(938,2,6,14357,'2023-01-01'),(939,3,6,15251,'2023-01-01'),(940,4,6,16193,'2023-01-01'),(941,5,6,17189,'2023-01-01'),(942,6,6,18238,'2023-01-01'),(943,7,6,19346,'2023-01-01'),(944,8,6,20653,'2023-01-01'),(945,9,6,22026,'2023-01-01'),(946,10,6,24161,'2023-01-01'),(947,11,6,28462,'2023-01-01'),(948,12,6,30622,'2023-01-01'),(949,13,6,32922,'2023-01-01'),(950,14,6,35605,'2023-01-01'),(951,15,6,38557,'2023-01-01'),(952,16,6,41804,'2023-01-01'),(953,17,6,45376,'2023-01-01'),(954,18,6,49305,'2023-01-01'),(955,19,6,55174,'2023-01-01'),(956,20,6,61660,'2023-01-01'),(957,21,6,68870,'2023-01-01'),(958,22,6,77019,'2023-01-01'),(959,23,6,86437,'2023-01-01'),(960,24,6,97674,'2023-01-01'),(961,25,6,111348,'2023-01-01'),(962,26,6,125823,'2023-01-01'),(963,27,6,142180,'2023-01-01'),(964,28,6,160664,'2023-01-01'),(965,29,6,181550,'2023-01-01'),(966,30,6,205151,'2023-01-01'),(967,31,6,306708,'2023-01-01'),(968,32,6,366804,'2023-01-01'),(969,1,7,13666,'2023-01-01'),(970,2,7,14468,'2023-01-01'),(971,3,7,15369,'2023-01-01'),(972,4,7,16318,'2023-01-01'),(973,5,7,17321,'2023-01-01'),(974,6,7,18379,'2023-01-01'),(975,7,7,19494,'2023-01-01'),(976,8,7,20840,'2023-01-01'),(977,9,7,22210,'2023-01-01'),(978,10,7,24363,'2023-01-01'),(979,11,7,28766,'2023-01-01'),(980,12,7,30924,'2023-01-01'),(981,13,7,33254,'2023-01-01'),(982,14,7,35971,'2023-01-01'),(983,15,7,38959,'2023-01-01'),(984,16,7,42247,'2023-01-01'),(985,17,7,45862,'2023-01-01'),(986,18,7,49840,'2023-01-01'),(987,19,7,55976,'2023-01-01'),(988,20,7,62565,'2023-01-01'),(989,21,7,69893,'2023-01-01'),(990,22,7,78175,'2023-01-01'),(991,23,7,87847,'2023-01-01'),(992,24,7,99268,'2023-01-01'),(993,25,7,113166,'2023-01-01'),(994,26,7,127876,'2023-01-01'),(995,27,7,144501,'2023-01-01'),(996,28,7,163286,'2023-01-01'),(997,29,7,184513,'2023-01-01'),(998,30,7,208499,'2023-01-01'),(999,31,7,312699,'2023-01-01'),(1000,32,7,374202,'2023-01-01'),(1001,1,8,13780,'2023-01-01'),(1002,2,8,14578,'2023-01-01'),(1003,3,8,15486,'2023-01-01'),(1004,4,8,16443,'2023-01-01'),(1005,5,8,17453,'2023-01-01'),(1006,6,8,18520,'2023-01-01'),(1007,7,8,19644,'2023-01-01'),(1008,8,8,21029,'2023-01-01'),(1009,9,8,22396,'2023-01-01'),(1010,10,8,24567,'2023-01-01'),(1011,11,8,29075,'2023-01-01'),(1012,12,8,31230,'2023-01-01'),(1013,13,8,33591,'2023-01-01'),(1014,14,8,36341,'2023-01-01'),(1015,15,8,39367,'2023-01-01'),(1016,16,8,42694,'2023-01-01'),(1017,17,8,46355,'2023-01-01'),(1018,18,8,50382,'2023-01-01'),(1019,19,8,56790,'2023-01-01'),(1020,20,8,63485,'2023-01-01'),(1021,21,8,70933,'2023-01-01'),(1022,22,8,79349,'2023-01-01'),(1023,23,8,89281,'2023-01-01'),(1024,24,8,100888,'2023-01-01'),(1025,25,8,115012,'2023-01-01'),(1026,26,8,129964,'2023-01-01'),(1027,27,8,146859,'2023-01-01'),(1028,28,8,165951,'2023-01-01'),(1029,29,8,187525,'2023-01-01'),(1030,30,8,211902,'2023-01-01'),(1031,31,8,318806,'2023-01-01'),(1032,32,8,381748,'2023-01-01');
/*!40000 ALTER TABLE `Salary_Table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Temp_User`
--

DROP TABLE IF EXISTS `Temp_User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Temp_User` (
  `username` varchar(100) NOT NULL,
  `password` varchar(1000) DEFAULT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  `position` varchar(200) DEFAULT NULL,
  `sergs_access_level` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `opms_access_level` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `mpasis_access_level` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `first_signin` tinyint(1) NOT NULL DEFAULT 1,
  `pin` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `User_UN` (`personId`),
  UNIQUE KEY `User_username_IDX` (`username`),
  KEY `Temp_User_FK_1` (`mpasis_access_level`),
  KEY `User_FK_1` (`sergs_access_level`) USING BTREE,
  KEY `User_FK_2` (`opms_access_level`) USING BTREE,
  CONSTRAINT `Temp_User_FK` FOREIGN KEY (`personId`) REFERENCES `Person` (`personId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Temp_User_FK_1` FOREIGN KEY (`mpasis_access_level`) REFERENCES `ENUM_MPASIS_Access_Level` (`index`) ON UPDATE CASCADE,
  CONSTRAINT `User_FK_1_copy` FOREIGN KEY (`sergs_access_level`) REFERENCES `ENUM_SERGS_Access_Level` (`index`) ON UPDATE CASCADE,
  CONSTRAINT `User_FK_2_copy` FOREIGN KEY (`opms_access_level`) REFERENCES `ENUM_OPMS_Access_Level` (`index`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Temp_User`
--

LOCK TABLES `Temp_User` WRITE;
/*!40000 ALTER TABLE `Temp_User` DISABLE KEYS */;
INSERT INTO `Temp_User` VALUES ('GeoTheDuke','fef2cf19ccbb1bea74af3675b0ec78188a5d86042ee34ece9a55f9a16b6d9e9defc1d3439d94254d',1,NULL,4,0,4,0,NULL),('JDC','66e546cf51187026124b6f25d64bcba03654a3a55e90c81bc10c4c771d5c704c53b6b6eda6362ce3',83,NULL,0,1,2,1,NULL),('JSM','66e546cf51187026124b6f25d64bcba03654a3a55e90c81bc10c4c771d5c704c53b6b6eda6362ce3',82,NULL,0,0,3,1,NULL);
/*!40000 ALTER TABLE `Temp_User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `username` varchar(100) NOT NULL,
  `password` varchar(1000) DEFAULT NULL,
  `employeeId` varchar(50) NOT NULL,
  `sergs_access_level` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `opms_access_level` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `mpasis_access_level` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `first_signin` tinyint(1) NOT NULL DEFAULT 1,
  `pin` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `User_username_IDX` (`username`) USING BTREE,
  UNIQUE KEY `User_UN` (`employeeId`),
  KEY `User_FK_1` (`sergs_access_level`),
  KEY `User_FK_2` (`opms_access_level`),
  KEY `User_FK_3` (`mpasis_access_level`),
  CONSTRAINT `User_FK` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User_FK_1` FOREIGN KEY (`sergs_access_level`) REFERENCES `ENUM_SERGS_Access_Level` (`index`) ON UPDATE CASCADE,
  CONSTRAINT `User_FK_2` FOREIGN KEY (`opms_access_level`) REFERENCES `ENUM_OPMS_Access_Level` (`index`) ON UPDATE CASCADE,
  CONSTRAINT `User_FK_3` FOREIGN KEY (`mpasis_access_level`) REFERENCES `ENUM_MPASIS_Access_Level` (`index`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('geovaniduqueza1939@outlook.com','66e546cf51187026124b6f25d64bcba03654a3a55e90c81bc10c4c771d5c704c53b6b6eda6362ce3','A1234567',1,1,1,1,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Workplace`
--

DROP TABLE IF EXISTS `Workplace`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Workplace` (
  `workplaceId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `institutionId` bigint(20) unsigned NOT NULL,
  `addressId` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`workplaceId`),
  UNIQUE KEY `Workplace_id_IDX` (`workplaceId`) USING BTREE,
  KEY `Workplace_FK_1` (`addressId`),
  KEY `Workplace_FK` (`institutionId`),
  CONSTRAINT `Workplace_FK` FOREIGN KEY (`institutionId`) REFERENCES `Institution` (`institutionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Workplace_FK_1` FOREIGN KEY (`addressId`) REFERENCES `Address` (`addressId`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Workplace`
--

LOCK TABLES `Workplace` WRITE;
/*!40000 ALTER TABLE `Workplace` DISABLE KEYS */;
INSERT INTO `Workplace` VALUES (1,3,1),(2,4,NULL),(3,5,NULL);
/*!40000 ALTER TABLE `Workplace` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-26 12:45:17
