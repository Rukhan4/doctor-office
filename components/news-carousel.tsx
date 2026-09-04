"use client";

import Image from "next/image";
import { useState } from "react";
import type { news as newsType } from "../lib/content";

type NewsCarouselProps = {
  posts: typeof newsType;
};

export function NewsCarousel({ posts }: NewsCarouselProps) {
  const [index, setIndex] = useState(0);

  if (posts.length === 0) {
    return null;
  }

  const post = posts[index];

  function goTo(next: number) {
    setIndex((next + posts.length) % posts.length);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm">
        <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
          <div className="relative h-56 w-full bg-page sm:h-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(min-width: 640px) 220px, 100vw"
              className="object-cover object-top"
            />
          </div>
          <div className="flex flex-col justify-center p-7 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h3 className="mt-2 font-display text-2xl text-ink">{post.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{post.summary}</p>
          </div>
        </div>
      </div>

      {posts.length > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-page"
            aria-label="Previous news post"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {posts.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to news post ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? "bg-accent" : "bg-line"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-page"
            aria-label="Next news post"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
