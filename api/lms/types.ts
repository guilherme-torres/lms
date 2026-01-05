export type CourseData = {
    id: number
    slug: string
    title: string
    description: string
    lessons: number
    hours: number
    created: string
}

export type CreateCourseData = Omit<CourseData, "id" | "created">

export type LessonData = {
    id: number
    course_id: number
    slug: string
    title: string
    seconds: number
    order: number
    free: number
    description: string
    video: string
    created: string
}

export type CreateLessonData =
    Omit<LessonData, "id" | "course_id" | "created">
    & { courseSlug: string }

export type CertificateFullData = {
    id: string
    name: string
    title: string
    hours: number
    lessons: number
    completed: string
}