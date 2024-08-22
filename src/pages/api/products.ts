import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, type Product as PrismaProduct } from "@prisma/client";

const prisma = new PrismaClient();

type ProductInput = {
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const products: PrismaProduct[] = await prisma.product.findMany();
      res.status(200).json(products);
    } catch {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  } else if (req.method === "POST") {
    try {
      const body = req.body as ProductInput;

      const { name, price, imageUrl, rating } = body;

      const newProduct = await prisma.product.create({
        data: {
          name,
          price,
          imageUrl,
          rating: -1,
        },
      });

      res.status(201).json(newProduct);
    } catch {
      res.status(500).json({ error: "Failed to create product" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
