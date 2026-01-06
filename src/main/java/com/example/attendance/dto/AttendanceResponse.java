package com.example.attendance.dto;

import java.time.LocalDate;

import com.example.attendance.model.AttendanceRecord;

public class AttendanceResponse {
    private String id;
    private String studentId;
    private String courseId;
    private LocalDate date;
    private AttendanceRecord.Status status;
    private String note;

    public AttendanceResponse(String id, String studentId, String courseId, LocalDate date, AttendanceRecord.Status status, String note) {
        this.id = id;
        this.studentId = studentId;
        this.courseId = courseId;
        this.date = date;
        this.status = status;
        this.note = note;
    }

    public String getId() {
        return id;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getCourseId() {
        return courseId;
    }

    public LocalDate getDate() {
        return date;
    }

    public AttendanceRecord.Status getStatus() {
        return status;
    }

    public String getNote() {
        return note;
    }
}
