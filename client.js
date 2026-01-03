const BASE_URL = "http://localhost:3000"

const functions = {
    async getProduct(verbose = false) {
        const response = await fetch(BASE_URL + "/products/notebook")
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
