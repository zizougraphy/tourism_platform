-- MySQL dump 10.13  Distrib 8.4.8, for Linux (x86_64)
--
-- Host: localhost    Database: tourism_platform
-- ------------------------------------------------------
-- Server version	8.4.8

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

-- ============================================================
-- TABLE: users
-- ============================================================

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('tourist','service_provider','admin') NOT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
  -- Tourists (id 1-2)
  (1,'Ali','ali@gmail.com','$2b$12$.FZnEHJ/QzNuImd4MlwVnuiysVA2nYLBjY0XEwyLnIs8pOD8ZFD3S','0550000000','tourist',NULL,1,'2026-04-08 13:02:17'),
  (2,'Zizou Seghir Bouali','zizoubouali92@gmail.com','$2b$12$UY4.KvDov6sx5J8rbL9TNuPdjzCNAZSVmnidJGYsiUZsbOK0hunZ6','+213 554 528 386','tourist',NULL,1,'2026-04-20 03:33:21'),
  -- Service Providers (id 3-6)
  (3,'Royal Hotels Group','contact@royalhotels.com','$2b$12$.FZnEHJ/QzNuImd4MlwVnuiysVA2nYLBjY0XEwyLnIs8pOD8ZFD3S','+213 555 111 222','service_provider',NULL,1,'2026-04-25 10:00:00'),
  (4,'Gourmet Dining Co','info@gourmet.dz','$2b$12$.FZnEHJ/QzNuImd4MlwVnuiysVA2nYLBjY0XEwyLnIs8pOD8ZFD3S','+213 555 333 444','service_provider',NULL,1,'2026-04-25 10:00:00'),
  (5,'Adventure Tours DZ','tours@adventure.dz','$2b$12$.FZnEHJ/QzNuImd4MlwVnuiysVA2nYLBjY0XEwyLnIs8pOD8ZFD3S','+213 555 555 666','service_provider',NULL,1,'2026-04-25 10:00:00'),
  (6,'Coastal Transport','fleet@coastal.dz','$2b$12$.FZnEHJ/QzNuImd4MlwVnuiysVA2nYLBjY0XEwyLnIs8pOD8ZFD3S','+213 555 777 888','service_provider',NULL,1,'2026-04-25 10:00:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- TABLE: cities
-- ============================================================

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `description` text,
  `weather` varchar(100) DEFAULT NULL,
  `images` text,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES
  (1,'Constantine','Algeria','Constantine, the City of Bridges, is a stunning dramatic destination perched on a plateau with deep gorges and suspended bridges.','Semi-arid, cool winters','https://images.unsplash.com/photo-1596468138838-9e56f599992f?q=80&w=2070',36.365,6.6147),
  (2,'Algiers','Algeria','Algiers, the capital, blends Mediterranean beauty with Ottoman and French architectural heritage along its iconic white-washed Casbah.','Mediterranean, mild','https://images.unsplash.com/photo-1605147544388-75b8e9069695?q=80&w=2070',36.7538,3.0588),
  (3,'Oran','Algeria','Oran, the Radiant City, is famous for its vibrant culture, raï music scene, and stunning coastal views from Fort Santa Cruz.','Hot summers, mild winters','https://images.unsplash.com/photo-1589330273594-fade1ee91647?q=80&w=2070',35.6969,-0.6331),
  (4,'Annaba','Algeria','Annaba, known for its pristine beaches and the historic Hippo Regius ruins where Saint Augustine once lived.','Mediterranean, warm','https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=2070',36.9,7.7667),
  (5,'Tipaza','Algeria','A coastal treasure featuring Roman ruins and crystal clear Mediterranean waters, a UNESCO World Heritage Site.','Warm & Sunny','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2070',36.5899,2.4483),
  (6,'Tlemcen','Algeria','The City of Art and History, known for its Andalusian architecture, the El-Mechouar Palace, and the stunning Lala Setti waterfalls.','Mild & Pleasant','https://images.unsplash.com/photo-1590424753062-3251f1c89359?q=80&w=2070',34.8828,-1.3167),
  (7,'Ghardaia','Algeria','A UNESCO World Heritage site in the M''zab Valley with unique traditional architecture and a vibrant local market culture.','Dry & Sunny','https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?q=80&w=2070',32.4903,3.6736),
  (8,'Bejaia','Algeria','A coastal city where the mountains meet the sea at the stunning Gouraya National Park, offering hiking, beaches, and Berber culture.','Mediterranean','https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=2070',36.7509,5.0567);
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- TABLE: services
-- ============================================================

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `images` text,
  `price` float DEFAULT NULL,
  `rating` float DEFAULT '0',
  `description` text,
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `provider_id` int NOT NULL,
  `city_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `provider_id` (`provider_id`),
  KEY `city_id` (`city_id`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `services_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES
  -- Hotels  (provider_id = 3  →  Royal Hotels Group)
  (1,'The Royal Cliff','hotel','Gorges du Rhumel, Constantine','https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',150,4.8,'Luxury hotel perched on the edge of the Rhumel canyon with breathtaking bridge views. Enjoy world-class amenities including an infinity pool, spa, and rooftop dining.',1,'2026-04-25 12:00:00',3,1),
  (2,'Mediterranean Pearl','hotel','Sidi Fredj, Algiers','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070',120,4.5,'Premium resort with private beach access, lush gardens, and authentic Algerian hospitality steps from the Mediterranean Sea.',1,'2026-04-25 12:00:00',3,2),
  (3,'Grand Oran Palace','hotel','Front de Mer, Oran','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070',180,4.9,'Historic luxury hotel in the heart of Oran overlooking the Mediterranean. Art-deco architecture meets modern comfort.',1,'2026-04-25 12:00:00',3,3),
  (4,'Tipaza Beach Resort','hotel','Coastal Road, Tipaza','https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070',140,4.6,'Modern eco-resort located just steps away from the Roman ruins with stunning sea views and locally sourced cuisine.',1,'2026-04-25 12:00:00',3,5),

  -- Restaurants  (provider_id = 4  →  Gourmet Dining Co)
  (5,'Le Gourmet Algiers','restaurant','Hydra, Algiers','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070',45,4.7,'Exquisite fine dining experience blending traditional Algerian flavors with modern French techniques in an elegant setting.',1,'2026-04-25 12:00:00',4,2),
  (6,'The Bridge View','restaurant','Old Town, Constantine','https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070',30,4.4,'Authentic Constantine cuisine — couscous, chakhchoukha, and fresh pastries — served with the best view of Sidi M''Cid Bridge.',1,'2026-04-25 12:00:00',4,1),
  (7,'Sunset Terrace','restaurant','Santa Cruz, Oran','https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2070',35,4.6,'Dine above the clouds with panoramic views of Oran harbor. Seafood specialities and local wines in a magical rooftop setting.',1,'2026-04-25 12:00:00',4,3),

  -- Guided Tours  (provider_id = 5  →  Adventure Tours DZ)
  (8,'Sahara Adventure','guide','M''zab Valley, Ghardaia','https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2070',80,4.9,'Expert-led 3-day tour through the ancient pentapolis and deep into the Sahara dunes. Includes camel trekking and desert camping.',1,'2026-04-25 12:00:00',5,7),
  (9,'Roman Legacy Tour','guide','Archeological Site, Tipaza','https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=2070',25,4.8,'Professional historical tour exploring the sprawling Roman ruins of Tipaza — the Royal Mausoleum, amphitheater, and basilica.',1,'2026-04-25 12:00:00',5,5),

  -- Activities  (provider_id = 5 & 6)
  (10,'Gouraya Hiking Exp.','activity','National Park, Bejaia','https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070',20,4.7,'Guided full-day trek to the peak of Yemma Gouraya with stunning coastal panoramas and wild Barbary macaque sightings.',1,'2026-04-25 12:00:00',5,8),
  (11,'VIP Airport Shuttle','transport','Houari Boumediene, Algiers','https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070',50,4.9,'Private luxury transport from the airport to any location in Algiers. Mercedes fleet, bilingual drivers, 24/7 availability.',1,'2026-04-25 12:00:00',6,2),
  (12,'Coastal Boat Trip','activity','Marina, Annaba','https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2070',60,4.5,'Half-day boat cruise exploring the hidden coves, turquoise lagoons, and white-sand beaches along the Annaba coastline.',1,'2026-04-25 12:00:00',6,4);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- TABLE: bookings
-- ============================================================

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `total_price` float DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `tourist_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tourist_id` (`tourist_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`tourist_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- TABLE: reviews
-- ============================================================

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `comment` text,
  `date` date NOT NULL,
  `tourist_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tourist_id` (`tourist_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`tourist_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES
  -- Reviews for The Royal Cliff (service 1)
  (1,5,'An absolute gem! The view from the cliff is unmatched. Woke up to the sound of the gorge every morning.','2026-04-27',1,1),
  (2,4,'Great service and very comfortable rooms. The staff went above and beyond. Highly recommend.','2026-04-24',2,1),
  -- Reviews for Mediterranean Pearl (service 2)
  (3,5,'The beach was pristine and the food was phenomenal. A perfect Mediterranean getaway.','2026-04-26',1,2),
  -- Reviews for Grand Oran Palace (service 3)
  (4,5,'Art-deco charm meets five-star luxury. The rooftop bar has the best sunset in Algeria.','2026-04-25',2,3),
  -- Reviews for Tipaza Beach Resort (service 4)
  (5,5,'Tipaza is beautiful and this hotel is the perfect base to explore the Roman ruins nearby.','2026-04-25',2,4),
  -- Reviews for Le Gourmet Algiers (service 5)
  (6,5,'The food was incredible, the best couscous I have ever had. The lamb tagine was to die for.','2026-04-28',1,5),
  -- Reviews for Sahara Adventure (service 8)
  (7,5,'Ghardaia is a magical place and our guide made it even better. Desert camping under the stars!','2026-04-19',2,8),
  (8,4,'A once-in-a-lifetime experience. The camel trek was unforgettable.','2026-04-20',1,8),
  -- Reviews for VIP Airport Shuttle (service 11)
  (9,4,'Very professional driver, arrived on time. Clean Mercedes, smooth ride to the hotel.','2026-04-26',1,11),
  -- Reviews for Coastal Boat Trip (service 12)
  (10,5,'Crystal clear water and hidden beaches. The captain knew all the best spots!','2026-04-23',2,12);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- TABLE: favorites
-- ============================================================

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_saved` date NOT NULL,
  `tourist_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tourist_id` (`tourist_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`tourist_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- TABLE: messages
-- ============================================================

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `sent_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- TABLE: notifications
-- ============================================================

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- TABLE: promotions
-- ============================================================

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `discount_percent` float NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `promotions_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- TABLE: availability
-- ============================================================

DROP TABLE IF EXISTS `availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `availability` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `total_slots` int NOT NULL,
  `booked_slots` int DEFAULT '0',
  `service_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `availability_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `availability` WRITE;
/*!40000 ALTER TABLE `availability` DISABLE KEYS */;
/*!40000 ALTER TABLE `availability` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================
-- Restore settings
-- ============================================================

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-29 23:45:00
