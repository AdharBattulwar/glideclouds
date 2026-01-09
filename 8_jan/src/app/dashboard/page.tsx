"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    StudentResponse,
    CourseResponse,
    AttendanceResponse,
    AttendanceStatus,
} from "@/types/api";

export default function DashboardPage() {
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [attendance, setAttendance] = useState<AttendanceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"students" | "courses" | "attendance">("students");
    const [error, setError] = useState<string | null>(null);

    // Modals
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [showAttendanceForm, setShowAttendanceForm] = useState(false);

    // Form data
    const [studentForm, setStudentForm] = useState({ name: "", email: "", grade: "" });
    const [courseForm, setCourseForm] = useState({ code: "", title: "" });
    const [attendanceForm, setAttendanceForm] = useState({
        studentId: "",
        courseId: "",
        date: new Date().toISOString().split("T")[0],
        status: AttendanceStatus.PRESENT,
        note: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [studentsRes, coursesRes, attendanceRes] = await Promise.all([
                api.student.getAll(),
                api.course.getAll(),
                api.attendance.getAll(),
            ]);
            setStudents(studentsRes.data);
            setCourses(coursesRes.data);
            setAttendance(attendanceRes.data);
        } catch (err: any) {
            setError(err.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.student.create(studentForm);
            setStudentForm({ name: "", email: "", grade: "" });
            setShowStudentForm(false);
            loadData();
        } catch (err: any) {
            alert("Failed to create student: " + err.message);
        }
    };

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.course.create(courseForm);
            setCourseForm({ code: "", title: "" });
            setShowCourseForm(false);
            loadData();
        } catch (err: any) {
            alert("Failed to create course: " + err.message);
        }
    };

    const handleCreateAttendance = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.attendance.create(attendanceForm);
            setAttendanceForm({
                studentId: "",
                courseId: "",
                date: new Date().toISOString().split("T")[0],
                status: AttendanceStatus.PRESENT,
                note: "",
            });
            setShowAttendanceForm(false);
            loadData();
        } catch (err: any) {
            alert("Failed to create attendance: " + err.message);
        }
    };

    const handleDeleteStudent = async (id: string) => {
        if (confirm("Are you sure you want to delete this student?")) {
            try {
                await api.student.delete(id);
                loadData();
            } catch (err: any) {
                alert("Failed to delete student: " + err.message);
            }
        }
    };

    const handleDeleteCourse = async (id: string) => {
        if (confirm("Are you sure you want to delete this course?")) {
            try {
                await api.course.delete(id);
                loadData();
            } catch (err: any) {
                alert("Failed to delete course: " + err.message);
            }
        }
    };

    const handleDeleteAttendance = async (id: string) => {
        if (confirm("Are you sure you want to delete this attendance record?")) {
            try {
                await api.attendance.delete(id);
                loadData();
            } catch (err: any) {
                alert("Failed to delete attendance: " + err.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
                    <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error Loading Data</h3>
                    <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
                    <button
                        onClick={loadData}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Students"
                    value={students.length}
                    icon="👥"
                    gradient="from-blue-500 to-cyan-500"
                />
                <StatCard
                    title="Total Courses"
                    value={courses.length}
                    icon="📚"
                    gradient="from-purple-500 to-pink-500"
                />
                <StatCard
                    title="Attendance Records"
                    value={attendance.length}
                    icon="✓"
                    gradient="from-green-500 to-emerald-500"
                />
            </div>

            {/* Tabs */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex space-x-2 bg-white dark:bg-slate-900 p-1 rounded-lg shadow-sm">
                    <TabButton
                        active={activeTab === "students"}
                        onClick={() => setActiveTab("students")}
                    >
                        Students
                    </TabButton>
                    <TabButton
                        active={activeTab === "courses"}
                        onClick={() => setActiveTab("courses")}
                    >
                        Courses
                    </TabButton>
                    <TabButton
                        active={activeTab === "attendance"}
                        onClick={() => setActiveTab("attendance")}
                    >
                        Attendance
                    </TabButton>
                </div>

                <button
                    onClick={() => {
                        if (activeTab === "students") setShowStudentForm(true);
                        if (activeTab === "courses") setShowCourseForm(true);
                        if (activeTab === "attendance") setShowAttendanceForm(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                    <span>+</span>
                    <span>Add New</span>
                </button>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
                {activeTab === "students" && (
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {students.length === 0 ? (
                            <EmptyState message="No students found. Add your first student!" />
                        ) : (
                            students.map((student) => (
                                <div
                                    key={student.id}
                                    className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {student.name}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {student.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                                            Grade {student.grade}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteStudent(student.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "courses" && (
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {courses.length === 0 ? (
                            <EmptyState message="No courses found. Add your first course!" />
                        ) : (
                            courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                            📚
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Code: {course.code}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCourse(course.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "attendance" && (
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {attendance.length === 0 ? (
                            <EmptyState message="No attendance records found. Add your first record!" />
                        ) : (
                            attendance.map((record) => {
                                const student = students.find((s) => s.id === record.studentId);
                                const course = courses.find((c) => c.id === record.courseId);
                                return (
                                    <div
                                        key={record.id}
                                        className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <StatusBadge status={record.status} />
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                                    {student?.name || "Unknown Student"}
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {course?.title || "Unknown Course"} • {record.date}
                                                </p>
                                                {record.note && (
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                        Note: {record.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteAttendance(record.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showStudentForm && (
                <Modal onClose={() => setShowStudentForm(false)} title="Add New Student">
                    <form onSubmit={handleCreateStudent} className="space-y-4">
                        <Input
                            label="Name"
                            value={studentForm.name}
                            onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={studentForm.email}
                            onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Grade"
                            value={studentForm.grade}
                            onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                            required
                        />
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            Create Student
                        </button>
                    </form>
                </Modal>
            )}

            {showCourseForm && (
                <Modal onClose={() => setShowCourseForm(false)} title="Add New Course">
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                        <Input
                            label="Course Code"
                            value={courseForm.code}
                            onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                            required
                        />
                        <Input
                            label="Course Title"
                            value={courseForm.title}
                            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                            required
                        />
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            Create Course
                        </button>
                    </form>
                </Modal>
            )}

            {showAttendanceForm && (
                <Modal onClose={() => setShowAttendanceForm(false)} title="Add Attendance Record">
                    <form onSubmit={handleCreateAttendance} className="space-y-4">
                        <Select
                            label="Student"
                            value={attendanceForm.studentId}
                            onChange={(e) =>
                                setAttendanceForm({ ...attendanceForm, studentId: e.target.value })
                            }
                            required
                        >
                            <option value="">Select a student</option>
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label="Course"
                            value={attendanceForm.courseId}
                            onChange={(e) =>
                                setAttendanceForm({ ...attendanceForm, courseId: e.target.value })
                            }
                            required
                        >
                            <option value="">Select a course</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.title}
                                </option>
                            ))}
                        </Select>
                        <Input
                            label="Date"
                            type="date"
                            value={attendanceForm.date}
                            onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                            required
                        />
                        <Select
                            label="Status"
                            value={attendanceForm.status}
                            onChange={(e) =>
                                setAttendanceForm({
                                    ...attendanceForm,
                                    status: e.target.value as AttendanceStatus,
                                })
                            }
                            required
                        >
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LATE">Late</option>
                            <option value="EXCUSED">Excused</option>
                        </Select>
                        <Input
                            label="Note (Optional)"
                            value={attendanceForm.note}
                            onChange={(e) => setAttendanceForm({ ...attendanceForm, note: e.target.value })}
                        />
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            Create Attendance
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
}

// Components
function StatCard({
    title,
    value,
    icon,
    gradient,
}: {
    title: string;
    value: number;
    icon: string;
    gradient: string;
}) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
                </div>
                <div
                    className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${active
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
        >
            {children}
        </button>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-500 dark:text-slate-400">{message}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
    const styles = {
        PRESENT: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
        ABSENT: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        LATE: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
        EXCUSED: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    };

    return (
        <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]} whitespace-nowrap`}
        >
            {status}
        </div>
    );
}

function Modal({
    onClose,
    title,
    children,
}: {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

function Input({
    label,
    type = "text",
    value,
    onChange,
    required = false,
}: {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
        </div>
    );
}

function Select({
    label,
    value,
    onChange,
    required = false,
    children,
}: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {label}
            </label>
            <select
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
                {children}
            </select>
        </div>
    );
}
