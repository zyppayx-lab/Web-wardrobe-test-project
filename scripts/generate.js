import fs from "fs";
import path from "path";
import { fetchPosts } from "../firebase/client.js";

/**
 * DIST OUTPUT
 */
const DIST = path.join(process.cwd(), "dist");
const BASE_URL = "https://webwardrobe.name.ng";

/* =========================
   UTILITIES
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
  fs.writeFileSync(filePath, content);
}

function safeSlug(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* =========================
   DATA LAYER
========================= */

async function loadPosts() {
  const posts = await fetchPosts();

  return posts.map(p => ({
    id: p.id,
    title: p.title || "Untitled",
    slug: p.slug || safeSlug(p.title),
    category: (p.category || "uncategorized").toLowerCase(),
    shortDescription: p.shortDescription || "",
    longDescription: p.longDescription || "",
    media: p.media || [],
    createdAt: p.createdAt || null,
    views: p.views || 0,
    isSponsored: p.isSponsored || false,
    affiliateLink: p.affiliateLink || "",
    websiteUrl: p.websiteUrl || ""
  }));
}

function sortPosts(posts) {
  return posts.sort((a, b) => (b.views || 0) - (a.views || 0));
}

function groupByCategory(posts) {
  const map = {};

  for (const p of posts) {
    const cat = p.category || "uncategorized";
    if (!map[cat]) map[cat] = [];
    map[cat].push(p);
  }

  return map;
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

<title>Web Wardrobe | Fashion, Furniture & Lifestyle</title>
<meta name="description" content="Discover fashion, furniture, interior and lifestyle inspiration on Web Wardrobe.">
<link rel="canonical" href="${BASE_URL}">

<meta property="og:title" content="Web Wardrobe">
<meta property="og:description" content="Fashion, furniture, interior and lifestyle inspiration.">
<meta property="og:type" content="website">

<style>
body{font-family:Arial;background:#fafafa;margin:0;padding:20px;}
.container{max-width:1100px;margin:auto;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;}
.card{background:#fff;border-radius:12px;overflow:hidden;text-decoration:none;color:#111;display:block;}
.card img{width:100%;height:140px;object-fit:cover;}
.card h3{font-size:14px;padding:10px;}
</style>
</head>
<body>
<div class="container">
<h1>Web Wardrobe</h1>
<div class="grid">
${latest.map(p => `
<a class="card" href="/${p.category}/${p.slug}.html">
<img src="${p.media?.[0] || ""}">
<h3>${escapeHtml(p.title)}</h3>
</a>
`).join("")}
</div>
</div>
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
<meta name="description" content="Latest ${category} content on Web Wardrobe.">
<link rel="canonical" href="${BASE_URL}/${category}/">

<meta property="og:title" content="${category}">
<meta property="og:description" content="Explore ${category} content on Web Wardrobe">

<style>
body{font-family:Arial;background:#fafafa;margin:0;padding:20px;}
.container{max-width:1100px;margin:auto;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;}
.card{background:#fff;border-radius:12px;overflow:hidden;text-decoration:none;color:#111;display:block;}
.card img{width:100%;height:140px;object-fit:cover;}
.card h3{font-size:14px;padding:10px;}
</style>
</head>
<body>
<div class="container">
<h1>${category}</h1>
<div class="grid">
${posts.map(p => `
<a class="card" href="/${p.category}/${p.slug}.html">
<img src="${p.media?.[0] || ""}">
<h3>${escapeHtml(p.title)}</h3>
</a>
`).join("")}
</div>
</div>
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
<meta name="description" content="${escapeHtml(post.shortDescription).slice(0,160)}">
<link rel="canonical" href="${BASE_URL}/${post.category}/${post.slug}.html">

<meta property="og:title" content="${escapeHtml(post.title)}">
<meta property="og:description" content="${escapeHtml(post.shortDescription)}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${BASE_URL}/${post.category}/${post.slug}.html">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${escapeHtml(post.title)}",
  "description": "${escapeHtml(post.shortDescription)}",
  "image": "${image}",
  "author": {
    "@type": "Organization",
    "name": "Web Wardrobe"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Web Wardrobe"
  },
  "mainEntityOfPage": "${BASE_URL}/${post.category}/${post.slug}.html"
}
</script>

<style>
body{font-family:Arial;background:#fafafa;margin:0;padding:20px;}
.container{max-width:800px;margin:auto;background:#fff;padding:20px;border-radius:12px;}
img{width:100%;border-radius:12px;margin:20px 0;}
</style>
</head>
<body>
<div class="container">
<h1>${escapeHtml(post.title)}</h1>
<img src="${image}" />
<p>${escapeHtml(post.longDescription)}</p>
</div>
</body>
</html>`;
}

/* =========================
   BUILD PIPELINE
========================= */

export async function runBuild() {
  console.log("Starting SEO build...");

  cleanDist();

  let posts = await loadPosts();
  posts = sortPosts(posts);

  console.log(`Loaded ${posts.length} posts`);

  const grouped = groupByCategory(posts);

  /* HOME */
  writeFile(
    path.join(DIST, "index.html"),
    buildHomePage(posts)
  );

  /* CATEGORY PAGES */
  Object.keys(grouped).forEach(category => {
    writeFile(
      path.join(DIST, category, "index.html"),
      buildCategoryPage(category, grouped[category])
    );
  });

  /* ARTICLE PAGES */
  for (const post of posts) {
    writeFile(
      path.join(DIST, post.category, `${post.slug}.html`),
      buildArticlePage(post)
    );
  }

  console.log("SEO build completed successfully");
}

/* AUTO RUN */
runBuild();
