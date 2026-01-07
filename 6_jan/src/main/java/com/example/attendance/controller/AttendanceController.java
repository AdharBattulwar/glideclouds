package com.example.attendance.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.attendance.dto.AttendanceRequest;
import com.example.attendance.dto.AttendanceResponse;
import com.example.attendance.service.AttendanceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/attendance")
@Validated
public class AttendanceController {
    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public List<AttendanceResponse> getAll() {
        return attendanceService.findAll();
    }

    @GetMapping("/{id}")
    public AttendanceResponse getById(@PathVariable String id) {
        return attendanceService.getById(id);
    }

    @GetMapping("/student/{studentId}")
    public List<AttendanceResponse> getByStudent(@PathVariable String studentId) {
        return attendanceService.findByStudent(studentId);
    }

    @GetMapping("/student/{studentId}/range")
    public List<AttendanceResponse> getByStudentAndRange(
            @PathVariable String studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return attendanceService.findByStudentAndDateRange(studentId, start, end);
    }

    @GetMapping("/course/{courseId}")
    public List<AttendanceResponse> getByCourse(@PathVariable String courseId) {
        return attendanceService.findByCourse(courseId);
    }

    @PostMapping
    public ResponseEntity<AttendanceResponse> create(@Valid @RequestBody AttendanceRequest request) {
        AttendanceResponse created = attendanceService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public AttendanceResponse update(@PathVariable String id, @Valid @RequestBody AttendanceRequest request) {
        return attendanceService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        attendanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
