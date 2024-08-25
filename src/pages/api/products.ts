import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const products = await prisma.product.findMany();
      res.status(200).json(products);
    } else if (req.method === "POST") {
      const { name, price, imageUrl, rating } = req.body as {
        name: string;
        price: number;
        imageUrl: string;
        rating: number;
      };

      const newProduct = await prisma.product.create({
        data: { name, price, imageUrl, rating },
      });
      res.status(201).json(newProduct);
    } else if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        return res.status(400).json({ error: "Invalid product ID format" });
      }

      // First, delete any CartItems associated with the product
      await prisma.cartItem.deleteMany({
        where: { productId: numericId },
      });

      // Then, delete the product itself
      await prisma.product.delete({
        where: { id: numericId },
      });

      res.status(204).end();
    } else if (req.method === "PUT") {
      const { id } = req.query;
      const { rating } = req.body as { rating: number };

      if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        return res.status(400).json({ error: "Invalid product ID format" });
      }

      const updatedProduct = await prisma.product.update({
        where: { id: numericId },
        data: { rating },
      });

      res.status(200).json(updatedProduct);
    } else {
      res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
