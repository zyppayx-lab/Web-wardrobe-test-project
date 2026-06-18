import fs from "fs";
import path from "path";
import { fetchPosts } from "../firebase/client.js";
import { safeSlug } from "./build.js";

const BASE_URL = "https://webwardrobe.name.ng";

function buildUrl(post) {
  const slug = safeSlug(post.slug || post.title);
  return `${BASE_URL}/${post.category}/${slug}.html`;
}

async function run() {
  // ❌ DO NOT call initBuild again
  const posts = await fetchPosts();

  const urls = posts.map(p => `
<url>
  <loc>${buildUrl(p)}</loc>
</url>`).join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${BASE_URL}</loc></url>
${urls}
</urlset>`;

  fs.mkdirSync("dist", { recursive: true });
  fs.writeFileSync("dist/sitemap.xml", sitemap);

  console.log("Sitemap generated");
}

run();
