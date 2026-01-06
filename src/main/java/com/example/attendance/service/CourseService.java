package com.example.attendance.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.attendance.dto.CourseRequest;
import com.example.attendance.dto.CourseResponse;
import com.example.attendance.exception.ConflictException;
import com.example.attendance.exception.NotFoundException;
import com.example.attendance.model.Course;
import com.example.attendance.repository.CourseRepository;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<CourseResponse> findAll() {
        return courseRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse getById(String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Course not found: " + id));
        return toResponse(course);
    }

    public CourseResponse create(CourseRequest request) {
        if (courseRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new ConflictException("Course code already exists: " + request.getCode());
        }
        Course course = new Course();
        course.setCode(request.getCode());
        course.setTitle(request.getTitle());
        Course saved = courseRepository.save(course);
        return toResponse(saved);
    }

    public CourseResponse update(String id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Course not found: " + id));

        if (StringUtils.hasText(request.getCode()) && !request.getCode().equalsIgnoreCase(course.getCode())) {
            if (courseRepository.existsByCodeIgnoreCase(request.getCode())) {
                throw new ConflictException("Course code already exists: " + request.getCode());
            }
        }

        course.setCode(request.getCode());
        course.setTitle(request.getTitle());
        Course saved = courseRepository.save(course);
        return toResponse(saved);
    }

    public void delete(String id) {
        if (!courseRepository.existsById(id)) {
            throw new NotFoundException("Course not found: " + id);
        }
        courseRepository.deleteById(id);
    }

    private CourseResponse toResponse(Course course) {
        return new CourseResponse(course.getId(), course.getCode(), course.getTitle());
    }
}
