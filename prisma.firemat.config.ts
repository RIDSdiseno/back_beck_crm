// prisma.firemat.config.ts

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/firemat.schema.prisma",

  datasource: {
    url: process.env["FIREMAT_DATABASE_URL"],
  },
});