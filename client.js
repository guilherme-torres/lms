const BASE_URL = "http://localhost:3000"

const courses = {
    html: {
        slug: "html-e-css",
        title: "HTML e CSS",
        description: "Curso de HTML e CSS para Iniciantes",
        lessons: 40,
        hours: 10,
    },
    javascript: {
        slug: "javascript-completo",
        title: "JavaScript Completo",
        description: "Curso completo de JavaScript",
        lessons: 80,
        hours: 20,
    },
};

const lessons = [
    {
        courseSlug: "html-e-css",
        slug: "tags-basicas",
        title: "Tags Básicas",
        seconds: 200,
        video: "/html/tags-basicas.mp4",
        description: "Aula sobre as Tags Básicas",
        order: 1,
        free: 1,
    },
    {
        courseSlug: "html-e-css",
        slug: "estrutura-do-documento",
        title: "Estrutura do Documento",
        seconds: 420,
        video: "/html/estrutura-do-documento.mp4",
        description: "Estrutura básica: <!DOCTYPE>, <html>, <head> e <body>.",
        order: 2,
        free: 1,
    },
    {
        courseSlug: "html-e-css",
        slug: "links-e-imagens",
        title: "Links e Imagens",
        seconds: 540,
        video: "/html/links-e-imagens.mp4",
        description: "Como usar <a> e <img>, caminhos relativos e absolutos.",
        order: 3,
        free: 0,
    },
    {
        courseSlug: "html-e-css",
        slug: "listas-e-tabelas",
        title: "Listas e Tabelas",
        seconds: 600,
        video: "/html/listas-e-tabelas.mp4",
        description: "Listas ordenadas/não ordenadas e estrutura básica de tabelas.",
        order: 4,
        free: 0,
    },
    {
        courseSlug: "html-e-css",
        slug: "formularios-basicos",
        title: "Formulários Básicos",
        seconds: 780,
        video: "/html/formularios-basicos.mp4",
        description: "Inputs, labels, selects e boas práticas de acessibilidade.",
        order: 5,
        free: 0,
    },
    {
        courseSlug: "html-e-css",
        slug: "semantica-e-acessibilidade",
        title: "Semântica e Acessibilidade",
        seconds: 660,
        video: "/html/semantica-e-acessibilidade.mp4",
        description: "Tags semânticas e acessibilidade para iniciantes.",
        order: 6,
        free: 0,
    },

    // JavaScript
    {
        courseSlug: "javascript-completo",
        slug: "introducao-e-variaveis",
        title: "Introdução e Variáveis",
        seconds: 480,
        video: "/javascript/introducao-e-variaveis.mp4",
        description: "Como o JS funciona, let/const e escopo.",
        order: 1,
        free: 1,
    },
    {
        courseSlug: "javascript-completo",
        slug: "tipos-e-operadores",
        title: "Tipos e Operadores",
        seconds: 540,
        video: "/javascript/tipos-e-operadores.mp4",
        description: "Tipos primitivos, objetos e operadores comuns.",
        order: 2,
        free: 1,
    },
    {
        courseSlug: "javascript-completo",
        slug: "funcoes-basico",
        title: "Funções (Básico)",
        seconds: 600,
        video: "/javascript/funcoes-basico.mp4",
        description: "Declaração, expressão, parâmetros e retorno.",
        order: 3,
        free: 0,
    },
    {
        courseSlug: "javascript-completo",
        slug: "manipulando-o-dom",
        title: "Manipulando o DOM",
        seconds: 660,
        video: "/javascript/manipulando-o-dom.mp4",
        description: "Selecionar, criar e alterar elementos com JS.",
        order: 4,
        free: 0,
    },
    {
        courseSlug: "javascript-completo",
        slug: "eventos-no-navegador",
        title: "Eventos no Navegador",
        seconds: 600,
        video: "/javascript/eventos-no-navegador.mp4",
        description: "addEventListener, propagação e preventDefault.",
        order: 5,
        free: 0,
    },
    {
        courseSlug: "javascript-completo",
        slug: "fetch-e-async-await",
        title: "Fetch e Async/Await",
        seconds: 720,
        video: "/javascript/fetch-e-async-await.mp4",
        description: "Requisições HTTP, Promises e fluxo assíncrono.",
        order: 6,
        free: 0,
    },
];

const functions = {
    async createCourse(verbose = false) {
        const response = await fetch(
            BASE_URL + "/lms/courses",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(courses.html)
            }
        )
        if (verbose) {
            console.log(response)
        }
        console.table(await response.json())
    },
    async listCourses(verbose = false) {
        const response = await fetch(BASE_URL + "/lms/courses")
        if (verbose) {
            console.log(response)
        }
        console.table(await response.json())
    },
    async getCourse(verbose = false) {
        const response = await fetch(BASE_URL + "/lms/courses/javascript-completo")
        if (verbose) {
            console.log(response)
        }
        console.log(await response.json())
    },
    async getLesson(verbose = false) {
        const response = await fetch(BASE_URL + "/lms/lessons/javascript-completo/tipos-e-operadores")
        if (verbose) {
            console.log(response)
        }
        console.log(await response.json())
    },
    async createLesson(verbose = false) {
        for (const lesson of lessons) {
            const response = await fetch(
                BASE_URL + "/lms/lessons",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(lesson)
                }
            )
            if (verbose) {
                console.log(response)
            }
            console.table(await response.json())
        }
    },
    async createUser(verbose = false) {
        const response = await fetch(
            BASE_URL + "/auth/users",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: "João da Silva",
                    username: "joao",
                    email: "joao@gmail.com",
                    password: "1234"
                })
            }
        )
        if (verbose) {
            console.log(response)
        }
        console.table(await response.json())
    },
    async completeLesson(verbose = false) {
        const response = await fetch(
            BASE_URL + "/lms/lessons/complete",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    courseId: 1,
                    lessonId: 1,
                })
            }
        )
        if (verbose) {
            console.log(response)
        }
        console.table(await response.json())
    },
    async resetCourse(verbose = false) {
        const response = await fetch(
            BASE_URL + "/lms/courses/reset",
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    courseId: 2
                })
            }
        )
        if (verbose) {
            console.log(response)
        }
        console.table(await response.json())
    },
    async listCertificates(verbose = false) {
        const response = await fetch(BASE_URL + "/lms/certificates")
        if (verbose) {
            console.log(response)
        }
        console.table(await response.json())
    },
    async getCertificate(verbose = false) {
        const response = await fetch(BASE_URL + "/lms/certificates/324f7d49127bba83")
        if (verbose) {
            console.log(response)
        }
        console.table(await response.json())
    },
}

const functionName = process.argv[2]
const functionsList = Object.keys(functions)

if (!functionsList.includes(functionName)) {
    console.log("esta função não foi definida!\n")
    console.log("lista de funções:")
    console.log("=================")
    for (const funcName of functionsList) {
        console.log(`- ${funcName}`)
    }
    process.exit(1)
}

if (process.argv.length === 4 && process.argv[3] === "-v") {
    functions[functionName](true) // modo verboso: mostra detalhes da request
} else {
    functions[functionName]()
}
