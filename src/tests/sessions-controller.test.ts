import request from "supertest"

import { app } from "@/app"
import { prisma } from "@/database/prisma"

describe("SessionsController", () => {
	let user_id: string

	afterAll(async () => {
		await prisma.user.delete({ where: { id: user_id } })
	})

	it("should authenticate and get access token", async () => {
		const userRes = await request(app).post("/users").send({
			name: "Auth User",
			email: "authuser@example.com",
			password: "password123",
		})

		user_id = userRes.body.id

		const sessionRes = await request(app).post("/sessions").send({
			email: "authuser@example.com",
			password: "password123",
		})

		expect(sessionRes.status).toBe(200)
		expect(sessionRes.body.token).toEqual(expect.any(String))
	})
})
