/*
 * This is an extremely pared down implementation of an HTTP Api router for Lambda.
 * This covers only the functionality needed for this specific effort.
*/

const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'content-type'
}

class HttpApi {
    constructor() {
        this.routes = {}
    }

    get(path, callback) {
        this.routes[path] = callback
    }

    async resolve(e) {
        const method = e.requestContext.http.method
        const path = e.requestContext.http.path

        if (method === "OPTIONS")
            return {
                statusCode: 200,
                headers: HEADERS,
                body: 'OK'
            }

        else if (method === "GET" && path in this.routes)
            return await HttpApi.httpResponse(e, this.routes[path])

        else
            return HttpApi.notFound()
    }


    static async httpResponse(e, callback) {
        const resp = await callback({
            rawQuery: e.rawQueryString,
            headers: e.headers,
            parameters: e.queryStringParameters
        })

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify(resp)
        }
    }

    static notFound() {
        return {
            statusCode: 404,
            headers: HEADERS,
            body: JSON.stringify({
                statusCode: 404,
                message: "Not found"
            })
        }
    }
}

export default HttpApi
