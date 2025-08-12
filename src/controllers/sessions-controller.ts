import { authConfig } from "@/configs/auth"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { compare } from "bcrypt"
import { Request, Response } from "express"
import { sign } from "jsonwebtoken"
import z from "zod"

class SessionsController {
	async create(request: Request, response: Response) {
		const bodySchema = z.object({
			email: z.email(),
			password: z.string().min(6),
		})

		const { email, password } = bodySchema.parse(request.body)

		const user = await prisma.user.findFirst({ where: { email } })

		if (!user) {
			throw new AppError("Invalid email or password", 401)
		}

		const passwordMatched = await compare(password, user.password)

		if (!passwordMatched) {
			throw new AppError("Invalid email or password", 401)
		}

		// utiliza do arquivo authConfig para obter o segredo do .env e a expiracao
		const { secret, expiresIn } = authConfig.jwt

		const token = sign(
			{ role: user.role ?? "customer" }, 
			secret, 
			{
				subject: user.id,
				expiresIn: expiresIn as any,
			}
		)

		const { password: hashedPassword, ...userWithoutPassword } = user

		return response.json({ token, user: userWithoutPassword })
	}
}

export { SessionsController }
