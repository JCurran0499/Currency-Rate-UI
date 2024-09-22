/*
 * This is an extremely pared down implementation of an HTTP Api router for Lambda.
 * This covers only the functionality needed for this specific effort.
*/
class HttpApi {
    constructor() {
        this.routes = {}
    }

    get(path, callback) {
        this.routes[path] = callback
    }

    resolve(e) {
        const method = e.requestContext.http.method
        const path = e.requestContext.http.path

        if (method === "GET" && path in this.routes)
            return this.routes[path]({
                rawQuery: e.rawQueryString,
                headers: e.headers,
                parameters: e.queryStringParameters
            })

        else
            return HttpApi.notFound()
    }


    static notFound() {
        return {
            statusCode: 404,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                statusCode: 404,
                message: "Not found"
            })
        }
    }
}

export default HttpApi
