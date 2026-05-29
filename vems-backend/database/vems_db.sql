-- ============================================================
-- VEMS Database — vems_db
-- Server  : localhost:3306
-- Charset : utf8_general_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS vems_db
    CHARACTER SET utf8
    COLLATE utf8_general_ci;

USE vems_db;

-- TABLE 1: users
CREATE TABLE IF NOT EXISTS users (
    id            INT          NOT NULL AUTO_INCREMENT,
    username      VARCHAR(50)  NOT NULL,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(100) NOT NULL,
    role          ENUM('admin','employee','customer') NOT NULL DEFAULT 'customer',
    password_hash VARCHAR(255) NOT NULL,
    status        ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at    DATETIME     NOT NULL,
    updated_at    DATETIME     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_username (username),
    UNIQUE KEY uq_email    (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- TABLE 2: sessions
CREATE TABLE IF NOT EXISTS sessions (
    id         INT          NOT NULL AUTO_INCREMENT,
    user_id    INT          NOT NULL,
    token      VARCHAR(255) NOT NULL,
    expires_at DATETIME     NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE KEY uq_token (token),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- TABLE 3: birth_records
CREATE TABLE IF NOT EXISTS birth_records (
    id              INT          NOT NULL AUTO_INCREMENT,
    registration_no VARCHAR(30)  NOT NULL,
    child_name      VARCHAR(100) NOT NULL,
    date_of_birth   DATE         NOT NULL,
    place_of_birth  VARCHAR(100) NULL,
    gender          ENUM('male','female') NOT NULL,
    father_name     VARCHAR(100) NOT NULL,
    father_id_no    VARCHAR(50)  NULL,
    mother_name     VARCHAR(100) NOT NULL,
    mother_id_no    VARCHAR(50)  NULL,
    kebele          VARCHAR(100) NOT NULL,
    woreda          VARCHAR(100) NULL,
    notes           TEXT         NULL,
    registered_by   INT          NULL,
    status          ENUM('registered','pending','updated') NOT NULL DEFAULT 'registered',
    created_at      DATETIME     NOT NULL,
    updated_at      DATETIME     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_birth_reg (registration_no),
    FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- TABLE 4: death_records
CREATE TABLE IF NOT EXISTS death_records (
    id              INT          NOT NULL AUTO_INCREMENT,
    registration_no VARCHAR(30)  NOT NULL,
    deceased_name   VARCHAR(100) NOT NULL,
    date_of_death   DATE         NOT NULL,
    place_of_death  VARCHAR(100) NULL,
    cause_of_death  VARCHAR(200) NOT NULL,
    age_at_death    INT          NULL,
    gender          VARCHAR(10)  NULL,
    reported_by     VARCHAR(100) NOT NULL,
    reporter_id_no  VARCHAR(50)  NULL,
    kebele          VARCHAR(100) NOT NULL,
    woreda          VARCHAR(100) NULL,
    notes           TEXT         NULL,
    registered_by   INT          NULL,
    status          ENUM('registered','pending','updated') NOT NULL DEFAULT 'registered',
    created_at      DATETIME     NOT NULL,
    updated_at      DATETIME     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_death_reg (registration_no),
    FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- TABLE 5: marriage_records
CREATE TABLE IF NOT EXISTS marriage_records (
    id                INT          NOT NULL AUTO_INCREMENT,
    registration_no   VARCHAR(30)  NOT NULL,
    husband_name      VARCHAR(100) NOT NULL,
    husband_id_no     VARCHAR(50)  NULL,
    husband_dob       DATE         NULL,
    wife_name         VARCHAR(100) NOT NULL,
    wife_id_no        VARCHAR(50)  NULL,
    wife_dob          DATE         NULL,
    marriage_date     DATE         NOT NULL,
    place_of_marriage VARCHAR(100) NULL,
    marriage_type     VARCHAR(20)  NULL,
    witness1_name     VARCHAR(100) NOT NULL,
    witness2_name     VARCHAR(100) NOT NULL,
    witness3_name     VARCHAR(100) NULL,
    witness4_name     VARCHAR(100) NULL,
    kebele            VARCHAR(100) NOT NULL,
    woreda            VARCHAR(100) NULL,
    notes             TEXT         NULL,
    registered_by     INT          NULL,
    status            ENUM('registered','pending','updated') NOT NULL DEFAULT 'registered',
    created_at        DATETIME     NOT NULL,
    updated_at        DATETIME     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_marriage_reg (registration_no),
    FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- TABLE 6: divorce_records
CREATE TABLE IF NOT EXISTS divorce_records (
    id              INT          NOT NULL AUTO_INCREMENT,
    registration_no VARCHAR(30)  NOT NULL,
    husband_name    VARCHAR(100) NOT NULL,
    husband_id_no   VARCHAR(50)  NULL,
    wife_name       VARCHAR(100) NOT NULL,
    wife_id_no      VARCHAR(50)  NULL,
    divorce_date    DATE         NOT NULL,
    court_order_no  VARCHAR(100) NOT NULL,
    court_name      VARCHAR(100) NULL,
    reason          VARCHAR(50)  NULL,
    kebele          VARCHAR(100) NOT NULL,
    woreda          VARCHAR(100) NULL,
    notes           TEXT         NULL,
    registered_by   INT          NULL,
    status          ENUM('registered','pending','updated') NOT NULL DEFAULT 'registered',
    created_at      DATETIME     NOT NULL,
    updated_at      DATETIME     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_divorce_reg (registration_no),
    FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
