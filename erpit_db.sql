-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2026 at 07:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `erpit_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `asset`
--

CREATE TABLE `asset` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `serialNumber` varchar(191) NOT NULL,
  `status` enum('AVAILABLE','IN_USE','MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `assignedToId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_item`
--

CREATE TABLE `inventory_item` (
  `item_id` varchar(191) NOT NULL,
  `item_name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `brand` varchar(191) DEFAULT NULL,
  `unit` varchar(191) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `min_quantity` int(11) NOT NULL DEFAULT 0,
  `location` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inventory_item`
--

INSERT INTO `inventory_item` (`item_id`, `item_name`, `category`, `brand`, `unit`, `quantity`, `min_quantity`, `location`, `createdAt`, `updatedAt`) VALUES
('504b8000-8d06-417d-ade5-ebacd2edc174', 'Ram', '1', '', 'pcs', 0, 1, '', '2026-03-23 03:43:03.825', '2026-03-23 03:43:03.825');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transaction`
--

CREATE TABLE `inventory_transaction` (
  `id` varchar(191) NOT NULL,
  `inventoryItemId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `requestedBy` varchar(191) DEFAULT NULL,
  `relatedAssetId` varchar(191) DEFAULT NULL,
  `relatedTicketId` varchar(191) DEFAULT NULL,
  `createdById` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH') NOT NULL DEFAULT 'LOW',
  `status` enum('OPEN','IN_PROGRESS','RESOLVED') NOT NULL DEFAULT 'OPEN',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `createdById` varchar(191) NOT NULL,
  `assignedToId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('ADMIN','IT_SUPPORT','USER') NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('54b59c69-26a8-479f-80c9-f409a72e9e14', 'Test User', 'testuser@example.com', '$2b$10$XxceMG7KizCs5baApYRf4eOnXXQSClcR2CjoxNswTALKWXxo64E3m', 'USER', '2026-03-22 10:01:19.580', '2026-03-22 10:01:19.505'),
('e110669e-f893-4f37-95e4-ed6b2433827f', 'IT_Gw', 'piyaphan1584@gmail.com', '$2b$10$UIAUfpbymH533Yq1s6bbjOTI7n/taGAKKjyoQTi6LZQwLoo12NwsW', 'ADMIN', '2026-03-22 10:03:35.243', '2026-03-22 10:03:35.242');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asset`
--
ALTER TABLE `asset`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Asset_serialNumber_key` (`serialNumber`),
  ADD KEY `Asset_assignedToId_fkey` (`assignedToId`);

--
-- Indexes for table `inventory_item`
--
ALTER TABLE `inventory_item`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `inventory_transaction`
--
ALTER TABLE `inventory_transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_transaction_inventoryItemId_idx` (`inventoryItemId`),
  ADD KEY `inventory_transaction_createdById_idx` (`createdById`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Ticket_createdById_fkey` (`createdById`),
  ADD KEY `Ticket_assignedToId_fkey` (`assignedToId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `asset`
--
ALTER TABLE `asset`
  ADD CONSTRAINT `Asset_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `Ticket_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Ticket_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
