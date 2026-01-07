package com.example.attendance.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.attendance.model.Student;

public interface StudentRepository extends MongoRepository<Student, String> {
    boolean existsByEmailIgnoreCase(String email);
}
