import { Request, Response } from "express"

class UsersController {
	create(request: Request, response: Response) {
		return response.json({ meessage: "ok" })
	}

	index(request: Request, response: Response) {
		return response.json()
	}
}

export { UsersController }
