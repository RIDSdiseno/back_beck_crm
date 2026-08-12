// prisma.trager.config.ts

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/trager.schema.prisma",

  datasource: {
    url: process.env["TRAGGER_DATABASE_URL"],
  },
});
