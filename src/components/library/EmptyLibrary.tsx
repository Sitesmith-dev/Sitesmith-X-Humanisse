"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { comics } from "@/content/comics";
import { ComicCarousel } from "@/components/comics/ComicCarousel";
import styles from "./Library.module.css";

export function EmptyLibrary() {
  return (
    <>
      <section className={styles.hero}>
                <div className={`wrap ${styles.heroGrid}`}>
          <div>
            <p><span className="demo">Preview data</span></p>
            <h1 className={styles.h1}>Your shelf is waiting</h1>
            <p className="lead">The Cat is unimpressed, but not for long, comics you buy will be kept here for you to read again</p>
            <Link href="/comics" className="btn btn-primary btn-lg">Browse Comics <ArrowRight size={20} aria-hidden="true" /></Link>
          </div>
          <div style={{ justifySelf: "center" }}>
            <Image src="/characters/posters/cat.jpg" alt="The Cat, Chief Story Critic, looking unimpressed" width={300} height={330} style={{ border: "2px solid var(--ink)", borderRadius: 12, width: "min(300px, 100%)", height: "auto" }} />
          </div>
        </div>
      </section>
      <section className={styles.discover} aria-labelledby="empty-h">
        <div className="wrap">
          <h2 id="empty-h">A few places to start</h2>
          <ComicCarousel comics={comics.slice(0, 5)} label="suggested comics" />
        </div>
      </section>
    </>
  );
}
