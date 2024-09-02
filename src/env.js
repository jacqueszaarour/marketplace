import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const envOptions = {
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
};

export const env = createEnv(envOptions);
