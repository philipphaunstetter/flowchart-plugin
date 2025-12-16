const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["code.ts"],
    bundle: true,
    outfile: "code.js",
    target: "es2020",
    logLevel: "info",
  })
  .then(() => {
    console.log("Plugin built successfully!");
  })
  .catch(() => process.exit(1));
