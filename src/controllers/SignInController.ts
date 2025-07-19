import { HttpRequest, HttpResponse } from '../types/Http'
import { ok } from '../utils/htttp'

export class SignInController {
    static async handle(request: HttpRequest): Promise<HttpResponse> {
        return ok({acessToken: 'toke n de acesso'})

    }
}