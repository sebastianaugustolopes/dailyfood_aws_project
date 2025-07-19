import { HttpRequest, HttpResponse } from '../types/Http'
import { created } from '../utils/htttp'

export class SignUpController {
    static async handle(request: HttpRequest): Promise<HttpResponse> {
        return created({
            accessToken: 'aigup: token de acesso'
        })

    }
}