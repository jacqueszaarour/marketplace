import { defineFunction } from "@aws-amplify/backend";

export const productHandler = defineFunction({
  name: "product-handler",
  entry: "./handler.ts",
});
