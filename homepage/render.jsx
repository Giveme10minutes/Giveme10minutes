import React from "react";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { renderToString } from "react-dom/server";
import Homepage from "./Homepage.jsx";

const template = await readFile(new URL("./template.html", import.meta.url), "utf8");
const bundle = await readFile(new URL("../docs/showcase/react/homepage.js", import.meta.url));
const version = createHash("sha256").update(bundle).digest("hex").slice(0, 12);
const html = template
  .replace("{{APP}}", () => renderToString(<Homepage />))
  .replace("{{VERSION}}", version);

await writeFile(new URL("../docs/index.html", import.meta.url), html);
