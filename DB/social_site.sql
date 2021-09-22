-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Sep 10, 2021 at 06:15 PM
-- Server version: 5.7.32
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `social_site`
--

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `ID` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `passcode` text NOT NULL,
  `usertype` enum('admin','user') NOT NULL,
  `status` enum('active','deleted') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`ID`, `username`, `passcode`, `usertype`, `status`) VALUES
(1, 'admin@gmail.com', 'admin', 'admin', 'active'),
(2, 'abel@gmail.com', 'abel1234', 'user', 'active'),
(3, 'test@gmail.com', 'test1234', 'user', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `user_id` int(20) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `Last_name` varchar(20) NOT NULL,
  `phone` text NOT NULL,
  `email` varchar(20) NOT NULL,
  `login_id` int(11) NOT NULL,
  `status` enum('active','inactive','deleted') NOT NULL,
  FOREIGN KEY (login_id)
        REFERENCES login(ID)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`user_id`, `first_name`, `Last_name`, `phone`, `email`, `login_id`, `status`) VALUES
(1, 'admin', 'admin', '963-385-5087', 'admin@gmail.com', 1, 'active'),
(2, 'Abel', 'Mathew', '444-444-4444', 'abel@gmail.com', 2, 'active'),
(3, 'test', 'test', '555-555-5555', 'test@gmail.com', 3, 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `user_id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
