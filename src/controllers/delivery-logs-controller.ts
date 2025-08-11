import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import z from "zod"

class DeliveryLogsController {
	async create(request: Request, response: Response) {
		const bodySchema = z.object({
			delivery_id: z.string().uuid(),
			description: z.string(),
		})

		const { delivery_id, description } = bodySchema.parse(request.body)

		const delivery = await prisma.delivery.findUnique({
			where: { id: delivery_id },
		})

		if (!delivery) {
			throw new AppError("Delivery not found", 404)
		}

		if (delivery.status === "processing") {
			throw new AppError("Change status to shipped", 404)
		}

		if (delivery.status === "delivered") {
			throw new AppError("This order has already been delivered")
		}

		await prisma.deliveryLog.create({
			data: {
				deliveryId: delivery_id,
				description,
			},
		})

		return response.status(201).json()
	}

	async show(request: Request, response: Response) {
		const paramsSchema = z.object({
			delivery_id: z.string().uuid(),
		})

		// faz a validacao, recupreando o devlivery_id
		const { delivery_id } = paramsSchema.parse(request.params)

		const delivery = await prisma.delivery.findUnique({
			where: { id: delivery_id },
			include: {
				user: true,
				logs: { select: { description: true, updatedAt: true } },
			},
		})

		if (!delivery) {
			return response.status(404).json({ message: "delivery not found" })
		}

		// verifica se é um usuario "cliente" e se o id de usuario logado é diferente do id do usuario da encomenda, se for entao faz um bloqueio para nao conseguir puxar outros rastreios.
		if (
			request.user?.role === "customer" &&
			request.user.id !== delivery?.userId
		) {
			throw new AppError("The user can only view their deliveries", 401)
		}

		return response.json(delivery)
	}
}

export { DeliveryLogsController }
