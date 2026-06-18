import fs from "fs";
import path from "path";
import { fetchPosts } from "../firebase/client.js";

/**
 * OUTPUT DIRECTORY (STATIC SITE)
 */
const DIST = path.join(process.cwd(), "dist");

/**
 * CLEAN BUILD (DO NOT DELETE MANUALLY)
 */
function cleanDist() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST, { recursive: true });
}

/**
 * SAFE SLUG (SEO URL ENGINE)
 */
function safeSlug(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * BASIC HTML ESCAPE (SECURITY + SEO SAFETY)
 */
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * LOAD POSTS FROM FIREBASE
 */
async function loadData() {
  const posts = await fetchPosts();

  // normalize + safety mapping
  return posts.map(p => ({
    id: p.id,
    title: p.title || "Untitled",
    slug: p.slug || safeSlug(p.title),
    category: p.category || "uncategorized",
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

/**
 * SORTING ENGINE (SEO PRIORITY LOGIC)
 */
function sortPosts(posts) {
  return posts.sort((a, b) => {
    const aScore = (a.views || 0);
    const bScore = (b.views || 0);
    return bScore - aScore;
  });
}

/**
 * INIT BUILD PIPELINE
 */
async function initBuild() {
  cleanDist();

  let posts = await loadData();
  posts = sortPosts(posts);

  console.log(`Loaded ${posts.length} posts from Firebase`);

  return posts;
}

export {
  initBuild,
  safeSlug,
  escapeHtml
};
import { initBuild, safeSlug, escapeHtml } from "./generate.js";
import fs from "fs";
import path from "path";

/**
 * BASE URL (CHANGE IF NEEDED)
 */
const BASE_URL = "https://webwardrobe.name.ng";

/**
 * CREATE DIRECTORY SAFELY
 */
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * HOMEPAGE BUILDER (SEO INDEX PAGE)
 */
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
<img src="${p.media?.[0] || ''}">
<h3>${escapeHtml(p.title)}</h3>
</a>
`).join("")}

</div>

</div>

</body>
</html>`;
}

/**
 * CATEGORY PAGE BUILDER
 */
function buildCategoryPage(category, posts) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${category} | Web Wardrobe</title>
<meta name="description" content="Latest ${category} inspiration on Web Wardrobe.">
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
<img src="${p.media?.[0] || ''}">
<h3>${escapeHtml(p.title)}</h3>
</a>
`).join("")}

</div>

</div>

</body>
</html>`;
}

/**
 * ARTICLE PAGE BUILDER (SEO CORE)
 */
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

/**
 * CATEGORY GROUPING
 */
function groupByCategory(posts) {
  const map = {};

  posts.forEach(p => {
    const cat = p.category || "uncategorized";
    if (!map[cat]) map[cat] = [];
    map[cat].push(p);
  });

  return map;
   }
import {
  initBuild,
  safeSlug
} from "./generate.js";

import fs from "fs";
import path from "path";

/* IMPORT BUILDERS FROM PART 2 */
import {
  buildHomePage,
  buildCategoryPage,
  buildArticlePage,
  groupByCategory
} from "./generate.js";

/**
 * DIST PATH
 */
const DIST = path.join(process.cwd(), "dist");

/**
 * ENSURE DIR
 */
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * WRITE FILE SAFE
 */
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

/**
 * MAIN BUILD PIPELINE
 */
async function runBuild() {
  console.log("Starting Web Wardrobe SEO build...");

  const posts = await initBuild();

  const grouped = groupByCategory(posts);

  /* 1. BUILD HOMEPAGE */
  const homeHTML = buildHomePage(posts);
  writeFile(path.join(DIST, "index.html"), homeHTML);

  console.log("Homepage built");

  /* 2. BUILD CATEGORY PAGES */
  Object.keys(grouped).forEach(category => {
    const categoryPath = path.join(DIST, category);

    const html = buildCategoryPage(category, grouped[category]);

    writeFile(path.join(categoryPath, "index.html"), html);

    console.log(`Category built: ${category}`);
  });

  /* 3. BUILD ARTICLE PAGES */
  posts.forEach(post => {
    const slug = safeSlug(post.slug || post.title);
    const category = post.category || "uncategorized";

    const filePath = path.join(
      DIST,
      category,
      `${slug}.html`
    );

    const html = buildArticlePage({
      ...post,
      slug
    });

    writeFile(filePath, html);

    console.log(`Article built: ${slug}`);
  });

  console.log("SEO build completed successfully.");
}

/**
 * RUN BUILD
 */
runBuild();
