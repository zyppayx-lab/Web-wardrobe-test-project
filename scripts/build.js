import fs from "fs";
import path from "path";
import { fetchPosts } from "../firebase/client.js";

const DIST = path.join(process.cwd(), "dist");

function safeSlug(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function initBuild() {
  console.log("Starting SEO build...");

  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST, { recursive: true });

  let posts = await fetchPosts();

  posts = posts.map(p => ({
    ...p,
    slug: p.slug || safeSlug(p.title)
  }));

  console.log(`Loaded ${posts.length} posts`);

  console.log("SEO build completed successfully");

  return posts;
}

export { safeSlug };
