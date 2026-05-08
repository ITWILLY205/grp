-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS school_management_db;
USE school_management_db;

-- 2. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'DISCIPLINE_MASTER') NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Academic Structure
CREATE TABLE IF NOT EXISTS academic_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    status ENUM('Active', 'Completed') DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year_id INT,
    name VARCHAR(20) NOT NULL,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS streams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    name VARCHAR(20) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE,
    category ENUM('CORE', 'ELECTIVE') DEFAULT 'CORE'
);

-- 4. Personnel & Students
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    staff_id VARCHAR(20) UNIQUE NOT NULL,
    specialization VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    class_id INT,
    stream_id INT,
    parent_name VARCHAR(100),
    parent_phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (stream_id) REFERENCES streams(id)
);

-- 5. Academic Records
CREATE TABLE IF NOT EXISTS teacher_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    subject_id INT,
    stream_id INT,
    term_id INT,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (stream_id) REFERENCES streams(id),
    FOREIGN KEY (term_id) REFERENCES terms(id)
);

CREATE TABLE IF NOT EXISTS marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject_id INT,
    term_id INT,
    cat_score INT DEFAULT 0,
    exam_score INT DEFAULT 0,
    total_score INT DEFAULT 0,
    grade VARCHAR(2),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (term_id) REFERENCES terms(id)
);

CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Excused') DEFAULT 'Present',
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 6. Discipline & Notifications
CREATE TABLE IF NOT EXISTS discipline_incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    reported_by INT,
    description TEXT,
    action_taken TEXT,
    punishment_marks INT DEFAULT 0,
    date DATE,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (reported_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    recipient_role ENUM('ALL', 'TEACHER', 'STUDENT', 'PARENT'),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- 7. Initial Data
INSERT IGNORE INTO users (username, password, role, full_name) 
VALUES ('admin', 'admin123', 'ADMIN', 'System Administrator');

INSERT IGNORE INTO academic_years (name, status) VALUES ('2025-2026', 'Active');
