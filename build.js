const esbuild = require("esbuild");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "https://flowchart-backend.vercel.app";

esbuild
  .build({
    entryPoints: ["code.tsx"],
    bundle: true,
    outfile: "code.js",
    target: "es2020",
    define: {
      "process.env.API_BASE_URL": JSON.stringify(API_BASE_URL),
    },
    logLevel: "info",
  })
  .then(() => {
    console.log("Widget built successfully!");
  })
  .catch(() => process.exit(1));
