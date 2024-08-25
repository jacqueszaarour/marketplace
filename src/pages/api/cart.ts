import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET": {
        const cartItems = await prisma.cartItem.findMany({
          include: { product: true },
        });
        res.status(200).json(cartItems);
        break;
      }
      case "POST": {
        const { productId } = req.body as { productId: number };

        if (!productId) {
          return res.status(400).json({ error: "Product ID is required" });
        }

        const existingProduct = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!existingProduct) {
          return res.status(400).json({ error: "Invalid Product ID" });
        }

        const existingCartItem = await prisma.cartItem.findFirst({
          where: {
            productId: productId,
          },
        });

        if (existingCartItem) {
          const updatedCartItem = await prisma.cartItem.update({
            where: {
              id: existingCartItem.id,
            },
            data: { quantity: existingCartItem.quantity + 1 },
          });
          res.status(200).json(updatedCartItem);
        } else {
          const newCartItem = await prisma.cartItem.create({
            data: { productId: productId, quantity: 1 },
          });
          res.status(201).json(newCartItem);
        }
        break;
      }
      case "PUT": {
        const { productId, quantity } = req.body as {
          productId: number;
          quantity: number;
        };

        if (!productId || quantity === undefined) {
          return res
            .status(400)
            .json({ error: "Product ID and quantity are required" });
        }

        const existingProduct = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!existingProduct) {
          return res.status(400).json({ error: "Invalid Product ID" });
        }

        const existingCartItem = await prisma.cartItem.findFirst({
          where: {
            productId: productId,
          },
        });

        if (!existingCartItem) {
          return res.status(404).json({ error: "Cart item not found" });
        }

        if (quantity > 0) {
          const updatedItem = await prisma.cartItem.update({
            where: {
              id: existingCartItem.id,
            },
            data: { quantity },
          });
          res.status(200).json(updatedItem);
        } else {
          await prisma.cartItem.delete({
            where: {
              id: existingCartItem.id,
            },
          });
          res.status(204).end();
        }
        break;
      }
      case "DELETE": {
        const { productId } = req.body as { productId: number };

        console.log("DELETE request received for productId:", productId);

        if (!productId) {
          console.error("Product ID is missing in DELETE request.");
          return res.status(400).json({ error: "Product ID is required" });
        }

        const existingCartItem = await prisma.cartItem.findFirst({
          where: {
            productId: productId,
          },
        });

        if (!existingCartItem) {
          console.error("Cart item not found for productId:", productId);
          return res.status(404).json({ error: "Cart item not found" });
        }

        await prisma.cartItem.delete({
          where: {
            id: existingCartItem.id,
          },
        });

        console.log(
          "Successfully deleted cart item with id:",
          existingCartItem.id,
        );
        res.status(204).end();
        break;
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
