CREATE DATABASE `SDOStoTomas`; /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

-- SDOStoTomas.ENUM_Emp_Appointment_Status definition

CREATE TABLE `SDOStoTomas`.`ENUM_Emp_Appointment_Status` (
  `index` tinyint(3) unsigned NOT NULL,
  `appointment_status` varchar(100) NOT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `Emp_Appointent_Status_index_IDX` (`index`) USING BTREE,
  UNIQUE KEY `ENUM_Emp_Appointment_Status_UN` (`appointment_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.ENUM_Location_Type definition

CREATE TABLE `SDOStoTomas`.`ENUM_Location_Type` (
  `index` tinyint(3) unsigned NOT NULL,
  `location_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `Location_Type_index_IDX` (`index`) USING BTREE,
  UNIQUE KEY `Location_Type_UN` (`location_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.ENUM_SERGES_Access_Level definition

CREATE TABLE `SDOStoTomas`.`ENUM_SERGES_Access_Level` (
  `index` tinyint(3) unsigned NOT NULL,
  `level_name` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `SERGES_Access_Level_index_IDX` (`index`) USING BTREE,
  UNIQUE KEY `SERGES_Access_Level_UN` (`level_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.Address definition

CREATE TABLE `SDOStoTomas`.`Address` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `text` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Address_id_IDX` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.Location definition

CREATE TABLE `SDOStoTomas`.`Location` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location_type` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `latitude` smallint(6) DEFAULT NULL,
  `longitude` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Location_id_IDX` (`id`) USING BTREE,
  KEY `Location_FK` (`location_type`),
  CONSTRAINT `Location_FK` FOREIGN KEY (`location_type`) REFERENCES `ENUM_Location_Type` (`index`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.Broad_Location definition

CREATE TABLE `SDOStoTomas`.`Broad_Location` (
  `index` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `locationId` bigint(20) unsigned NOT NULL,
  `broad_locationId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `Broad_Location_index_IDX` (`index`) USING BTREE,
  KEY `Broad_Location_FK` (`locationId`),
  KEY `Broad_Location_FK_1` (`broad_locationId`),
  CONSTRAINT `Broad_Location_FK` FOREIGN KEY (`locationId`) REFERENCES `Location` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Broad_Location_FK_1` FOREIGN KEY (`broad_locationId`) REFERENCES `Location` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.SET_Address_Location definition

CREATE TABLE `SDOStoTomas`.`SET_Address_Location` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `address` bigint(20) unsigned NOT NULL,
  `location` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Address_Location_id_IDX` (`id`) USING BTREE,
  KEY `SET_Address_Location_FK` (`address`),
  KEY `SET_Address_Location_FK_1` (`location`),
  CONSTRAINT `SET_Address_Location_FK` FOREIGN KEY (`address`) REFERENCES `Address` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SET_Address_Location_FK_1` FOREIGN KEY (`location`) REFERENCES `Location` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.Date_Range definition

CREATE TABLE `SDOStoTomas`.`Date_Range` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `start` date NOT NULL,
  `end` date DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Date_Range_id_IDX` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.Emp_Appointment definition

CREATE TABLE `SDOStoTomas`.`Emp_Appointment` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `plantilla_item` varchar(100) NOT NULL,
  `designation` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Emp_Appointment_id_IDX` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.Institution definition

CREATE TABLE `SDOStoTomas`.`Institution` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `umbrella_institution` bigint(20) unsigned DEFAULT NULL,
  `address` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Institution_Column1_IDX` (`id`) USING BTREE,
  KEY `Institution_FK_1` (`umbrella_institution`),
  KEY `Institution_FK` (`address`),
  CONSTRAINT `Institution_FK` FOREIGN KEY (`address`) REFERENCES `Address` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Institution_FK_1` FOREIGN KEY (`umbrella_institution`) REFERENCES `Institution` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.Workplace definition

CREATE TABLE `SDOStoTomas`.`Workplace` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `institution` bigint(20) unsigned DEFAULT NULL,
  `address` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Workplace_id_IDX` (`id`) USING BTREE,
  KEY `Workplace_FK` (`institution`),
  KEY `Workplace_FK_1` (`address`),
  CONSTRAINT `Workplace_FK` FOREIGN KEY (`institution`) REFERENCES `Institution` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Workplace_FK_1` FOREIGN KEY (`address`) REFERENCES `Address` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.Person definition

CREATE TABLE `SDOStoTomas`.`Person` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `given_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `family_name` varchar(100) DEFAULT NULL,
  `spouse_name` varchar(20) DEFAULT NULL,
  `ext_name` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` bigint(20) unsigned DEFAULT NULL,
  `sex` enum('Male','Female') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Person_id_IDX` (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.Employee definition

CREATE TABLE `SDOStoTomas`.`Employee` (
  `employeeId` varchar(30) NOT NULL,
  `personId` bigint(20) unsigned NOT NULL,
  `is_temporary_empno` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`employeeId`),
  UNIQUE KEY `Employee_employeeId_IDX` (`employeeId`) USING BTREE,
  UNIQUE KEY `Employee_UN` (`personId`),
  CONSTRAINT `Employee_FK` FOREIGN KEY (`personId`) REFERENCES `Person` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.`User` definition

CREATE TABLE `SDOStoTomas`.`User` (
  `username` varchar(100) NOT NULL,
  `password` varchar(1000) DEFAULT NULL,
  `employeeId` varchar(30) NOT NULL,
  `sergs_access_level` tinyint(3) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`username`),
  UNIQUE KEY `User_username_IDX` (`username`) USING BTREE,
  UNIQUE KEY `User_UN` (`employeeId`),
  KEY `User_FK_1` (`sergs_access_level`),
  CONSTRAINT `User_FK` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User_FK_1` FOREIGN KEY (`sergs_access_level`) REFERENCES `ENUM_SERGES_Access_Level` (`index`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.`Leave` definition

CREATE TABLE `SDOStoTomas`.`Leave` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date_range` bigint(20) unsigned NOT NULL,
  `dates_excluded` bigint(20) unsigned DEFAULT NULL,
  `dates_with_pay` bigint(20) unsigned DEFAULT NULL,
  `employeeId` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Leave_id_IDX` (`id`) USING BTREE,
  KEY `Leave_FK` (`date_range`),
  KEY `Leave_FK_1` (`dates_excluded`),
  KEY `Leave_FK_2` (`dates_with_pay`),
  KEY `Leave_FK_3` (`employeeId`),
  CONSTRAINT `Leave_FK` FOREIGN KEY (`date_range`) REFERENCES `Date_Range` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Leave_FK_1` FOREIGN KEY (`dates_excluded`) REFERENCES `Date_Range` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Leave_FK_2` FOREIGN KEY (`dates_with_pay`) REFERENCES `Date_Range` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Leave_FK_3` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- SDOStoTomas.Emp_Term_of_Service definition

CREATE TABLE `SDOStoTomas`.`Emp_Term_of_Service` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date_range` bigint(20) unsigned NOT NULL,
  `appointment` bigint(20) unsigned NOT NULL,
  `workplace` bigint(20) unsigned DEFAULT NULL,
  `status` tinyint(3) unsigned NOT NULL,
  `salary` float DEFAULT NULL,
  `branch` varchar(100) DEFAULT 'NM',
  `employeeId` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Emp_TermsOfService_id_IDX` (`id`) USING BTREE,
  KEY `Emp_Term_of_Service_FK` (`date_range`),
  KEY `Emp_Term_of_Service_FK_4` (`employeeId`),
  KEY `Emp_Term_of_Service_FK_1` (`appointment`),
  KEY `Emp_Term_of_Service_FK_2` (`workplace`),
  KEY `Emp_Term_of_Service_FK_3` (`status`),
  CONSTRAINT `Emp_Term_of_Service_FK` FOREIGN KEY (`date_range`) REFERENCES `Date_Range` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Emp_Term_of_Service_FK_1` FOREIGN KEY (`appointment`) REFERENCES `Emp_Appointment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Emp_Term_of_Service_FK_2` FOREIGN KEY (`workplace`) REFERENCES `Workplace` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Emp_Term_of_Service_FK_3` FOREIGN KEY (`status`) REFERENCES `ENUM_Emp_Appointment_Status` (`index`) ON UPDATE CASCADE,
  CONSTRAINT `Emp_Term_of_Service_FK_4` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

