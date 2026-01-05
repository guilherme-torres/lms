import { Repository } from "../../core/utils/abstract.ts";
import type {
    CertificateFullData,
    CourseData,
    CreateCourseData,
    CreateLessonData,
    LessonData
} from "./types.ts";

export class LmsRepository extends Repository {
    createCourseDB({ slug, title, description, lessons, hours }: CreateCourseData) {
        return this.db.query(`
            INSERT OR IGNORE INTO "courses"
            ("slug", "title", "description", "lessons", "hours")
            VALUES
            (?, ?, ?, ?, ?)
        `).run(slug, title, description, lessons, hours)
    }

    listCoursesDB() {
        return this.db.query(
            `SELECT * FROM "courses" ORDER BY "created" ASC LIMIT 100`
        ).all() as CourseData[]
    }

    findCourseBySlugDB(slug: string) {
        return this.db.query(`
            SELECT * FROM "courses" WHERE "slug" = ?
        `).get(slug) as CourseData | undefined
    }

    createLessonDB({ courseSlug, slug, title, seconds, video, description, order, free }: CreateLessonData) {
        return this.db.query(`
            INSERT OR IGNORE INTO "lessons"
            ("course_id", "slug", "title", "seconds", "video", "description", "order", "free")
            VALUES
            ((SELECT "id" from "courses" WHERE "slug" = ?), ?, ?, ?, ?, ?, ?, ?)
        `).run(courseSlug, slug, title, seconds, video, description, order, free)
    }

    findLessonsByCourseSlugDB(courseSlug: string) {
        return this.db.query(`
            SELECT * FROM "lessons" WHERE "course_id" = (
                SELECT "id" FROM "courses" WHERE "slug" = ?
            ) ORDER BY "order" ASC
        `).all(courseSlug) as LessonData[]
    }

    findLessonById(id: number) {
        return this.db.query(`
            SELECT * FROM "lessons" WHERE "id" = ?
        `).get(id) as LessonData | undefined
    }

    findLessonByCourseSlugAndLessonSlug(courseSlug: string, lessonSlug: string) {
        return this.db.query(`
            SELECT * FROM "lessons" WHERE "course_id" = (
                SELECT "id" FROM "courses" WHERE "slug" = ?
            ) AND "slug" = ?
        `).get(courseSlug, lessonSlug) as LessonData | undefined
    }

    selectLessonNav(courseSlug: string, lessonSlug: string) {
        return this.db.query(`
            SELECT "slug" FROM "lesson_nav" WHERE "course_id" = (
                SELECT "id" FROM "courses" WHERE "slug" = ?
            ) AND "current_slug" = ?
        `).all(courseSlug, lessonSlug) as { slug: string }[]
    }

    insertLessonCompleted(userId: number, courseId: number, lessonId: number) {
        return this.db.query(`
            INSERT OR IGNORE INTO "lessons_completed"
            ("user_id", "course_id", "lesson_id")
            VALUES
            (?, ?, ?)
        `).run(userId, courseId, lessonId)
    }

    selectLessonCompleted(userId: number, lessonId: number) {
        return this.db.query(`
            SELECT "completed" FROM "lessons_completed"
            WHERE "user_id" = ? AND "lesson_id" = ?
        `).get(userId, lessonId) as { completed: string } | undefined
    }

    selectLessonsCompleted(userId: number, courseId: number) {
        return this.db.query(`
            SELECT "lesson_id", "completed" FROM "lessons_completed"
            WHERE "user_id" = ? AND "course_id" = ?
        `).all(userId, courseId) as { lesson_id: number, completed: string }[]
    }

    deleteLessonsCompleted(userId: number, courseId: number) {
        return this.db.query(`
            DELETE FROM "lessons_completed"
            WHERE "user_id" = ? AND "course_id" = ?
        `).run(userId, courseId)
    }

    selectProgress(userId: number, courseId: number) {
        return this.db.query(`
            SELECT "l"."id", "lc"."completed" FROM
            "lessons" as "l"
            LEFT JOIN
            "lessons_completed" as "lc"
            ON "l"."id" = "lc"."lesson_id" AND "lc"."user_id" = ?
            WHERE "l"."course_id" = ?
        `).all(userId, courseId) as { id: number, completed: string }[]
    }

    insertCertificate(userId: number, courseId: number) {
        return this.db.query(`
            INSERT OR IGNORE INTO "certificates"
            ("user_id", "course_id")
            VALUES (?, ?)
            RETURNING "id"
        `).get(userId, courseId) as { id: string } | undefined
    }

    selectCertificates(userId: number) {
        return this.db.query(`
            SELECT * FROM "certificates_full"
            WHERE "user_id" = ?
            ORDER BY "completed" DESC LIMIT 100
        `).all(userId) as CertificateFullData[]
    }

    findCertificateById(id: string) {
        return this.db.query(`
            SELECT * FROM "certificates_full"
            WHERE "id" = ?
        `).get(id) as CertificateFullData | undefined
    }
}