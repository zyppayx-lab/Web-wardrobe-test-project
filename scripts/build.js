import fs from "fs";
import path from "path";
import { fetchPosts } from "../firebase/client.js";

const DIST = path.join(process.cwd(), "dist");
const BASE_URL = "https://webwardrobe.name.ng";

/* =========================
   FILE SYSTEM
========================= */

function cleanDist() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST, { recursive: true });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

/* =========================
   UTILITIES
========================= */

export function safeSlug(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function safeFolder(text = "") {
  return safeSlug(text || "uncategorized");
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* =========================
   DATA
========================= */

async function loadPosts() {
  const posts = await fetchPosts();

  return posts.map(p => ({
    id: p.id,
    title: p.title || "Untitled",
    slug: p.slug || safeSlug(p.title),
    category: safeFolder(p.category),
    shortDescription: p.shortDescription || "",
    longDescription: p.longDescription || "",
    media: p.media || [],
    views: p.views || 0
  }));
}

function sortPosts(posts) {
  return posts.sort((a, b) => (b.views || 0) - (a.views || 0));
}

function groupByCategory(posts) {
  const map = {};

  for (const p of posts) {
    const cat = p.category;
    if (!map[cat]) map[cat] = [];
    map[cat].push(p);
  }

  return map;
}

/* =========================
   BUILD ENGINE
========================= */

export async function initBuild() {
  console.log("Starting SEO build...");

  cleanDist();

  let posts = await loadPosts();
  posts = sortPosts(posts);

  console.log(`Loaded ${posts.length} posts`);

  const grouped = groupByCategory(posts);

  /* HOME */
  writeFile(path.join(DIST, "index.html"), buildHomePage(posts));

  /* CATEGORY */
  for (const category in grouped) {
    const catPath = path.join(DIST, category);

    writeFile(
      path.join(catPath, "index.html"),
      buildCategoryPage(category, grouped[category])
    );
  }

  /* ARTICLES */
  for (const post of posts) {
    writeFile(
      path.join(DIST, post.category, `${post.slug}.html`),
      buildArticlePage(post)
    );
  }

  console.log("SEO build completed successfully");

  return posts;
}

/* =========================
   PAGE BUILDERS
========================= */

function buildHomePage(posts) {
  const latest = posts.slice(0, 12);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Web Wardrobe | Fashion & Lifestyle</title>
<meta name="description" content="Fashion, furniture, interior and lifestyle inspiration">
<link rel="canonical" href="${BASE_URL}">
</head>
<body>

<h1>Web Wardrobe</h1>

${latest.map(p => `
  <a href="/${p.category}/${p.slug}.html">${escapeHtml(p.title)}</a><br>
`).join("")}

</body>
</html>`;
}

function buildCategoryPage(category, posts) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${category} | Web Wardrobe</title>
<meta name="description" content="${category} content on Web Wardrobe">
<link rel="canonical" href="${BASE_URL}/${category}/">
</head>
<body>

<h1>${category}</h1>

${posts.map(p => `
  <a href="/${p.category}/${p.slug}.html">${escapeHtml(p.title)}</a><br>
`).join("")}

</body>
</html>`;
}

function buildArticlePage(post) {
  const image = post.media?.[0] || "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${escapeHtml(post.title)} | Web Wardrobe</title>
<meta name="description" content="${escapeHtml(post.shortDescription)}">
<link rel="canonical" href="${BASE_URL}/${post.category}/${post.slug}.html">

<meta property="og:title" content="${escapeHtml(post.title)}">
<meta property="og:description" content="${escapeHtml(post.shortDescription)}">
<meta property="og:image" content="${image}">
</head>
<body>

<h1>${escapeHtml(post.title)}</h1>

<img src="${image}" style="max-width:100%;" />

<p>${escapeHtml(post.longDescription)}</p>

</body>
</html>`;
}
