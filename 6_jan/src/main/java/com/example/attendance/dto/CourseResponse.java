package com.example.attendance.dto;

public class CourseResponse {
    private String id;
    private String code;
    private String title;

    public CourseResponse(String id, String code, String title) {
        this.id = id;
        this.code = code;
        this.title = title;
    }

    public String getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getTitle() {
        return title;
    }
}
