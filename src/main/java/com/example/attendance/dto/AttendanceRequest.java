package com.example.attendance.dto;

import java.time.LocalDate;

import com.example.attendance.model.AttendanceRecord;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AttendanceRequest {
    @NotBlank
    private String studentId;

    @NotBlank
    private String courseId;

    @NotNull
    private LocalDate date;

    @NotNull
    private AttendanceRecord.Status status;

    private String note;

    public AttendanceRequest() {
    }

    public AttendanceRequest(String studentId, String courseId, LocalDate date, AttendanceRecord.Status status, String note) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.date = date;
        this.status = status;
        this.note = note;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public AttendanceRecord.Status getStatus() {
        return status;
    }

    public void setStatus(AttendanceRecord.Status status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
