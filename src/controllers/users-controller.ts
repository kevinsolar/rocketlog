import { Request, Response } from "express"
import { hash } from "bcrypt"
import z from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class UsersController {
	async create(request: Request, response: Response) {
		const bodySchema = z.object({
			// faz um tratamento de retirar os espacos do comeco/fim e obriga ter pelo menos 1 caracter
			name: z.string().trim().min(2),
			email: z.string().email(),
			// senha com no minimo 6 caracteres
			password: z.string().min(6),
		})

		const { name, email, password } = bodySchema.parse(request.body)

		/* Cria uma verificacao de se o email ja existe no banco de dados */
		const userWithSameEmail = await prisma.user.findFirst({ where: { email } })

		if (userWithSameEmail) {
			throw new AppError("User with same email already exists")
		}
		/**/

		const hashedPassword = await hash(password, 8)

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		})

		const { password: _, ...userWithoutPassword } = user

		return response.status(201).json(userWithoutPassword)
	}

	index(request: Request, response: Response) {
		return response.json()
	}
}

export { UsersController }
