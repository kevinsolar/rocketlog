import { Request, Response } from "express"
import z from "zod"

class UsersController {
	create(request: Request, response: Response) {
		const bodySchema = z.object({
      // faz um tratamento de retirar os espacos do comeco/fim e obriga ter pelo menos 1 caracter
			name: z.string().trim().min(2),
			email: z.string().email(),
      // senha com no minimo 6 caracteres
			password: z.string().min(6),
		})

		const { name, email, password } = bodySchema.parse(request.body)

		return response.json({ meessage: "ok" })
	}

	index(request: Request, response: Response) {
		return response.json()
	}
}

export { UsersController }
