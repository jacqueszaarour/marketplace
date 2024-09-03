import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyResult,
} from "aws-lambda";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let req: {
    name?: string;
    price?: number;
    imageUrl?: string;
    rating?: number;
  };

  try {
    req = JSON.parse(event.body ?? "{}") as {
      name?: string;
      price?: number;
      imageUrl?: string;
      rating?: number;
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  const res: APIGatewayProxyResult = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: "",
  };

  try {
    if (event.httpMethod === "GET") {
      const products = await prisma.product.findMany();
      res.body = JSON.stringify(products);
    } else if (event.httpMethod === "POST") {
      const { name, price, imageUrl, rating } = req;

      // Ensure required fields are present
      if (!name || !price || !imageUrl || rating === undefined) {
        res.statusCode = 400;
        res.body = JSON.stringify({ error: "Missing required fields" });
        return res;
      }

      const newProduct = await prisma.product.create({
        data: { name, price, imageUrl, rating },
      });
      res.body = JSON.stringify(newProduct);
      res.statusCode = 201;
    } else if (event.httpMethod === "DELETE") {
      const { id } = event.queryStringParameters ?? {};

      if (!id) {
        res.statusCode = 400;
        res.body = JSON.stringify({ error: "Invalid product ID" });
        return res;
      }

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        res.statusCode = 400;
        res.body = JSON.stringify({ error: "Invalid product ID format" });
        return res;
      }

      await prisma.cartItem.deleteMany({
        where: { productId: numericId },
      });

      await prisma.product.delete({
        where: { id: numericId },
      });

      res.statusCode = 204;
      res.body = "";
    } else if (event.httpMethod === "PUT") {
      const { id } = event.queryStringParameters ?? {};
      const { rating } = req;

      if (!id) {
        res.statusCode = 400;
        res.body = JSON.stringify({ error: "Invalid product ID" });
        return res;
      }

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        res.statusCode = 400;
        res.body = JSON.stringify({ error: "Invalid product ID format" });
        return res;
      }

      const updatedProduct = await prisma.product.update({
        where: { id: numericId },
        data: { rating },
      });

      res.body = JSON.stringify(updatedProduct);
    } else {
      res.statusCode = 405;
      res.body = `Method ${event.httpMethod} Not Allowed`;
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.body = JSON.stringify({ error: "Server error" });
  }

  return res;
};
