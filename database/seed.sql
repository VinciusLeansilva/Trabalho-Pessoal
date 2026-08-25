-- =============================================================================
-- EDUMATRIX ERP EDUCACIONAL - INITIAL SEED DATA (POSTGRESQL)
-- =============================================================================

-- 1. USERS (Password for all demo users: 'professor123' / 'admin123' / 'aluno123')
-- Bcrypt Hash for password123 / professor123: $2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q
-- (In local mode, the backend validates demo credentials directly)

INSERT INTO "User" ("id", "email", "passwordHash", "firstName", "lastName", "role") VALUES
('demo-admin-id', 'admin@edumatrix.com', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Administrador', 'Geral', 'ADMIN'),
('demo-teacher-id', 'professor@edumatrix.com', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Carlos', 'Santos', 'TEACHER'),
('teacher-2', 'ana.lima@edumatrix.com', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Ana', 'Lima', 'TEACHER'),
('teacher-3', 'roberto.souza@edumatrix.com', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Roberto', 'Souza', 'TEACHER'),
('demo-student-id', 'joao.silva@aluno.edu.br', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'João', 'Silva', 'STUDENT'),
('student-2', 'maria.santos@aluno.edu.br', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Maria', 'Santos', 'STUDENT'),
('student-3', 'pedro.oliveira@aluno.edu.br', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Pedro', 'Oliveira', 'STUDENT'),
('student-4', 'lucas.costa@aluno.edu.br', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Lucas', 'Costa', 'STUDENT'),
('student-5', 'beatriz.lima@aluno.edu.br', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Beatriz', 'Lima', 'STUDENT'),
('student-6', 'gabriel.souza@aluno.edu.br', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Gabriel', 'Souza', 'STUDENT'),
('student-7', 'julia.ferreira@aluno.edu.br', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Julia', 'Ferreira', 'STUDENT'),
('student-8', 'matheus.rodrigues@aluno.edu.br', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Matheus', 'Rodrigues', 'STUDENT'),
('student-9', 'larissa.almeida@aluno.edu.br', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Larissa', 'Almeida', 'STUDENT'),
('student-10', 'felipe.carvalho@aluno.edu.br', '$2a$10$wN31M7uXq7u6E8c90I5M6e1T6B9iV5p3q4g8h9j0k1l2m3n4o5p6q', 'Felipe', 'Carvalho', 'STUDENT');

-- 2. TEACHERS & STUDENTS PROFILES
INSERT INTO "Teacher" ("id", "userId", "specialization", "hireDate") VALUES
('teacher-prof-1', 'demo-teacher-id', 'Matemática e Física', '2024-02-01'),
('teacher-prof-2', 'teacher-2', 'Química e Biologia', '2024-02-01'),
('teacher-prof-3', 'teacher-3', 'História e Geografia', '2024-02-01');

INSERT INTO "Student" ("id", "userId", "enrollmentNo") VALUES
('student-prof-1', 'demo-student-id', '2026001'),
('student-prof-2', 'student-2', '2026002'),
('student-prof-3', 'student-3', '2026003'),
('student-prof-4', 'student-4', '2026004'),
('student-prof-5', 'student-5', '2026005'),
('student-prof-6', 'student-6', '2026006'),
('student-prof-7', 'student-7', '2026007'),
('student-prof-8', 'student-8', '2026008'),
('student-prof-9', 'student-9', '2026009'),
('student-prof-10', 'student-10', '2026010');

-- 3. CLASSES
INSERT INTO "Class" ("id", "name", "academicYear", "teacherId") VALUES
('class-1', '1º Ano A - Ensino Médio', '2026', 'teacher-prof-1'),
('class-2', '2º Ano A - Ensino Médio', '2026', 'teacher-prof-1'),
('class-3', '2º Ano B - Ensino Médio', '2026', 'teacher-prof-1'),
('class-4', '3º Ano A - Terceirão Pré-Vestibular', '2026', 'teacher-prof-1'),
('class-5', '1º Ano B - Ensino Médio', '2026', 'teacher-prof-2');

-- 4. CLASS ENROLLMENTS
INSERT INTO "ClassStudent" ("id", "classId", "studentId") VALUES
('cs-1', 'class-2', 'student-prof-1'),
('cs-2', 'class-2', 'student-prof-2'),
('cs-3', 'class-2', 'student-prof-3'),
('cs-4', 'class-2', 'student-prof-4'),
('cs-5', 'class-2', 'student-prof-5'),
('cs-6', 'class-1', 'student-prof-6'),
('cs-7', 'class-1', 'student-prof-7'),
('cs-8', 'class-3', 'student-prof-8'),
('cs-9', 'class-4', 'student-prof-9'),
('cs-10', 'class-4', 'student-prof-10');

-- 5. SUBJECTS
INSERT INTO "Subject" ("id", "name", "area", "description") VALUES
('subj-mat', 'Matemática', 'MATHEMATICS', 'Álgebra linear, cálculo, matrizes, geometria e trigonometria.'),
('subj-fis', 'Física', 'PHYSICS', 'Mecânica clássica, termodinâmica, óptica e eletromagnetismo.'),
('subj-qui', 'Química', 'CHEMISTRY', 'Química geral, físico-química, estequiometria e química orgânica.'),
('subj-bio', 'Biologia', 'BIOLOGY', 'Genética, citologia, ecologia e evolução.'),
('subj-his', 'História', 'HISTORY', 'História do Brasil e História Geral.'),
('subj-geo', 'Geografia', 'GEOGRAPHY', 'Geopolítica, cartografia, clima e relevo.'),
('subj-por', 'Língua Portuguesa', 'PORTUGUESE', 'Gramática, literatura brasileira e redação.'),
('subj-ing', 'Língua Inglesa', 'ENGLISH', 'Leitura, gramática e conversação em inglês.'),
('subj-fil', 'Filosofia', 'PHILOSOPHY', 'Epistemologia, ética e história do pensamento.'),
('subj-soc', 'Sociologia', 'SOCIOLOGY', 'Estruturas sociais, cultura, cidadania e trabalho.');

-- 6. TOPICS & SUBTOPICS (MATHEMATICS & PHYSICS)
INSERT INTO "Topic" ("id", "subjectId", "name", "description", "order") VALUES
('topic-matrizes', 'subj-mat', 'Matrizes e Determinantes', 'Definições, operações, propriedades e sistemas lineares.', 1),
('topic-funcoes', 'subj-mat', 'Funções e Álgebra', 'Funções de 1º e 2º grau, gráficos e raízes.', 2),
('topic-mecanica', 'subj-fis', 'Cinemática e Dinâmica', 'Movimento uniforme, MRUV e Leis de Newton.', 1);

INSERT INTO "Subtopic" ("id", "topicId", "name", "description", "order") VALUES
('sub-mat-ops', 'topic-matrizes', 'Operações com Matrizes', 'Adição, multiplicação por escalar e multiplicação de matrizes.', 1),
('sub-mat-det', 'topic-matrizes', 'Determinantes e Regra de Sarrus', 'Cálculo de determinantes 2x2 e 3x3.', 2),
('sub-fun-quad', 'topic-funcoes', 'Função Quadrática (2º Grau)', 'Fórmula de Bhaskara, discriminante delta e vértices.', 1),
('sub-fis-mruv', 'topic-mecanica', 'Movimento Uniformemente Variado (MRUV)', 'Função horária da velocidade e Equação de Torricelli.', 1);

-- 7. FORMULAS
INSERT INTO "Formula" ("id", "subtopicId", "name", "latexCode", "description") VALUES
('form-det2', 'sub-mat-det', 'Determinante de Matriz 2x2', '\det(A) = a_{11}a_{22} - a_{12}a_{21}', 'Produto da diagonal principal menos produto da secundária.'),
('form-sarrus', 'sub-mat-det', 'Regra de Sarrus (3x3)', '\det(A) = (aei + bfg + cdh) - (ceg + bdi + afh)', 'Expansão de determinante de ordem 3.'),
('form-bhaskara', 'sub-fun-quad', 'Fórmula de Bhaskara', 'x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}', 'Determinação das raízes reais da equação do 2º grau.'),
('form-torricelli', 'sub-fis-mruv', 'Equação de Torricelli', 'v^2 = v_0^2 + 2a\Delta s', 'Relação entre velocidade, aceleração e deslocamento sem o tempo.');

-- 8. EXERCISES & SOLUTIONS
INSERT INTO "Exercise" ("id", "subtopicId", "title", "statement", "type", "difficulty", "correctAnswer") VALUES
('ex-1', 'sub-mat-det', 'Determinante 2x2', 'Dada a matriz A = [[3, 5], [2, 7]], calcule o determinante det(A).', 'OPEN', 'EASY', '11'),
('ex-2', 'sub-fun-quad', 'Raízes da Equação', 'Encontre as raízes da equação x² - 5x + 6 = 0.', 'MULTIPLE_CHOICE', 'MEDIUM', 'x = 2 e x = 3'),
('ex-3', 'sub-fis-mruv', 'Frenagem de Veículo', 'Um carro a 20 m/s desacelera a 4 m/s². Qual a distância percorrida até parar?', 'OPEN', 'MEDIUM', '50 m');

INSERT INTO "Solution" ("id", "exerciseId", "content", "isCorrect") VALUES
('sol-1', 'ex-1', 'det(A) = (3 * 7) - (5 * 2) = 21 - 10 = 11.', TRUE),
('sol-2', 'ex-2', 'Delta = (-5)^2 - 4(1)(6) = 25 - 24 = 1. x = (5 +- 1)/2 => x1 = 3, x2 = 2.', TRUE),
('sol-3', 'ex-3', 'v^2 = v0^2 + 2a ds => 0 = 400 + 2(-4) ds => 8 ds = 400 => ds = 50 metros.', TRUE);

-- 9. FOLDERS & FILES (PROFESSOR DRIVE)
INSERT INTO "Folder" ("id", "name", "parentId", "teacherId") VALUES
('folder-root', 'Meu Repositório', NULL, 'teacher-prof-1'),
('folder-provas', 'Provas e Avaliações', 'folder-root', 'teacher-prof-1'),
('folder-slides', 'Apresentações de Aulas', 'folder-root', 'teacher-prof-1');

INSERT INTO "File" ("id", "folderId", "name", "url", "size", "type") VALUES
('file-1', 'folder-provas', 'Prova_Bimestral_Matrizes.docx', '/uploads/prova1.docx', 512000, 'DOCX'),
('file-2', 'folder-slides', 'Slides_Matrizes_2026.pptx', '/uploads/slides1.pptx', 12582912, 'PPTX');

INSERT INTO "FileVersion" ("id", "fileId", "version", "url") VALUES
('fv-1', 'file-1', 1, '/uploads/prova1_v1.docx'),
('fv-2', 'file-1', 2, '/uploads/prova1_v2.docx'),
('fv-3', 'file-1', 3, '/uploads/prova1_v3_final.docx');

-- 10. PRESENTATIONS & SLIDES (PROJECTOR MODE)
INSERT INTO "Presentation" ("id", "title", "teacherId") VALUES
('pres-1', 'Aula de Matrizes e Determinantes', 'teacher-prof-1');

INSERT INTO "PresentationSlide" ("id", "presentationId", "order", "type", "content") VALUES
('slide-1', 'pres-1', 1, 'TITLE', '{"title": "MATRIZES E DETERMINANTES", "subtitle": "Prof. Carlos Santos • 2º Ano A", "background": "#3B82F6"}'),
('slide-2', 'pres-1', 2, 'CONTENT', '{"title": "Conceitos Fundamentais", "content": "Matrizes são tabelas m x n amplamente utilizadas em computação gráfica e IA."}'),
('slide-3', 'pres-1', 3, 'FORMULA', '{"title": "Determinante 2x2", "formula": "\\det(A) = ad - bc"}'),
('slide-4', 'pres-1', 4, 'RESOLUTION', '{"title": "Resolução Passo a Passo", "steps": ["det(A) = (3 * 7) - (5 * 2)", "det(A) = 21 - 10", "det(A) = 11"]}');

-- 11. QUESTION BANK
INSERT INTO "QuestionBank" ("id", "subjectId", "statement", "type", "difficulty", "correctAnswer", "explanation") VALUES
('qb-1', 'subj-mat', 'Calcule o determinante da matriz A = [[2, 3], [1, 4]].', 'OPEN', 'EASY', '5', 'det(A) = 2*4 - 3*1 = 8 - 3 = 5.'),
('qb-2', 'subj-mat', 'Resolva a equação 2x + 8 = 20.', 'OPEN', 'EASY', 'x = 6', '2x = 20 - 8 => 2x = 12 => x = 6.'),
('qb-3', 'subj-fis', 'Um bloco de 5 kg sofre aceleração de 3 m/s². Qual a força resultante?', 'OPEN', 'EASY', '15 N', 'F = m * a = 5 * 3 = 15 Newtons.');

-- 12. ASSIGNMENTS, SUBMISSIONS & GRADES
INSERT INTO "Assignment" ("id", "title", "description", "classId", "dueDate") VALUES
('assign-1', '[Lista] Matrizes e Determinantes', 'Lista de 4 exercícios para fixação do 3º Bimestre.', 'class-2', '2026-08-30');

INSERT INTO "AssignmentQuestion" ("id", "assignmentId", "exerciseId", "order", "points") VALUES
('aq-1', 'assign-1', 'ex-1', 1, 2.5),
('aq-2', 'assign-1', 'ex-2', 2, 2.5);

INSERT INTO "Grade" ("id", "studentId", "term", "value", "comments") VALUES
('gr-1', 'student-prof-1', '3º Bimestre', 9.0, 'Excelente rendimento na Prova 1 e Atividades.'),
('gr-2', 'student-prof-2', '3º Bimestre', 8.5, 'Ótima participação e entrega pontual.'),
('gr-3', 'student-prof-3', '3º Bimestre', 8.0, 'Bom desempenho geral.'),
('gr-4', 'student-prof-4', '3º Bimestre', 7.5, 'Aprovado na média bimestral.'),
('gr-5', 'student-prof-5', '3º Bimestre', 9.5, 'Desempenho exemplar.');

-- 13. LESSON PLANS
INSERT INTO "LessonPlan" ("id", "teacherId", "title", "content", "date") VALUES
('lp-1', 'teacher-prof-1', 'Matrizes: Conceitos e Operações Fundamentais', '{"objective": "Compreender a representação m x n e operações", "theory": "Definição de matriz m x n e transposta", "examples": "Cálculo de determinante 2x2"}', '2026-08-25');
