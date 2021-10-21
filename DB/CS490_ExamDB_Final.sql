
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";



--
-- Database: `CS490_ExamDB`
--
CREATE DATABASE IF NOT EXISTS `CS490_ExamDB` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `CS490_ExamDB`;

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
CREATE TABLE `exam` (
  `exam_id` int(11) AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `instructor_id` int(11) NOT NULL,
  PRIMARY KEY(exam_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `exam`
--

INSERT INTO `exam` (`exam_id`,`name`, `instructor_id`) VALUES
(1, 'Solving Basic Algorithms', 1);
-- INSERT INTO `exam` (`name`, `instruction_id`) values(`ABC`, 1)

-- --------------------------------------------------------

--
-- Table structure for table `exam_question`
--

DROP TABLE IF EXISTS `exam_question`;
CREATE TABLE `exam_question` (
  `exam_question_id` int(11) NOT NULL AUTO_INCREMENT ,
  `question_id` int(11) NOT NULL,
  `point_value` float NOT NULL,
  `exam_id` int(11) NOT NULL,
  PRIMARY KEY(exam_question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `exam_question`
--

INSERT INTO `exam_question` (`exam_question_id`, `question_id`, `point_value`, `exam_id`) VALUES
(1, 1, 10, 1),
(2, 2, 15, 1),
(3, 3, 20, 1),
(4, 4, 30, 1);

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `passcode` varchar(255) NOT NULL,
  `usertype` varchar(10) NOT NULL,
  `status` char(10) DEFAULT NULL,
  PRIMARY KEY (id)
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

DROP TABLE IF EXISTS `question`;
CREATE TABLE `question` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `function_name` text NOT NULL,
  `function_parameters` text NOT NULL,
  `instructor_id` int(11) NOT NULL,
  PRIMARY KEY(question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`question_id`, `name`, `function_name`, `function_parameters`, `instructor_id`) VALUES
(1, 'Write a function Sum that takes 2 integer arguments a and b and prints its sum', 'sum', 'a, b', 1),
(2, 'Write a function Max that takes 2 arguments a and b and prints the Max value ', 'max', 'a, b', 1),
(3, 'Write a function simple interest that takes 3 arguments p, r and t and prints the interest value', 'simple_interest', 'p, t, r', 1),
(4, 'Write a function compound_interest that takes 3 arguments p, r and t  and print the compound interest value', 'compound_interest', 'p, t, r', 1),
(5, 'Write a function area of circle that takes 1 argument r and print the area ', 'area', 'r', 1),
(6, 'Given a positive integer N, The task is to write a program to check if the number is prime or not.', 'prime_or_not', 'n', 1),
(7, 'Given a positive integer N. Sum of squares of first n natural numbers', 'square_sum', 'n', 1),
(8, 'Given an array to find the sum', 'sum', 'arr', 1),
(9, 'Given an array to find largest element in an array', 'largest', 'arr', 1);

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `test_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `percentage_score` float NOT NULL,
  `raw_score` float NOT NULL,
  PRIMARY KEY(test_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `test`
--

INSERT INTO `test` (`test_id`, `student_id`, `exam_id`, `percentage_score`, `raw_score`) VALUES
(1, 2, 1, 97, 73);

-- --------------------------------------------------------

--
-- Table structure for table `test_answer`
--

DROP TABLE IF EXISTS `test_answer`;
CREATE TABLE `test_answer` (
  `test_answer_id` int(11) NOT NULL AUTO_INCREMENT,
  `test_id` int(11) NOT NULL,
  `exam_question_id` int(11) NOT NULL,
  `answer` text NOT NULL,
  `score` float NOT NULL,
  PRIMARY KEY(test_answer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `test_answer`
--

INSERT INTO `test_answer` (`test_answer_id`, `test_id`, `exam_question_id`, `answer`, `score`) VALUES
(1, 1, 1, 'def sum(a, b): \r\n    print(a + b)', 8),
(2, 1, 2, 'def max(a, b):\r\n    if(a > b):\r\n        print(a)\r\n    else:\r\n        print(b)', 15),
(3, 1, 3, 'def simple_interest(p, t, r):\r\n    si = (p * t * r)/100\r\n    print(si)', 20),
(4, 1, 4, 'def compound_interest(principle, rate, time):\r\n    Amount = principle * (pow((1 + rate / 100), time))\r\n    CI = Amount - principle\r\n    print(CI)', 30);

-- --------------------------------------------------------

--
-- Table structure for table `test_case`
--

DROP TABLE IF EXISTS `test_case`;
CREATE TABLE `test_case` (
  `test_case_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `input` text NOT NULL,
  `expected_output` text NOT NULL,
  primary key(test_case_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `test_case`
--

INSERT INTO `test_case` (`test_case_id`, `question_id`, `input`, `expected_output`) VALUES
(1, 1, 'a=2, b=3', '5'),
(2, 1, 'a=4, b=6', '10'),
(3, 1, 'a=-2, b=5', '3'),
(4, 2, 'a=7, b=2', '7'),
(5, 2, 'a=10, b=21', '21'),
(6, 3, 'p=1000, t=5, r=5', '250'),
(7, 3, 'p=3000, t=1, r=7', '210'),
(8, 4, 'p=10000, r=10.25, t=5', '6288.946268'),
(9, 4, 'p=2500, r=5.5, t=2', '282.5625'),
(10, 5, 'r=5', '78.55'),
(11, 5, 'r=4', '50.272'),
(12, 6, 'n=11', 'True'),
(13, 6, 'n=15', 'False'),
(14, 7, 'n=4', '30'),
(15, 7, 'n=6', '91'),
(16, 8, 'arr = [12, 3, 4, 15]', '34'),
(17, 8, 'arr = [2, 3, 4, 6]', '15'),
(18, 9, 'arr = [12, 3, 4, 15]', '15'),
(19, 9, 'arr = [2, 3, 4, 6]', '6');

-- --------------------------------------------------------

--
-- Table structure for table `test_feedback`
--

DROP TABLE IF EXISTS `test_feedback`;
CREATE TABLE `test_feedback` (
  `test_feedback_id` int(11) NOT NULL AUTO_INCREMENT,
  `test_answer_id` int(11) NOT NULL,
  `feedback` text NOT NULL,
  `test_case_id` int(11) DEFAULT NULL,
  `point` float DEFAULT NULL,
  `status` varchar(10) NOT NULL,
  primary key(test_feedback_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `test_feedback`
--

INSERT INTO `test_feedback` (`test_feedback_id`, `test_answer_id`, `feedback`, `test_case_id`, `point`, `status`) VALUES
(1, 1, 'Good', 1, 2.6667, 'Pass'),
(2, 1, 'Good', 2, 2.6667, 'Pass'),
(3, 1, 'Good', 3, 2.6667, 'Pass'),
(4, 1, 'Function name should follow name convension', NULL, NULL, 'Failed'),
(5, 2, 'Good', 4, 7.5, 'Pass'),
(6, 2, 'Good', 5, 7.5, 'Pass'),
(7, 3, 'Good', 6, 10, 'Pass'),
(8, 3, 'Good', 7, 10, 'Pass'),
(9, 4, 'Good', 8, 15, 'Pass'),
(10, 4, 'Good', 9, 15, 'Pass');

-- --------------------------------------------------------

--
-- Table structure for table `test_review`
--

DROP TABLE IF EXISTS `test_review`;
CREATE TABLE `test_review` (
  `test_review_id` int(11) NOT NULL AUTO_INCREMENT,
  `test_id` int(11) NOT NULL,
  `percentage_score` float NOT NULL,
  `raw_score` float NOT NULL,
  `instructor_id` int(11) NOT NULL,
  `release` varchar(5) NOT NULL,
  primary key(test_review_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `test_review`
--

INSERT INTO `test_review` (`test_review_id`, `test_id`, `percentage_score`, `raw_score`, `instructor_id`, `release`) VALUES
(1, 1, 98, 74, 1, 'True');

-- --------------------------------------------------------

--
-- Table structure for table `test_review_answer`
--

DROP TABLE IF EXISTS `test_review_answer`;
CREATE TABLE `test_review_answer` (
  `test_review_answer_id` int(11) NOT NULL AUTO_INCREMENT,
  `test_review_id` int(11) NOT NULL,
  `test_answer_id` int(11) NOT NULL,
  `score` float NOT NULL,
  `feedback` text NOT NULL,
  primary key(test_review_answer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `test_review_answer`
--

INSERT INTO `test_review_answer` (`test_review_answer_id`, `test_review_id`, `test_answer_id`, `score`, `feedback`) VALUES
(1, 1, 1, 9, 'I am giving 1 mark additionally'),
(2, 1, 2, 15, 'Good'),
(3, 1, 3, 20, 'Good'),
(4, 1, 4, 30, 'Good');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`exam_id`),
  ADD KEY `exam_instructor_id_idx` (`instructor_id`);

--
-- Indexes for table `exam_question`
--
ALTER TABLE `exam_question`
  ADD PRIMARY KEY (`exam_question_id`),
  ADD KEY `exam_question_exam_id_idx` (`exam_id`),
  ADD KEY `exam_question_question_id_idx` (`question_id`);

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
  ADD KEY `question_instructor_id_idx` (`instructor_id`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`test_id`),
  ADD KEY `test_student_id_idx` (`student_id`),
  ADD KEY `test_exam_id_idx` (`exam_id`);

--
-- Indexes for table `test_answer`
--
ALTER TABLE `test_answer`
  ADD PRIMARY KEY (`test_answer_id`),
  ADD KEY `test_answer_test_id_idx` (`test_id`),
  ADD KEY `test_answer _exam_question_id_idx` (`exam_question_id`);

--
-- Indexes for table `test_case`
--
ALTER TABLE `test_case`
  ADD PRIMARY KEY (`test_case_id`),
  ADD KEY `test_case_question_id_idx` (`question_id`);

--
-- Indexes for table `test_feedback`
--
ALTER TABLE `test_feedback`
  ADD PRIMARY KEY (`test_feedback_id`),
  ADD KEY `test_feedback_test_answer_id_idx` (`test_answer_id`),
  ADD KEY `test_feedback_test_case_id_idx` (`test_case_id`);

--
-- Indexes for table `test_review`
--
ALTER TABLE `test_review`
  ADD PRIMARY KEY (`test_review_id`),
  ADD KEY `test_review_test_id_idx` (`test_id`),
  ADD KEY `test_review_instructor_id_idx` (`instructor_id`);

--
-- Indexes for table `test_review_answer`
--
ALTER TABLE `test_review_answer`
  ADD PRIMARY KEY (`test_review_answer_id`),
  ADD KEY `test_review_answer_test_review_id_idx` (`test_review_id`),
  ADD KEY `test_review_answer_test_answer_id_idx` (`test_answer_id`);

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
  ADD CONSTRAINT `test_answer _exam_question_id` FOREIGN KEY (`exam_question_id`) REFERENCES `exam_question` (`exam_question_id`),
  ADD CONSTRAINT `test_answer_test_id` FOREIGN KEY (`test_id`) REFERENCES `test` (`test_id`);

--
-- Constraints for table `test_case`
--
ALTER TABLE `test_case`
  ADD CONSTRAINT `test_case_question_id` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`);

--
-- Constraints for table `test_feedback`
--
ALTER TABLE `test_feedback`
  ADD CONSTRAINT `test_feedback_test_answer_id` FOREIGN KEY (`test_answer_id`) REFERENCES `test_answer` (`test_answer_id`),
  ADD CONSTRAINT `test_feedback_test_case_id` FOREIGN KEY (`test_case_id`) REFERENCES `test_case` (`test_case_id`);

--
-- Constraints for table `test_review`
--
ALTER TABLE `test_review`
  ADD CONSTRAINT `test_review_instructor_id` FOREIGN KEY (`instructor_id`) REFERENCES `login` (`id`),
  ADD CONSTRAINT `test_review_test_id` FOREIGN KEY (`test_id`) REFERENCES `test` (`test_id`);

--
-- Constraints for table `test_review_answer`
--
ALTER TABLE `test_review_answer`
  ADD CONSTRAINT `test_review_answer_test_answer_id` FOREIGN KEY (`test_answer_id`) REFERENCES `test_answer` (`test_answer_id`),
  ADD CONSTRAINT `test_review_answer_test_review_id` FOREIGN KEY (`test_review_id`) REFERENCES `test_review` (`test_review_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
