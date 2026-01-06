package com.example.attendance.dto;

public class StudentResponse {
    private String id;
    private String name;
    private String email;
    private String grade;

    public StudentResponse(String id, String name, String email, String grade) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.grade = grade;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getGrade() {
        return grade;
    }
}
