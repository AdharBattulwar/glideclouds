# Prerequisites

- Java 17+
- Maven 3.9+
- MongoDB Atlas cluster (connection string)

## Run locally

1. Export your Atlas URI (or edit `src/main/resources/application.yml`):
   ```bash
   set MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/attendance?retryWrites=true&w=majority
   ```
2. Build and run:
   ```bash
   mvn spring-boot:run
   ```

## REST endpoints

- Students: `POST /api/students`, `GET /api/students`, `GET /api/students/{id}`, `PUT /api/students/{id}`, `DELETE /api/students/{id}`
- Courses: `POST /api/courses`, `GET /api/courses`, `GET /api/courses/{id}`, `PUT /api/courses/{id}`, `DELETE /api/courses/{id}`
- Attendance: `POST /api/attendance`, `GET /api/attendance`, `GET /api/attendance/{id}`,
  `GET /api/attendance/student/{studentId}`, `GET /api/attendance/student/{studentId}/range?start=yyyy-MM-dd&end=yyyy-MM-dd`,
  `GET /api/attendance/course/{courseId}`, `PUT /api/attendance/{id}`, `DELETE /api/attendance/{id}`

## Sample payloads

```json
POST /api/students
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "grade": "Grade 10"
}
```

```json
POST /api/courses
{
  "code": "MATH101",
  "title": "Algebra"
}
```

```json
POST /api/attendance
{
  "studentId": "<student-id>",
  "courseId": "<course-id>",
  "date": "2026-01-06",
  "status": "PRESENT",
  "note": "On time"
}
```

## Testing with Testcontainers

The project includes Testcontainers for MongoDB. To run tests:

```bash
mvn test
```

Docker must be available for the MongoDB container to start.
