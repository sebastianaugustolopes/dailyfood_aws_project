import { z } from "zod";

import { HttpRequest, HttpResponse } from "../types/Http";
import { badRequest, conflict, created } from "../utils/http";
import { hash } from "bcryptjs";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import { signAccessTokenFor } from "../lib/hwt";
import { calculateGoals } from "../lib/calculatorGoals";

const schema = z.object({
  goal: z.enum(["lose", "maintain", "gain"]),
  gender: z.enum(["male", "female"]),
  birthDate: z.coerce.date(),
  height: z.number().min(1),
  weight: z.number().min(1),
  activityLevel: z.number().min(1).max(5),
  account: z.object({
    name: z.string().min(1).trim(),
    email: z.email(),
    password: z.string().min(8),
  }),
});

export class SignUpController {
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    const userAlreadyExists = await db.query.usersTable.findFirst({
      columns: {
        email: true,
      },
      where: eq(usersTable.email, data.account.email),
    });

    if (userAlreadyExists) {
      return conflict({ error: "This email is already in use" });
    }

    const { account, ...rest } = data;

    const goals = calculateGoals({
      activityLevel: rest.activityLevel,
      birthDate: rest.birthDate, 
      gender: rest.gender,
      goal: rest.goal,
      height: rest.height,
      weight: rest.weight,
    });

    const hashsedPassword = await hash(account.password, 8); 
    
    const [user] = await db
      .insert(usersTable)
      .values({
        ...account,
        ...rest,
        ...goals,
        password: hashsedPassword,
        birthDate: rest.birthDate.toISOString().split("T")[0], 
      })
      .returning({
        id: usersTable.id,
      });
    

    const accessToken = signAccessTokenFor(user.id);

    return created({
      accessToken,
    });
  }
}
