import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/route-error.ts";
import { LmsRepository } from "./repository.ts";
import { lmsTables } from "./tables.ts";

export class LmsApi extends Api {
    repository = new LmsRepository(this.db)

    handlers = {
        createCourse: (req, res) => {
            const {
                slug, title, description, lessons, hours
            } = req.body
            const created = this.repository.createCourseDB({
                slug, title, description, lessons, hours
            })
            if (created.changes === 0) {
                throw new RouteError(400, "erro ao criar curso")
            }
            res.status(201).json({ message: "curso criado com sucesso" })
        },

        listCourses: (req, res) => {
            const courses = this.repository.listCoursesDB()
            res.status(200).json(courses)
        },

        getCourse: (req, res) => {
            const { slug } = req.params
            const course = this.repository.findCourseBySlugDB(slug)
            if (!course) {
                throw new RouteError(400, "erro ao buscar curso")
            }
            const lessons = this.repository.findLessonsByCourseSlugDB(course.slug)
            const userId = 1
            let completed: { lesson_id: number, completed: string }[] = []
            if (userId) {
                completed = this.repository.selectLessonsCompleted(userId, course.id)
            }
            res.status(200).json({ course, lessons, completed })
        },

        createLesson: (req, res) => {
            const {
                courseSlug, slug, title, seconds, video, description, order, free
            } = req.body
            const created = this.repository.createLessonDB({
                courseSlug, slug, title, seconds, video, description, order, free
            })
            if (created.changes === 0) {
                throw new RouteError(400, "erro ao criar aula")
            }
            res.status(201).json({ message: "aula criada com sucesso" })
        },

        getLesson: (req, res) => {
            const { courseSlug, lessonSlug } = req.params
            const lesson = this.repository.findLessonByCourseSlugAndLessonSlug(courseSlug, lessonSlug)
            if (!lesson) {
                throw new RouteError(400, "erro ao buscar aula")
            }
            const nav = this.repository.selectLessonNav(courseSlug, lessonSlug)
            const currentLessonIndex = nav.findIndex(navLesson => navLesson.slug === lesson.slug)
            const prev = currentLessonIndex === 0 ? null : nav.at(currentLessonIndex - 1)?.slug
            const next = nav.at(currentLessonIndex + 1)?.slug ?? null
            const userId = 1
            let completed = ""
            if (userId) {
                const lessonCompleted = this.repository.selectLessonCompleted(userId, lesson.id)
                if (lessonCompleted) completed = lessonCompleted.completed
            }
            res.status(200).json({ ...lesson, prev, next, completed })
        },

        completeLesson: (req, res) => {
            const { courseId, lessonId } = req.body
            const userId = 1
            const lessonExists = this.repository.findLessonById(lessonId)
            if (!lessonExists) {
                throw new RouteError(400, "aula não encontrada")
            }
            if (lessonExists.course_id !== courseId) {
                throw new RouteError(400, "esta aula não pertence a este curso")
            }
            const result = this.repository.insertLessonCompleted(userId, courseId, lessonId)
            if (result.changes === 0) {
                throw new RouteError(400, "erro ao completar aula")
            }
            const progress = this.repository.selectProgress(userId, courseId)
            const incompletedLessons = progress.filter(lesson => !lesson.completed)
            const completedPercentage = Math.round((1 - incompletedLessons.length / progress.length) * 100)
            if (progress.length > 0 && incompletedLessons.length === 0) {
                const certificate = this.repository.insertCertificate(userId, courseId)
                if (!certificate) {
                    throw new RouteError(400, "erro ao gerar certificado")
                }
                return res.status(201).json({
                    certificate: certificate.id,
                    progress: completedPercentage
                })
            }
            res.status(201).json({
                certificate: null,
                progress: completedPercentage
            })
        },

        resetCourse: (req, res) => {
            const { courseId } = req.body
            const userId = 1
            const result = this.repository.deleteLessonsCompleted(userId, courseId)
            if (result.changes === 0) {
                throw new RouteError(400, "erro ao resetar curso")
            }
            res.status(200).json({ title: "curso resetado" })
        },

        listCertificates: (req, res) => {
            const userId = 1
            const certificates = this.repository.selectCertificates(userId)
            res.status(200).json(certificates)
        },

        getCertificate: (req, res) => {
            const { id } = req.params
            const certificate = this.repository.findCertificateById(id)
            if (!certificate) {
                throw new RouteError(404, "certificado não encontrado")
            }
            res.status(200).json(certificate)
        }
    } satisfies Api['handlers']

    tables() {
        this.db.exec(lmsTables)
    }

    routes() {
        this.router.post("/lms/courses", this.handlers.createCourse)
        this.router.get("/lms/courses", this.handlers.listCourses)
        this.router.get("/lms/courses/:slug", this.handlers.getCourse)
        this.router.delete("/lms/courses/reset", this.handlers.resetCourse)
        this.router.post("/lms/lessons", this.handlers.createLesson)
        this.router.get("/lms/lessons/:courseSlug/:lessonSlug", this.handlers.getLesson)
        this.router.get("/lms/certificates", this.handlers.listCertificates)
        this.router.get("/lms/certificates/:id", this.handlers.getCertificate)
    }
}