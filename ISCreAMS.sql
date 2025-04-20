-- MariaDB dump 10.19  Distrib 10.6.12-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: ISCreAMS
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
-- Table structure for table `DB_Table`
--

DROP TABLE IF EXISTS `DB_Table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DB_Table` (
  `db_tableId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `table_name` varchar(100) NOT NULL,
  `db_name` varchar(100) NOT NULL,
  `ddl_path` longtext DEFAULT NULL,
  `isCreated` tinyint(1) NOT NULL DEFAULT 0,
  `required_tableId` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`db_tableId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DB_Table`
--

LOCK TABLES `DB_Table` WRITE;
/*!40000 ALTER TABLE `DB_Table` DISABLE KEYS */;
/*!40000 ALTER TABLE `DB_Table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IS_DB`
--

DROP TABLE IF EXISTS `IS_DB`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `IS_DB` (
  `is_dbId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `information_systemId` int(10) unsigned NOT NULL DEFAULT 1,
  `db_tableId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`is_dbId`),
  KEY `information_systemId` (`information_systemId`),
  KEY `IS_DB_FK` (`db_tableId`),
  CONSTRAINT `IS_DB_FK` FOREIGN KEY (`db_tableId`) REFERENCES `DB_Table` (`db_tableId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `IS_DB_ibfk_1` FOREIGN KEY (`information_systemId`) REFERENCES `Information_System` (`information_systemId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IS_DB`
--

LOCK TABLES `IS_DB` WRITE;
/*!40000 ALTER TABLE `IS_DB` DISABLE KEYS */;
/*!40000 ALTER TABLE `IS_DB` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Information_System`
--

DROP TABLE IF EXISTS `Information_System`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Information_System` (
  `information_systemId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `information_system_name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  `isInternal` tinyint(1) NOT NULL DEFAULT 1,
  `type` enum('full','frontend','backend') NOT NULL DEFAULT 'full',
  `status` enum('active','in-progress','disabled') NOT NULL DEFAULT 'in-progress',
  `acronym` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`information_systemId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Information_System`
--

LOCK TABLES `Information_System` WRITE;
/*!40000 ALTER TABLE `Information_System` DISABLE KEYS */;
INSERT INTO `Information_System` VALUES (1,'Information System Creation and Management System','A system that assists in creating and managing other CRUD systems',1,'full','in-progress','ISCreAMS'),(2,'Service Record Generation System','An information system that affords onsite or remote services related to the users\' Service Record',0,'full','in-progress','SeRGS'),(3,'Online Performance Management System','A management information system that allows the online recording, processing, and implementation of performance management objectives and scores of all involved employess',0,'full','in-progress','OPMS'),(4,'Merit Promotion and Selection Information System','An information system that gives users tools to simplify the recording and evaluation of job applicants\' qualifications and ranking',1,'full','in-progress','MPaSIS');
/*!40000 ALTER TABLE `Information_System` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Nav`
--

DROP TABLE IF EXISTS `Nav`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Nav` (
  `nav_itemId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nav_text` longtext NOT NULL,
  `url` mediumtext DEFAULT NULL,
  `type` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `level` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `nav_index` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `information_systemId` int(10) unsigned NOT NULL DEFAULT 1,
  `parent_nav` int(10) unsigned DEFAULT 0,
  `nav_html_id` varchar(100) DEFAULT NULL,
  `icon_tag` varchar(100) DEFAULT NULL,
  `access_level` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT 'Will depend on each IS''s access levels',
  PRIMARY KEY (`nav_itemId`),
  KEY `information_systemId` (`information_systemId`),
  KEY `Nav_FK` (`parent_nav`),
  CONSTRAINT `Nav_FK` FOREIGN KEY (`parent_nav`) REFERENCES `Nav` (`nav_itemId`) ON UPDATE CASCADE,
  CONSTRAINT `Nav_ibfk_1` FOREIGN KEY (`information_systemId`) REFERENCES `Information_System` (`information_systemId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Nav`
--

LOCK TABLES `Nav` WRITE;
/*!40000 ALTER TABLE `Nav` DISABLE KEYS */;
INSERT INTO `Nav` VALUES (0,'','',0,0,0,1,0,'','',0),(1,'Dashboard','/mpasis/',1,0,2,4,0,'dashboard','<span class=\"material-icons-round\">dashboard</span>',1),(2,'Applications','/mpasis/applications/',1,0,3,4,0,'applications','<span class=\"material-icons-round\">contact_page</span>',1),(3,'Data Entry','/mpasis/applications/encoding/',1,1,1,4,2,'applicant-data-entry',NULL,1),(4,'Score Sheet','/mpasis/applications/scoresheet/',1,1,2,4,2,'scoresheet',NULL,1),(5,'Upload','/mpasis/applications/upload/',1,1,3,4,2,'applicants-upload',NULL,2),(6,'Evaluation','/mpasis/evaluation/',1,0,4,4,0,'evaluation','<span class=\"material-icons-round\">assessment</span>',1),(7,'Score Sheet','/mpasis/evaluation/scoresheet/',1,1,1,4,6,'scoresheet',NULL,1),(8,'Initial Evaluation Result','/mpasis/evaluation/ier/',1,1,2,4,6,'ier',NULL,2),(9,'Individual Evaluation Sheet','/mpasis/evaluation/ies/',1,1,3,4,6,'ies',NULL,2),(10,'Comparative Assessment Result','/mpasis/evaluation/car/',1,1,4,4,6,'car',NULL,2),(11,'Comparative Assessment Result (Teacher I)','/mpasis/evaluation/car-t1/',1,1,5,4,6,'car-t1',NULL,2),(12,'Comparative Assessment Result (Higher Teaching Positions)','/mpasis/evaluation/car-tx/',1,1,6,4,6,'car-tx',NULL,2),(13,'Comparative Assessment Result-Registry of Qualified Applicants','/mpasis/evaluation/carrqa/',1,1,7,4,6,'car-rqa',NULL,2),(14,'Comparative Assessment Result-Registry of Qualified Applicants (Higher Teaching Positions)','/mpasis/evaluation/carrqa-tx/',1,1,8,4,6,'car-rqa-tx',NULL,2),(15,'Job Openings','/mpasis/jobs/',1,0,5,4,0,'job','<span class=\"material-icons-round\">work</span>',1),(16,'Data Entry','/mpasis/jobs/encoding/',1,1,1,4,15,'job-data-entry',NULL,1),(17,'Search','/mpasis/jobs/search/',1,1,2,4,15,'job-data-search',NULL,1),(18, 'Upload','/mpasis/jobs/upload/',1,1,3,4,15,'job-data-upload',NULL,2),(19,'Account','/mpasis/account/',1,0,6,4,0,'account','<span class=\"material-icons-round\">account_circle</span>',1),(20,'My Account','/mpasis/account/edit/',1,1,1,4,19,'my-account',NULL,1),(21,'Other Account','/mpasis/account/edit_other/',1,1,2,4,19,'other-account',NULL,2),(22,'Sign Out','?a=logout',1,1,3,4,19,'signout',NULL,0),(23,'Settings','/mpasis/settings/',1,0,7,4,0,'settings','<span class=\"material-icons-round\">settings</span>',1),(24,'SDO Services Home','/',1,0,1,4,0,'sdo-home','<span class=\"material-icons-round\">home</span>',0),(25,'SDO Services Home','/',1,0,1,2,0,'sdo-home','<span class=\"material-icons-round\">home</span>',0),(26,'Dashboard','/sergs/',1,0,2,2,0,'dashboard','<span class=\"material-icons-round\">dashboard</span>',1),(27,'Service Record','/sergs/sr/',1,0,3,2,0,'sr','<span class=\"material-icons-round\">pageview</span>',1),(28,'My Service Record','/sergs/sr/my_service_record/',1,1,1,2,27,'my-sr',NULL,1),(29,'Other Service Record','/sergs/sr/other/',1,1,2,2,27,'other-sr',NULL,2),(30,'Service Record Data Entry Form','/sergs/sr/encoding/',1,1,3,2,27,'sr-encoding',NULL,2),(31,'Requests','/sergs/requests/',1,0,4,2,0,'requests','<span class=\"material-icons-round\">task</span>',1),(32,'Request List','/sergs/requests/request_list/',1,1,1,2,31,'request-list',NULL,1),(33,'New Request','/sergs/requests/new_request/',1,1,2,2,31,'new-request',NULL,1),(34,'Archived Requests','/sergs/requests/archive/',1,1,3,2,31,'archived',NULL,3),(35,'Search','/sergs/requests/search/',1,1,4,2,31,'search-requests',NULL,2),(36,'System Logs','/sergs/system_logs/',1,0,5,2,0,'system-logs','<span class=\"material-icons-round\">fact_check</span>',2),(37,'Account','/sergs/account/',1,0,6,2,0,'account','<span class=\"material-icons-round\">account_circle</span>',1),(38,'My Account','/sergs/account/edit/',1,1,1,2,37,'my-account',NULL,1),(39,'Other Account','/sergs/account/edit_other/',1,1,2,2,37,'other-account',NULL,3),(40,'Sign Out','?a=logout',1,1,3,2,37,'signout',NULL,0),(41,'Settings','/sergs/settings/',1,0,7,2,0,'settings','<span class=\"material-icons-round\">settings</span>',1);
/*!40000 ALTER TABLE `Nav` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Page`
--

DROP TABLE IF EXISTS `Page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Page` (
  `pageId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `page_name` varchar(255) NOT NULL DEFAULT 'NO NAME',
  `page_path` longtext NOT NULL DEFAULT '/',
  `isDynamic` tinyint(1) NOT NULL DEFAULT 0,
  `information_systemId` int(10) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`pageId`),
  KEY `information_systemId` (`information_systemId`),
  CONSTRAINT `Page_ibfk_1` FOREIGN KEY (`information_systemId`) REFERENCES `Information_System` (`information_systemId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Page`
--

LOCK TABLES `Page` WRITE;
/*!40000 ALTER TABLE `Page` DISABLE KEYS */;
/*!40000 ALTER TABLE `Page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Setting`
--

DROP TABLE IF EXISTS `Setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Setting` (
  `settingId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `information_systemId` int(10) unsigned NOT NULL DEFAULT 1,
  `setting_name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  `type` tinyint(4) NOT NULL DEFAULT 0,
  `text_value` longtext DEFAULT NULL,
  `int_value` bigint(20) DEFAULT NULL,
  `double_value` double DEFAULT NULL,
  `datetime_value` datetime DEFAULT NULL,
  `timestamp_value` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`settingId`),
  KEY `information_systemId` (`information_systemId`),
  CONSTRAINT `Setting_ibfk_1` FOREIGN KEY (`information_systemId`) REFERENCES `Information_System` (`information_systemId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Setting`
--

LOCK TABLES `Setting` WRITE;
/*!40000 ALTER TABLE `Setting` DISABLE KEYS */;
/*!40000 ALTER TABLE `Setting` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-26 12:45:14
