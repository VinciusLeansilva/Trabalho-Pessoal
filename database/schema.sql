-- =============================================================================
-- EDUMATRIX ERP EDUCACIONAL - DATABASE SCHEMA (POSTGRESQL)
-- =============================================================================

-- Drop tables in reverse dependency order if needed
DROP TABLE IF EXISTS "QuestionTag" CASCADE;
DROP TABLE IF EXISTS "QuestionBank" CASCADE;
DROP TABLE IF EXISTS "AuditLog" CASCADE;
DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "EntityTag" CASCADE;
DROP TABLE IF EXISTS "Tag" CASCADE;
DROP TABLE IF EXISTS "Favorite" CASCADE;
DROP TABLE IF EXISTS "CalendarEvent" CASCADE;
DROP TABLE IF EXISTS "LessonPlan" CASCADE;
DROP TABLE IF EXISTS "Attendance" CASCADE;
DROP TABLE IF EXISTS "Grade" CASCADE;
DROP TABLE IF EXISTS "Answer" CASCADE;
DROP TABLE IF EXISTS "Submission" CASCADE;
DROP TABLE IF EXISTS "AssignmentQuestion" CASCADE;
DROP TABLE IF EXISTS "Assignment" CASCADE;
DROP TABLE IF EXISTS "PresentationSlide" CASCADE;
DROP TABLE IF EXISTS "Presentation" CASCADE;
DROP TABLE IF EXISTS "FileVersion" CASCADE;
DROP TABLE IF EXISTS "File" CASCADE;
DROP TABLE IF EXISTS "Folder" CASCADE;
DROP TABLE IF EXISTS "Material" CASCADE;
DROP TABLE IF EXISTS "Solution" CASCADE;
DROP TABLE IF EXISTS "StepMarker" CASCADE;
DROP TABLE IF EXISTS "ExerciseStep" CASCADE;
DROP TABLE IF EXISTS "Exercise" CASCADE;
DROP TABLE IF EXISTS "Example" CASCADE;
DROP TABLE IF EXISTS "FormulaExample" CASCADE;
DROP TABLE IF EXISTS "Formula" CASCADE;
DROP TABLE IF EXISTS "LessonConcept" CASCADE;
DROP TABLE IF EXISTS "Lesson" CASCADE;
DROP TABLE IF EXISTS "Subtopic" CASCADE;
DROP TABLE IF EXISTS "Topic" CASCADE;
DROP TABLE IF EXISTS "Subject" CASCADE;
DROP TABLE IF EXISTS "ClassStudent" CASCADE;
DROP TABLE IF EXISTS "Class" CASCADE;
DROP TABLE IF EXISTS "Student" CASCADE;
DROP TABLE IF EXISTS "Teacher" CASCADE;
DROP TABLE IF EXISTS "RolePermission" CASCADE;
DROP TABLE IF EXISTS "UserRole" CASCADE;
DROP TABLE IF EXISTS "Permission" CASCADE;
DROP TABLE IF EXISTS "RoleModel" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop Enums
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "AttendanceStatus" CASCADE;
DROP TYPE IF EXISTS "DifficultyLevel" CASCADE;
DROP TYPE IF EXISTS "ExerciseType" CASCADE;
DROP TYPE IF EXISTS "FileType" CASCADE;
DROP TYPE IF EXISTS "SlideType" CASCADE;
DROP TYPE IF EXISTS "SubjectArea" CASCADE;

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'JUSTIFIED');
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');
CREATE TYPE "ExerciseType" AS ENUM ('MULTIPLE_CHOICE', 'OPEN', 'TRUE_FALSE', 'FILL_BLANK');
CREATE TYPE "FileType" AS ENUM ('PDF', 'DOCX', 'PPTX', 'XLSX', 'CSV', 'PNG', 'JPG', 'SVG', 'TXT', 'OTHER');
CREATE TYPE "SlideType" AS ENUM ('TITLE', 'CONTENT', 'FORMULA', 'EXERCISE', 'RESOLUTION', 'EXAMPLE', 'SUMMARY');
CREATE TYPE "SubjectArea" AS ENUM (
  'MATHEMATICS', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'HISTORY', 'GEOGRAPHY',
  'PORTUGUESE', 'ENGLISH', 'ARTS', 'PHYSICAL_EDUCATION', 'PHILOSOPHY', 'SOCIOLOGY', 'OTHER'
);

-- =============================================================================
-- 1. USERS, ROLES & AUTHENTICATION
-- =============================================================================

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'STUDENT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_user_email" ON "User"("email");

CREATE TABLE "RoleModel" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Permission" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "UserRole" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "roleId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_userrole_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_userrole_role" FOREIGN KEY ("roleId") REFERENCES "RoleModel"("id") ON DELETE CASCADE,
  CONSTRAINT "uq_userrole_user_role" UNIQUE ("userId", "roleId")
);

CREATE INDEX "idx_userrole_user" ON "UserRole"("userId");

CREATE TABLE "RolePermission" (
  "id" TEXT PRIMARY KEY,
  "roleId" TEXT NOT NULL,
  "permissionId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_rolepermission_role" FOREIGN KEY ("roleId") REFERENCES "RoleModel"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_rolepermission_permission" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE,
  CONSTRAINT "uq_rolepermission_role_perm" UNIQUE ("roleId", "permissionId")
);

CREATE INDEX "idx_rolepermission_role" ON "RolePermission"("roleId");

-- =============================================================================
-- 2. TEACHERS & STUDENTS
-- =============================================================================

CREATE TABLE "Teacher" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL,
  "specialization" TEXT,
  "hireDate" TIMESTAMP(3),
  CONSTRAINT "fk_teacher_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Student" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE NOT NULL,
  "enrollmentNo" TEXT UNIQUE NOT NULL,
  "enrollmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_student_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- =============================================================================
-- 3. CLASSES & ENROLLMENTS
-- =============================================================================

CREATE TABLE "Class" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "academicYear" TEXT NOT NULL,
  "teacherId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_class_teacher" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT
);

CREATE INDEX "idx_class_teacher" ON "Class"("teacherId");
CREATE INDEX "idx_class_academic_year" ON "Class"("academicYear");

CREATE TABLE "ClassStudent" (
  "id" TEXT PRIMARY KEY,
  "classId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_classstudent_class" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_classstudent_student" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
  CONSTRAINT "uq_classstudent" UNIQUE ("classId", "studentId")
);

CREATE INDEX "idx_classstudent_class" ON "ClassStudent"("classId");
CREATE INDEX "idx_classstudent_student" ON "ClassStudent"("studentId");

-- =============================================================================
-- 4. CURRICULUM: SUBJECTS, TOPICS & SUBTOPICS
-- =============================================================================

CREATE TABLE "Subject" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL,
  "area" "SubjectArea" NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Topic" (
  "id" TEXT PRIMARY KEY,
  "subjectId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_topic_subject" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_topic_subject" ON "Topic"("subjectId");

CREATE TABLE "Subtopic" (
  "id" TEXT PRIMARY KEY,
  "topicId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_subtopic_topic" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_subtopic_topic" ON "Subtopic"("topicId");

-- =============================================================================
-- 5. LESSONS & DIDACTIC CONCEPTS
-- =============================================================================

CREATE TABLE "Lesson" (
  "id" TEXT PRIMARY KEY,
  "classId" TEXT NOT NULL,
  "subjectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "duration" INTEGER NOT NULL,
  "content" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_lesson_class" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_lesson_subject" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT
);

CREATE INDEX "idx_lesson_class" ON "Lesson"("classId");
CREATE INDEX "idx_lesson_subject" ON "Lesson"("subjectId");
CREATE INDEX "idx_lesson_date" ON "Lesson"("date");

CREATE TABLE "LessonConcept" (
  "id" TEXT PRIMARY KEY,
  "lessonId" TEXT NOT NULL,
  "subtopicId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_lessonconcept_lesson" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_lessonconcept_subtopic" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE RESTRICT,
  CONSTRAINT "uq_lessonconcept" UNIQUE ("lessonId", "subtopicId")
);

-- =============================================================================
-- 6. FORMULAS, EXAMPLES & EXERCISES
-- =============================================================================

CREATE TABLE "Formula" (
  "id" TEXT PRIMARY KEY,
  "subtopicId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "latexCode" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_formula_subtopic" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_formula_subtopic" ON "Formula"("subtopicId");

CREATE TABLE "Example" (
  "id" TEXT PRIMARY KEY,
  "subtopicId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "solution" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_example_subtopic" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_example_subtopic" ON "Example"("subtopicId");

CREATE TABLE "FormulaExample" (
  "id" TEXT PRIMARY KEY,
  "formulaId" TEXT NOT NULL,
  "exampleId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_formulaexample_formula" FOREIGN KEY ("formulaId") REFERENCES "Formula"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_formulaexample_example" FOREIGN KEY ("exampleId") REFERENCES "Example"("id") ON DELETE CASCADE,
  CONSTRAINT "uq_formulaexample" UNIQUE ("formulaId", "exampleId")
);

CREATE TABLE "Exercise" (
  "id" TEXT PRIMARY KEY,
  "subtopicId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "statement" TEXT NOT NULL,
  "type" "ExerciseType" NOT NULL,
  "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'MEDIUM',
  "options" JSONB,
  "correctAnswer" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_exercise_subtopic" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_exercise_subtopic" ON "Exercise"("subtopicId");

CREATE TABLE "ExerciseStep" (
  "id" TEXT PRIMARY KEY,
  "exerciseId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  "formula" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_exercisestep_exercise" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_exercisestep_exercise" ON "ExerciseStep"("exerciseId");

CREATE TABLE "StepMarker" (
  "id" TEXT PRIMARY KEY,
  "stepId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "positionX" DOUBLE PRECISION,
  "positionY" DOUBLE PRECISION,
  "content" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_stepmarker_step" FOREIGN KEY ("stepId") REFERENCES "ExerciseStep"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_stepmarker_step" ON "StepMarker"("stepId");

CREATE TABLE "Solution" (
  "id" TEXT PRIMARY KEY,
  "exerciseId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isCorrect" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_solution_exercise" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_solution_exercise" ON "Solution"("exerciseId");

-- =============================================================================
-- 7. MATERIALS, FOLDERS & FILES (PROFESSOR DRIVE)
-- =============================================================================

CREATE TABLE "Material" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "teacherId" TEXT NOT NULL,
  "topicId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_material_teacher" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_material_topic" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL
);

CREATE INDEX "idx_material_teacher" ON "Material"("teacherId");
CREATE INDEX "idx_material_topic" ON "Material"("topicId");

CREATE TABLE "Folder" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "parentId" TEXT,
  "teacherId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_folder_teacher" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_folder_parent" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_folder_teacher" ON "Folder"("teacherId");
CREATE INDEX "idx_folder_parent" ON "Folder"("parentId");

CREATE TABLE "File" (
  "id" TEXT PRIMARY KEY,
  "folderId" TEXT,
  "materialId" TEXT,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "type" "FileType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_file_folder" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_file_material" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL
);

CREATE INDEX "idx_file_folder" ON "File"("folderId");
CREATE INDEX "idx_file_material" ON "File"("materialId");

CREATE TABLE "FileVersion" (
  "id" TEXT PRIMARY KEY,
  "fileId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_fileversion_file" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_fileversion_file" ON "FileVersion"("fileId");

-- =============================================================================
-- 8. PRESENTATIONS & SLIDES (PROJECTOR MODE)
-- =============================================================================

CREATE TABLE "Presentation" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "teacherId" TEXT NOT NULL,
  "lessonId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_presentation_teacher" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_presentation_lesson" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL
);

CREATE INDEX "idx_presentation_teacher" ON "Presentation"("teacherId");
CREATE INDEX "idx_presentation_lesson" ON "Presentation"("lessonId");

CREATE TABLE "PresentationSlide" (
  "id" TEXT PRIMARY KEY,
  "presentationId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "type" "SlideType" NOT NULL,
  "content" JSONB,
  "exampleId" TEXT,
  "exerciseId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_presentationslide_presentation" FOREIGN KEY ("presentationId") REFERENCES "Presentation"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_presentationslide_example" FOREIGN KEY ("exampleId") REFERENCES "Example"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_presentationslide_exercise" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL
);

CREATE INDEX "idx_presentationslide_presentation" ON "PresentationSlide"("presentationId");

-- =============================================================================
-- 9. ASSIGNMENTS, SUBMISSIONS & GRADES
-- =============================================================================

CREATE TABLE "Assignment" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "classId" TEXT NOT NULL,
  "dueDate" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_assignment_class" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_assignment_class" ON "Assignment"("classId");

CREATE TABLE "QuestionBank" (
  "id" TEXT PRIMARY KEY,
  "subjectId" TEXT NOT NULL,
  "statement" TEXT NOT NULL,
  "type" "ExerciseType" NOT NULL,
  "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'MEDIUM',
  "options" JSONB,
  "correctAnswer" TEXT,
  "explanation" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_questionbank_subject" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_questionbank_subject" ON "QuestionBank"("subjectId");

CREATE TABLE "AssignmentQuestion" (
  "id" TEXT PRIMARY KEY,
  "assignmentId" TEXT NOT NULL,
  "exerciseId" TEXT,
  "questionBankId" TEXT,
  "order" INTEGER NOT NULL,
  "points" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_assignmentquestion_assignment" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_assignmentquestion_exercise" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_assignmentquestion_questionbank" FOREIGN KEY ("questionBankId") REFERENCES "QuestionBank"("id") ON DELETE SET NULL
);

CREATE INDEX "idx_assignmentquestion_assignment" ON "AssignmentQuestion"("assignmentId");

CREATE TABLE "Submission" (
  "id" TEXT PRIMARY KEY,
  "assignmentId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "score" DOUBLE PRECISION,
  CONSTRAINT "fk_submission_assignment" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_submission_student" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
  CONSTRAINT "uq_submission" UNIQUE ("assignmentId", "studentId")
);

CREATE INDEX "idx_submission_student" ON "Submission"("studentId");

CREATE TABLE "Answer" (
  "id" TEXT PRIMARY KEY,
  "submissionId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isCorrect" BOOLEAN,
  "pointsEarned" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_answer_submission" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_answer_question" FOREIGN KEY ("questionId") REFERENCES "AssignmentQuestion"("id") ON DELETE CASCADE,
  CONSTRAINT "uq_answer" UNIQUE ("submissionId", "questionId")
);

CREATE INDEX "idx_answer_submission" ON "Answer"("submissionId");

CREATE TABLE "Grade" (
  "id" TEXT PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  "term" TEXT NOT NULL,
  "value" DOUBLE PRECISION NOT NULL,
  "comments" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_grade_student" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_grade_student" ON "Grade"("studentId");

CREATE TABLE "Attendance" (
  "id" TEXT PRIMARY KEY,
  "lessonId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "status" "AttendanceStatus" NOT NULL,
  "remarks" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_attendance_lesson" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_attendance_student" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
  CONSTRAINT "uq_attendance" UNIQUE ("lessonId", "studentId")
);

CREATE INDEX "idx_attendance_student" ON "Attendance"("studentId");

-- =============================================================================
-- 10. LESSON PLANS, CALENDAR, FAVORITES & AUDIT
-- =============================================================================

CREATE TABLE "LessonPlan" (
  "id" TEXT PRIMARY KEY,
  "teacherId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_lessonplan_teacher" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_lessonplan_teacher" ON "LessonPlan"("teacherId");

CREATE TABLE "CalendarEvent" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "location" TEXT,
  "isAllDay" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Favorite" (
  "id" TEXT PRIMARY KEY,
  "teacherId" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_favorite_teacher" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE,
  CONSTRAINT "uq_favorite" UNIQUE ("teacherId", "entityType", "entityId")
);

CREATE INDEX "idx_favorite_teacher" ON "Favorite"("teacherId");

CREATE TABLE "Tag" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL,
  "color" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "EntityTag" (
  "id" TEXT PRIMARY KEY,
  "tagId" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_entitytag_tag" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE,
  CONSTRAINT "uq_entitytag" UNIQUE ("tagId", "entityType", "entityId")
);

CREATE INDEX "idx_entitytag_tag" ON "EntityTag"("tagId");

CREATE TABLE "QuestionTag" (
  "id" TEXT PRIMARY KEY,
  "questionBankId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_questiontag_questionbank" FOREIGN KEY ("questionBankId") REFERENCES "QuestionBank"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_questiontag_tag" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE,
  CONSTRAINT "uq_questiontag" UNIQUE ("questionBankId", "tagId")
);

CREATE INDEX "idx_questiontag_questionbank" ON "QuestionTag"("questionBankId");

CREATE TABLE "Notification" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "link" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_notification_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_notification_user" ON "Notification"("userId");

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "details" JSONB,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_auditlog_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE INDEX "idx_auditlog_user" ON "AuditLog"("userId");
CREATE INDEX "idx_auditlog_entity" ON "AuditLog"("entityType", "entityId");
