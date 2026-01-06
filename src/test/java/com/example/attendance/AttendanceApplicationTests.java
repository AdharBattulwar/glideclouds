package com.example.attendance;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.example.attendance.dto.StudentRequest;
import com.example.attendance.dto.StudentResponse;
import com.example.attendance.service.StudentService;

@SpringBootTest
@Testcontainers
class AttendanceApplicationTests {

    @Container
    static MongoDBContainer mongo = new MongoDBContainer("mongo:7.0");

    @DynamicPropertySource
    static void mongoProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongo::getReplicaSetUrl);
    }

    @Autowired
    private StudentService studentService;

    @Test
    void createsAndReadsStudent() {
        StudentRequest request = new StudentRequest("Test User", "test@example.com", "Grade 1");
        StudentResponse created = studentService.create(request);

        List<StudentResponse> all = studentService.findAll();
        assertThat(all).extracting(StudentResponse::getId).contains(created.getId());
        StudentResponse fetched = studentService.getById(created.getId());
        assertThat(fetched.getEmail()).isEqualTo("test@example.com");
    }
}
