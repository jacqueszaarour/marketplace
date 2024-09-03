import { defineFunction } from "@aws-amplify/backend";

export const cartHandler = defineFunction({
  name: "cart-handler",
  entry: "./handler.ts",
});
