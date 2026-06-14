"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";

type Post = {
  title: string;
  shortDescription: string;
  slug: string;
  media?: string[];
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      const snap = await getDocs(q);

      const data: Post[] = snap.docs.map((d) => d.data() as Post);
      setPosts(data);
    }

    load();
  }, []);

  return (
    <main style={{ fontFamily: "Inter, sans-serif", background: "#fafafa" }}>

      {/* HERO */}
      <section style={{ padding: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: 48 }}>
          Modern Fashion & Lifestyle Inspiration
        </h1>
        <p style={{ maxWidth: 600, margin: "10px auto" }}>
          Discover fashion, furniture, interior and lifestyle ideas.
        </p>
      </section>

      {/* GRID */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          padding: 20
        }}
      >
        {posts.map((post, i) => (
          <a
            key={i}
            href={`/posts/${post.slug}`}
            style={{
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              textDecoration: "none",
              color: "#111",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}
          >
            <img
              src={post.media?.[0]}
              style={{ width: "100%", height: 180, objectFit: "cover" }}
            />
            <div style={{ padding: 12 }}>
              <h3>{post.title}</h3>
              <p style={{ fontSize: 13, color: "#666" }}>
                {post.shortDescription}
              </p>
            </div>
          </a>
        ))}
      </section>
    </main>
  );
}
