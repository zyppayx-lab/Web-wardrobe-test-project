export function buildInternalLinks(posts, current) {
  const related = posts
    .filter(p => p.category === current.category && p.slug !== current.slug)
    .slice(0, 4);

  return related.map(p =>
    `<a href="/${p.category}/${p.slug}.html">${p.title}</a>`
  ).join("");
}
