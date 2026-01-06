package com.example.attendance.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.attendance.model.Course;

public interface CourseRepository extends MongoRepository<Course, String> {
    boolean existsByCodeIgnoreCase(String code);
    Optional<Course> findByCodeIgnoreCase(String code);
}
