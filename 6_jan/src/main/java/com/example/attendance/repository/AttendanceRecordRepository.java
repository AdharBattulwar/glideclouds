package com.example.attendance.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.attendance.model.AttendanceRecord;

public interface AttendanceRecordRepository extends MongoRepository<AttendanceRecord, String> {
    List<AttendanceRecord> findByStudentId(String studentId);
    List<AttendanceRecord> findByCourseId(String courseId);
    List<AttendanceRecord> findByStudentIdAndDateBetween(String studentId, LocalDate start, LocalDate end);
}
