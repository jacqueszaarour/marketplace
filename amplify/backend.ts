import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { cartHandler } from "./backend/function/cartHandler/src/resource";
import { productHandler } from "./backend/function/productHandler/src/resource";

defineBackend({
  auth,
  data,
  cartHandler,
  productHandler,
});
