-- phpMyAdmin SQL Dump
-- version 2.11.11.3
-- http://www.phpmyadmin.net
--
-- Palvelin: 37.148.204.80
-- Luontiaika: 09.05.2015 klo 02:12
-- Palvelimen versio: 5.0.96
-- PHP:n versio: 5.1.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Tietokanta: `homemarkets`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `pets`
--

CREATE TABLE `pets` (
  `key` varchar(10) NOT NULL,
  `cats` int(2) NOT NULL,
  `dogs` int(2) NOT NULL,
  `birds` int(2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Vedostetaan tietoa taulusta `pets`
--

INSERT INTO `pets` VALUES('before', 1, 2, 5);
INSERT INTO `pets` VALUES('now', 2, 1, 8);
INSERT INTO `pets` VALUES('tomorrow', 5, 1, 2);
