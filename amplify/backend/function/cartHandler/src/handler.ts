import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyResult,
} from "aws-lambda";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // Ensure req is typed according to your expected body structure
  let req: { productId?: number; quantity?: number };

  try {
    req = JSON.parse(event.body ?? "{}") as {
      productId?: number;
      quantity?: number;
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
    switch (event.httpMethod) {
      case "GET": {
        const cartItems = await prisma.cartItem.findMany({
          include: { product: true },
        });
        res.body = JSON.stringify(cartItems);
        break;
      }
      case "POST": {
        const { productId } = req;

        if (!productId) {
          res.statusCode = 400;
          res.body = JSON.stringify({ error: "Product ID is required" });
          break;
        }

        const existingProduct = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!existingProduct) {
          res.statusCode = 400;
          res.body = JSON.stringify({ error: "Invalid Product ID" });
          break;
        }

        const existingCartItem = await prisma.cartItem.findFirst({
          where: { productId },
        });

        if (existingCartItem) {
          const updatedCartItem = await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity + 1 },
          });
          res.body = JSON.stringify(updatedCartItem);
        } else {
          const newCartItem = await prisma.cartItem.create({
            data: { productId, quantity: 1 },
          });
          res.body = JSON.stringify(newCartItem);
          res.statusCode = 201;
        }
        break;
      }
      case "PUT": {
        const { productId, quantity } = req;

        if (!productId || quantity === undefined) {
          res.statusCode = 400;
          res.body = JSON.stringify({
            error: "Product ID and quantity are required",
          });
          break;
        }

        const existingCartItem = await prisma.cartItem.findFirst({
          where: { productId },
        });

        if (!existingCartItem) {
          res.statusCode = 404;
          res.body = JSON.stringify({ error: "Cart item not found" });
          break;
        }

        if (quantity > 0) {
          const updatedItem = await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity },
          });
          res.body = JSON.stringify(updatedItem);
        } else {
          await prisma.cartItem.delete({
            where: { id: existingCartItem.id },
          });
          res.statusCode = 204;
        }
        break;
      }
      case "DELETE": {
        const { productId } = req;

        if (!productId) {
          res.statusCode = 400;
          res.body = JSON.stringify({ error: "Product ID is required" });
          break;
        }

        const existingCartItem = await prisma.cartItem.findFirst({
          where: { productId },
        });

        if (!existingCartItem) {
          res.statusCode = 404;
          res.body = JSON.stringify({ error: "Cart item not found" });
          break;
        }

        await prisma.cartItem.delete({
          where: { id: existingCartItem.id },
        });

        res.statusCode = 204;
        break;
      }
      default:
        res.statusCode = 405;
        res.body = `Method ${event.httpMethod} Not Allowed`;
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.body = JSON.stringify({ error: "Internal server error" });
  }

  return res;
};
