import { z } from "zod";

import { HttpRequest, HttpResponse } from "../types/Http";
import { badRequest, created, ok, unauthorized } from "../utils/http";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import { compare } from "bcryptjs";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export class SignInController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const user = await db.query.usersTable.findFirst({
      columns: {
        id: true,
        email: true,
        password: true,
      },
      where: eq(usersTable.email, data.email),
    });

    if (!user) {
      return unauthorized({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await compare(data.password, user.password);

    if (!isPasswordValid) {
      return unauthorized({ error: 'Invalid credentials' });
    }

    // Aqui você pode gerar token, se quiser
    return ok({
      userId: user.id,
    });
  }
}
