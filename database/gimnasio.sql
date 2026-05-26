-- MySQL Workbench Synchronization
-- Generated: 2025-05-10 21:57
-- Model: New Model
-- Version: 1.0
-- Project: WolfGym DB
-- Author: Juan Calvó

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `gimnasio` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE IF NOT EXISTS `gimnasio`.`Profesores` (
  `idProfesor` INT(11) NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(30) NOT NULL,
  `apellidos` VARCHAR(30) NOT NULL,
  `dni` VARCHAR(20) NOT NULL,
  `telefono` VARCHAR(11) NULL DEFAULT NULL,
  `direccion` VARCHAR(30) NULL DEFAULT NULL,
  `mail` VARCHAR(30) NULL DEFAULT NULL,
  `usuario` VARCHAR(30) NOT NULL,
  `contraseña` VARCHAR(60) NOT NULL,
  `estado` CHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (`idProfesor`),
  UNIQUE INDEX `dni_UNIQUE` (`dni` ASC),
  CONSTRAINT `mail_UNIQUE` UNIQUE (`mail` ASC),
  UNIQUE INDEX `usuario_UNIQUE` (`usuario` ASC),
  INDEX `idx_profesor_apellidoNombre` (`apellidos` ASC, `nombres` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `gimnasio`.`Clientes` (
  `idCliente` INT(11) NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(30) NOT NULL,
  `apellidos` VARCHAR(30) NOT NULL,
  `tipoDni` VARCHAR(10) NOT NULL,
  `dni` VARCHAR(20) NOT NULL,
  `telefono` VARCHAR(11) NULL DEFAULT NULL,
  `direccion` VARCHAR(30) NULL DEFAULT NULL,
  `mail` VARCHAR(30) NULL DEFAULT NULL,
  `estado` CHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (`idCliente`),
  CONSTRAINT `dni_UNIQUE` UNIQUE (dni),
  INDEX `idx_cliente_apellidoNombre` (`apellidos` ASC, `nombres` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `gimnasio`.`Pases` (
  `idPase` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(15) NOT NULL,
  `horaInicio` TIME NOT NULL,
  `horaFin` TIME NOT NULL,
  `precio` INT(11) NOT NULL,
  `estado` CHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (`idPase`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `gimnasio`.`Inscripciones` (
  `idInscripcion` INT(11) NOT NULL AUTO_INCREMENT,
  `idProfesor` INT(11) NOT NULL,
  `idCliente` INT(11) NOT NULL,
  `idPase` INT(11) NOT NULL,
  `diaInicio` DATE NOT NULL,
  `diaFin` DATE NOT NULL,
  `precio` INT(11) NOT NULL,
  `estado` CHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (`idInscripcion`, `idProfesor`, `idCliente`, `idPase`),
  INDEX `fk_Inscripciones_Profesores_idx` (`idProfesor` ASC),
  INDEX `fk_Inscripciones_Clientes1_idx` (`idCliente` ASC),
  INDEX `fk_Inscripciones_Pases1_idx` (`idPase` ASC),
  CONSTRAINT `fk_Inscripciones_Profesores`
    FOREIGN KEY (`idProfesor`)
    REFERENCES `gimnasio`.`Profesores` (`idProfesor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Inscripciones_Clientes1`
    FOREIGN KEY (`idCliente`)
    REFERENCES `gimnasio`.`Clientes` (`idCliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Inscripciones_Pases1`
    FOREIGN KEY (`idPase`)
    REFERENCES `gimnasio`.`Pases` (`idPase`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `gimnasio`.`Asistencias` (
  `idAsistencia` INT(11) NOT NULL AUTO_INCREMENT,
  `idCliente` INT(11) NOT NULL,
  `fecha` DATETIME NOT NULL,
  PRIMARY KEY (`idAsistencia`, `idCliente`),
  INDEX `fk_Asistencias_Clientes1_idx` (`idCliente` ASC),
  CONSTRAINT `fk_Asistencias_Clientes1`
    FOREIGN KEY (`idCliente`)
    REFERENCES `gimnasio`.`Clientes` (`idCliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `gimnasio`.`Rutinas` (
  `idRutina` INT(11) NOT NULL AUTO_INCREMENT,
  `idCliente` INT(11) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `observaciones` VARCHAR(45) NULL DEFAULT NULL,
  `estado` CHAR(1) NULL DEFAULT NULL,
  PRIMARY KEY (`idRutina`, `idCliente`),
  UNIQUE INDEX `uq_cliente_nombre` (`idCliente`, `nombre`),
  INDEX `fk_Rutinas_Clientes1_idx` (`idCliente` ASC),
  CONSTRAINT `fk_Rutinas_Clientes1`
    FOREIGN KEY (`idCliente`)
    REFERENCES `gimnasio`.`Clientes` (`idCliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `gimnasio`.`Administradores` (
  `idAdministrador` INT(11) NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(30) NULL DEFAULT NULL,
  `contraseña` VARCHAR(60) NULL DEFAULT NULL,
  PRIMARY KEY (`idAdministrador`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `gimnasio`.`LineasDeRutina` (
  `idLineaDeRutina` INT(11) NOT NULL AUTO_INCREMENT,
  `ejercicio` VARCHAR(20) NOT NULL,
  `idRutina` INT(11) NOT NULL,
  `idCliente` INT(11) NOT NULL,
  `repeticiones` VARCHAR(5) NULL DEFAULT NULL,
  `series` INT(11) NULL DEFAULT NULL,
  `descanso`  VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (`idLineaDeRutina`, `idRutina`, `idCliente`),
  INDEX `fk_LineasDeRutina_Rutinas1_idx` (`idRutina` ASC, `idCliente` ASC),
  CONSTRAINT `fk_LineasDeRutina_Rutinas1`
    FOREIGN KEY (`idRutina` , `idCliente`)
    REFERENCES `gimnasio`.`Rutinas` (`idRutina` , `idCliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
