package com.example.attendance.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.attendance.dto.StudentRequest;
import com.example.attendance.dto.StudentResponse;
import com.example.attendance.exception.ConflictException;
import com.example.attendance.exception.NotFoundException;
import com.example.attendance.model.Student;
import com.example.attendance.repository.StudentRepository;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<StudentResponse> findAll() {
        return studentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public StudentResponse getById(String id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Student not found: " + id));
        return toResponse(student);
    }

    public StudentResponse create(StudentRequest request) {
        if (studentRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ConflictException("Email already registered: " + request.getEmail());
        }
        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setGrade(request.getGrade());
        Student saved = studentRepository.save(student);
        return toResponse(saved);
    }

    public StudentResponse update(String id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Student not found: " + id));

        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equalsIgnoreCase(student.getEmail())) {
            if (studentRepository.existsByEmailIgnoreCase(request.getEmail())) {
                throw new ConflictException("Email already registered: " + request.getEmail());
            }
        }

        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setGrade(request.getGrade());
        Student saved = studentRepository.save(student);
        return toResponse(saved);
    }

    public void delete(String id) {
        if (!studentRepository.existsById(id)) {
            throw new NotFoundException("Student not found: " + id);
        }
        studentRepository.deleteById(id);
    }

    private StudentResponse toResponse(Student student) {
        return new StudentResponse(student.getId(), student.getName(), student.getEmail(), student.getGrade());
    }
}
