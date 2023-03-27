-- phpMyAdmin SQL Dump
-- version 4.6.6deb5ubuntu0.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 22, 2021 at 06:53 PM
-- Server version: 5.7.33-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wat_sourcing`
--

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_label` varchar(255) NOT NULL,
  `role_description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `role_activities`
--

CREATE TABLE `role_activities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `activity` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `role_competencies`
--

CREATE TABLE `role_competencies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `competency` text NOT NULL,
  `competency_area` text,
  `competency_level` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_designation` varchar(255) NOT NULL,
  `user_work_email` varchar(255) NOT NULL,
  `reporting_officer_name` varchar(255) NOT NULL,
  `reporting_officer_designation` varchar(255) NOT NULL,
  `reporting_officer_department` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `wat_admin`
--

CREATE TABLE `wat_admin` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_email` varchar(110) NOT NULL,
  `user_password` char(60) NOT NULL,
  `role` ENUM('superAdmin', 'admin', 'L1', 'L2') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_table_relation_1` (`user_id`);

--
-- Indexes for table `role_activities`
--
ALTER TABLE `role_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roles_table_relation_1` (`role_id`);

--
-- Indexes for table `role_competencies`
--
ALTER TABLE `role_competencies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roles_table_relation_2` (`role_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wat_admin`
--
ALTER TABLE `wat_admin`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `role_activities`
--
ALTER TABLE `role_activities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `role_competencies`
--
ALTER TABLE `role_competencies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `wat_admin`
--
ALTER TABLE `wat_admin`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `users_table_relation_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `role_activities`
--
ALTER TABLE `role_activities`
  ADD CONSTRAINT `roles_table_relation_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `role_competencies`
--
ALTER TABLE `role_competencies`
  ADD CONSTRAINT `roles_table_relation_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

--
-- Constraints for table wat_admin
--

ALTER TABLE `wat_admin` 
  ADD CONSTRAINT `FK_departmentId` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`);

--
-- Alter statements for table wat_admin
--

ALTER TABLE `wat_admin` ADD COLUMN role ENUM(`superAdmin`, `admin`, `L1`, `L2`) NOT NULL;

ALTER TABLE `wat_admin` ADD CONSTRAINT `FK_departmentId` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`);

ALTER TABLE `wat_admin` ADD `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `wat_admin` ADD `last_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `wat_admin` DROP COLUMN `roles`;

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` ( `id` int auto_increment primary key, `name` varchar(255) NOT NULL, `ministry` varchar(255) NULL);

--
-- Indexes for table `departments`
--

CREATE INDEX `idx_department` ON `departments` (`name`);

--
-- ALTER statements for table departments
--

ALTER TABLE `departments` ADD `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `departments` ADD `last_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;