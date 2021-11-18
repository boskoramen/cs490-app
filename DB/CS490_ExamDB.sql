-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 18, 2021 at 12:57 PM
-- Server version: 10.3.30-MariaDB
-- PHP Version: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `CS490_ExamDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

CREATE TABLE `exam` (
  `exam_id` int(11) NOT NULL,
  `question_id` text DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `instructor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `exam_question`
--

CREATE TABLE `exam_question` (
  `exam_question_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `point_value` float NOT NULL,
  `exam_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `passcode` varchar(255) NOT NULL,
  `usertype` varchar(10) NOT NULL,
  `status` char(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `username`, `salt`, `passcode`, `usertype`, `status`) VALUES
(1, 'instructor@gmail.com', 'x7EDUAKAUVPzzdkZXUil', 'b61d4570af1561c9cc3e20d7702782422dad1e4b31834c87995136703bb9c0f7406914b48bd1be16788e945c1eb7c5571817', 'instructor', 'ACTIVE'),
(2, 'student1@gmail.com', 'x7EDUAKAUVPzzdkZXUil', 'b61d4570af1561c9cc3e20d7702782422dad1e4b31834c87995136703bb9c0f7406914b48bd1be16788e945c1eb7c5571817', 'student', 'ACTIVE'),
(3, 'student2@gmail.com', 'x7EDUAKAUVPzzdkZXUil', 'b61d4570af1561c9cc3e20d7702782422dad1e4b31834c87995136703bb9c0f7406914b48bd1be16788e945c1eb7c5571817', 'student', 'ACTIVE'),
(4, 'student3@gmail.com', 'x7EDUAKAUVPzzdkZXUil', 'b61d4570af1561c9cc3e20d7702782422dad1e4b31834c87995136703bb9c0f7406914b48bd1be16788e945c1eb7c5571817', 'student', 'ACTIVE'),
(5, 'admin@gmail.com', 'bYNsXwMBasW71A2utz2G', 'ba454cc5b61e28ffecf1968f8cf20add08e86a92ebaeeb4cda99ffb4f701aebf2ba244d6c78f79f6cb289a09baa1ae355f14', 'admin', 'active'),
(6, 'abel@gmail.com', 'x7EDUAKAUVPzzdkZXUil', 'b61d4570af1561c9cc3e20d7702782422dad1e4b31834c87995136703bb9c0f7406914b48bd1be16788e945c1eb7c5571817', 'user', 'active'),
(7, 'test@gmail.com', 'dA3A0j9rPFeagKPHkXkA', '61459e9b7cf93a7c621985f1f4d16c523dd64d590d69f55046de97b8ad32fc7c3f1c928b306293b775c7c56fe6ad9fc43eae', 'user', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `question_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `function_name` text NOT NULL,
  `function_parameters` text NOT NULL,
  `instructor_id` int(11) NOT NULL,
  `topic` varchar(256) DEFAULT NULL,
  `difficulty` varchar(256) DEFAULT NULL,
  `constraints` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`question_id`, `name`, `function_name`, `function_parameters`, `instructor_id`, `topic`, `difficulty`, `constraints`) VALUES
(49, 'add_num', 'add_num', 'int a,int b', 1, '\"While\"', '\"Easy\"', ''),
(50, 'mult_n multiply a number m by n using for loops', 'mult_n', 'int m,int n', 1, '\"For\"', '\"Medium\"', 'for');

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `test_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `percentage_score` float DEFAULT NULL,
  `raw_score` float DEFAULT NULL,
  `review` text DEFAULT NULL,
  `release` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `test_answer`
--

CREATE TABLE `test_answer` (
  `test_answer_id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` text NOT NULL,
  `review` text DEFAULT NULL,
  `score` text DEFAULT NULL,
  `test_case_score` text DEFAULT NULL,
  `exam_points` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `test_case`
--

CREATE TABLE `test_case` (
  `test_case_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `input` text NOT NULL,
  `expected_output` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `test_case`
--

INSERT INTO `test_case` (`test_case_id`, `question_id`, `input`, `expected_output`) VALUES
(108, 49, '1 2', '3'),
(109, 49, '4 8', '12'),
(110, 50, '5 3', '15'),
(111, 50, '12 2', '24');

-- --------------------------------------------------------

--
-- Table structure for table `test_feedback`
--

CREATE TABLE `test_feedback` (
  `test_feedback_id` int(11) NOT NULL,
  `test_answer_id` int(11) NOT NULL,
  `feedback` text NOT NULL,
  `test_case_id` int(11) DEFAULT NULL,
  `point` float DEFAULT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `test_review`
--

CREATE TABLE `test_review` (
  `test_review_id` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `percentage_score` float NOT NULL,
  `raw_score` float NOT NULL,
  `instructor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `test_review_answer`
--

CREATE TABLE `test_review_answer` (
  `test_review_answer_id` int(11) NOT NULL,
  `test_review_id` int(11) NOT NULL,
  `test_answer_id` int(11) NOT NULL,
  `score` float NOT NULL,
  `feedback` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`exam_id`),
  ADD KEY `exam_instructor_id` (`instructor_id`);

--
-- Indexes for table `exam_question`
--
ALTER TABLE `exam_question`
  ADD PRIMARY KEY (`exam_question_id`),
  ADD KEY `exam_question_exam_id` (`exam_id`),
  ADD KEY `exam_question_question_id` (`question_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `question_instructor_id` (`instructor_id`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`test_id`),
  ADD KEY `test_exam_id` (`exam_id`),
  ADD KEY `test_student_id` (`student_id`);

--
-- Indexes for table `test_answer`
--
ALTER TABLE `test_answer`
  ADD PRIMARY KEY (`test_answer_id`),
  ADD KEY `test_answer_test_id` (`test_id`);

--
-- Indexes for table `test_case`
--
ALTER TABLE `test_case`
  ADD PRIMARY KEY (`test_case_id`),
  ADD KEY `test_case_question_id` (`question_id`);

--
-- Indexes for table `test_feedback`
--
ALTER TABLE `test_feedback`
  ADD PRIMARY KEY (`test_feedback_id`);

--
-- Indexes for table `test_review`
--
ALTER TABLE `test_review`
  ADD PRIMARY KEY (`test_review_id`);

--
-- Indexes for table `test_review_answer`
--
ALTER TABLE `test_review_answer`
  ADD PRIMARY KEY (`test_review_answer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exam`
--
ALTER TABLE `exam`
  MODIFY `exam_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `exam_question`
--
ALTER TABLE `exam_question`
  MODIFY `exam_question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `test`
--
ALTER TABLE `test`
  MODIFY `test_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;

--
-- AUTO_INCREMENT for table `test_answer`
--
ALTER TABLE `test_answer`
  MODIFY `test_answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `test_case`
--
ALTER TABLE `test_case`
  MODIFY `test_case_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `test_feedback`
--
ALTER TABLE `test_feedback`
  MODIFY `test_feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `test_review`
--
ALTER TABLE `test_review`
  MODIFY `test_review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `test_review_answer`
--
ALTER TABLE `test_review_answer`
  MODIFY `test_review_answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exam`
--
ALTER TABLE `exam`
  ADD CONSTRAINT `exam_instructor_id` FOREIGN KEY (`instructor_id`) REFERENCES `login` (`id`);

--
-- Constraints for table `exam_question`
--
ALTER TABLE `exam_question`
  ADD CONSTRAINT `exam_question_exam_id` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`),
  ADD CONSTRAINT `exam_question_question_id` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`);

--
-- Constraints for table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `question_instructor_id` FOREIGN KEY (`instructor_id`) REFERENCES `login` (`id`);

--
-- Constraints for table `test`
--
ALTER TABLE `test`
  ADD CONSTRAINT `test_exam_id` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`),
  ADD CONSTRAINT `test_student_id` FOREIGN KEY (`student_id`) REFERENCES `login` (`id`);

--
-- Constraints for table `test_answer`
--
ALTER TABLE `test_answer`
  ADD CONSTRAINT `test_answer_test_id` FOREIGN KEY (`test_id`) REFERENCES `test` (`test_id`);

--
-- Constraints for table `test_case`
--
ALTER TABLE `test_case`
  ADD CONSTRAINT `test_case_question_id` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
