const esbuild = require("esbuild");
const dotenv = require("dotenv");
const fs = require("fs");

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "https://flowchart-backend.vercel.app";

// Build widget
esbuild
  .build({
    entryPoints: ["widget.tsx"],
    bundle: true,
    outfile: "widget.js",
    target: "es2020",
    format: "iife",
    globalName: "WidgetModule",
    define: {
      "process.env.API_BASE_URL": JSON.stringify(API_BASE_URL),
    },
    logLevel: "info",
  })
  .then(() => {
    console.log("Widget built successfully!");
    
    // Build plugin (which imports the widget)
    return esbuild.build({
      entryPoints: ["plugin.ts"],
      bundle: true,
      outfile: "plugin.js",
      target: "es2020",
      external: ["./widget"],
      banner: {
        js: fs.readFileSync("widget.js", "utf8") + "\n",
      },
      logLevel: "info",
    });
  })
  .then(() => {
    console.log("Plugin built successfully!");
  })
  .catch(() => process.exit(1));
