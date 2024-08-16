-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-08-2024 a las 08:55:21
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";



CREATE TABLE `incidences` (
  `id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `type` enum('maintenance','security','cleaning') NOT NULL,
  `description` text NOT NULL,
  `status` enum('pending','in_progress','resolved') DEFAULT 'pending',
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `UserId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `incidences`
--

INSERT INTO `incidences` (`id`, `subject`, `type`, `description`, `status`, `latitude`, `longitude`, `image`, `UserId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Prueba de incidencia', 'maintenance', 'Esta es una incidencia de prueba creada desde Thunder Client', 'resolved', 40.4168, -3.70379, '1723254667346.jpg', 2, '2024-08-10 01:51:07', '2024-08-14 10:52:48', NULL),
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `incidenceId` int(11) NOT NULL,
  `type` enum('email','sms') NOT NULL,
  `status` enum('pending','sent','failed') DEFAULT 'pending',
  `read` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notifications`
--

INSERT INTO `notifications` (`id`, `message`, `userId`, `incidenceId`, `type`, `status`, `read`, `createdAt`, `updatedAt`) VALUES
(1, 'Incidencia 10 actualizada', 2, 10, 'email', 'pending', 0, '2024-08-12 10:28:31', '2024-08-12 10:28:31'),
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobilePhone` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `lastName`, `email`, `password`, `mobilePhone`, `photo`, `isAdmin`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', 'User', 'admin@example.com', '$2b$10$JGdUwjCC6JJHv.xzbvUWxehxHepj7lEjMdWdDYlDq/6ji4BdJ3PVq', '+1234567890', NULL, 1, '2024-08-09 12:28:54', '2024-08-09 12:28:54'),
(2, 'Sebastiansss', 'Lucianossss', 'sebastianperu7@hotmail.com', '$2b$10$29GRjLeZKMi2cq469AniUO2sOhPJ46.t3etwt4NNGjlify13JkzXC', '943000218', NULL, 0, '2024-08-09 14:42:39', '2024-08-15 22:57:20'),
(3, 'Ana', 'Quevedo', 'ana@example.com', '$2b$10$j4bVFbtUuuNJ7zqfEfLG4ud53YEPWdur2Tho.tOfzW6x9tSlprpqq', '943233619', NULL, 0, '2024-08-15 12:12:22', '2024-08-16 06:46:34'),
(4, 'Jose', 'Alvarez', 'jose@example.com', '$2b$10$o/neSdfwRB1pw7V1GrioIeZlh5XqLJaM82ShwV2CfBzYtm1c1KFae', '945234576', NULL, 0, '2024-08-16 02:01:48', '2024-08-16 02:01:48');


-- Indices de la tabla `incidences`
--
ALTER TABLE `incidences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indices de la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `incidenceId` (`incidenceId`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  
--- AUTO_INCREMENT de la tabla `incidences`
--
ALTER TABLE `incidences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas

-- Filtros para la tabla `incidences`
--
ALTER TABLE `incidences`
  ADD CONSTRAINT `incidences_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
--
-- Filtros para la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`incidenceId`) REFERENCES `incidences` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
