"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowSquare } from "@/components/ui/Icons";

export type Project = {
  id: string;
  title: string;
  tags: string[];
  image: StaticImageData;
  alt: string;
  href: string;
  video?: string;
};

/** Кейс 560px: hover — zoom 1.045 за 1.1s и стрелка ↗; видео — autoplay muted loop. */
export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Reveal as="article" className="prj relative h-[clamp(380px,45vw,560px)] w-full overflow-hidden bg-[#e8e9e6]">
      <Link
        href={project.href}
        className="absolute inset-0 block focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
        aria-label={project.title}
      >
        <div className="prj-img absolute inset-0">
          <Image
            src={project.image}
            alt={project.alt}
            fill
            priority={priority}
            sizes="(max-width: 900px) 100vw, 55vw"
            className="block object-cover"
          />
          {project.video ? <AutoplayVideo src={project.video} /> : null}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,17,0)_55%,rgba(8,11,17,.5)_100%)]" />
        <div className="pointer-events-none absolute right-10 bottom-9 left-10 max-md:right-5 max-md:bottom-6 max-md:left-5">
          <div className="mb-3.5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border-[0.5px] border-white/34 bg-white/8 px-[11px] py-[5px] text-xs leading-none font-medium tracking-[.01em] whitespace-nowrap text-white/92 backdrop-blur-[6px]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="max-w-[430px] text-[18px] leading-[21px] font-medium tracking-[-0.01em] text-pretty text-white">
            {project.title}
          </div>
        </div>
        <div className="prj-cta pointer-events-none absolute top-7 right-7 text-white">
          <ArrowSquare />
        </div>
      </Link>
    </Reveal>
  );
}

/**
 * Видео поверх постера: показывается, только когда декодирован первый кадр.
 * Играет лишь в зоне видимости — экономит CPU и батарею.
 */
function AutoplayVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const play = () => v.play().catch(() => {});
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : v.pause()), { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-hidden
      onLoadedData={() => setReady(true)}
      onTimeUpdate={(e) => !ready && e.currentTarget.videoWidth > 0 && setReady(true)}
      className="absolute inset-0 block size-full object-cover transition-opacity duration-[400ms]"
      style={{ opacity: ready ? 1 : 0 }}
    />
  );
}
