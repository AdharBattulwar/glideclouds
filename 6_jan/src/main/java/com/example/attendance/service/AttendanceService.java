package com.example.attendance.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.attendance.dto.AttendanceRequest;
import com.example.attendance.dto.AttendanceResponse;
import com.example.attendance.exception.NotFoundException;
import com.example.attendance.model.AttendanceRecord;
import com.example.attendance.model.Course;
import com.example.attendance.model.Student;
import com.example.attendance.repository.AttendanceRecordRepository;
import com.example.attendance.repository.CourseRepository;
import com.example.attendance.repository.StudentRepository;

@Service
public class AttendanceService {
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public AttendanceService(AttendanceRecordRepository attendanceRecordRepository,
                             StudentRepository studentRepository,
                             CourseRepository courseRepository) {
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public List<AttendanceResponse> findAll() {
        return attendanceRecordRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AttendanceResponse getById(String id) {
        AttendanceRecord record = attendanceRecordRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Attendance record not found: " + id));
        return toResponse(record);
    }

    public List<AttendanceResponse> findByStudent(String studentId) {
        ensureStudentExists(studentId);
        return attendanceRecordRepository.findByStudentId(studentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> findByCourse(String courseId) {
        ensureCourseExists(courseId);
        return attendanceRecordRepository.findByCourseId(courseId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> findByStudentAndDateRange(String studentId, LocalDate start, LocalDate end) {
        ensureStudentExists(studentId);
        LocalDate safeStart = start != null ? start : LocalDate.MIN;
        LocalDate safeEnd = end != null ? end : LocalDate.MAX;
        return attendanceRecordRepository.findByStudentIdAndDateBetween(studentId, safeStart, safeEnd)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AttendanceResponse create(AttendanceRequest request) {
        ensureStudentExists(request.getStudentId());
        ensureCourseExists(request.getCourseId());

        AttendanceRecord record = new AttendanceRecord();
        record.setStudentId(request.getStudentId());
        record.setCourseId(request.getCourseId());
        record.setDate(request.getDate());
        record.setStatus(request.getStatus());
        record.setNote(request.getNote());
        AttendanceRecord saved = attendanceRecordRepository.save(record);
        return toResponse(saved);
    }

    public AttendanceResponse update(String id, AttendanceRequest request) {
        AttendanceRecord record = attendanceRecordRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Attendance record not found: " + id));

        ensureStudentExists(request.getStudentId());
        ensureCourseExists(request.getCourseId());

        record.setStudentId(request.getStudentId());
        record.setCourseId(request.getCourseId());
        record.setDate(request.getDate());
        record.setStatus(request.getStatus());
        record.setNote(request.getNote());
        AttendanceRecord saved = attendanceRecordRepository.save(record);
        return toResponse(saved);
    }

    public void delete(String id) {
        if (!attendanceRecordRepository.existsById(id)) {
            throw new NotFoundException("Attendance record not found: " + id);
        }
        attendanceRecordRepository.deleteById(id);
    }

    private void ensureStudentExists(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found: " + studentId));
    }

    private void ensureCourseExists(String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NotFoundException("Course not found: " + courseId));
    }

    private AttendanceResponse toResponse(AttendanceRecord record) {
        return new AttendanceResponse(
                record.getId(),
                record.getStudentId(),
                record.getCourseId(),
                record.getDate(),
                record.getStatus(),
                record.getNote()
        );
    }
}
