import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { gallery, imagePath, visibleProjects } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return visibleProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = visibleProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.client} · ${project.event} - Mehrnaz Arshad`,
    description: `${project.client} exhibition stand at ${project.event}, ${project.location} (${project.year}). Designed by Mehrnaz Arshad, built with ${project.partner}.`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = visibleProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  const images = gallery(project.slug);
  const index = visibleProjects.indexOf(project);
  const prev = visibleProjects[(index - 1 + visibleProjects.length) % visibleProjects.length];
  const next = visibleProjects[(index + 1) % visibleProjects.length];

  return (
    <main>
      <section className="phero">
        <p className="t-label t-muted">
          {String(index + 1).padStart(2, "0")} — {project.event}
        </p>
        <h1 className="phero__title">{project.client}</h1>
        <div className="phero__meta">
          <div>
            <span className="t-label">Event</span>
            <strong>{project.event}</strong>
          </div>
          <div>
            <span className="t-label">Location</span>
            <strong>{project.location}</strong>
          </div>
          <div>
            <span className="t-label">Year</span>
            <strong>{project.year}</strong>
          </div>
          <div>
            <span className="t-label">Built with</span>
            <strong>{project.partner}</strong>
          </div>
          {project.boothSize && (
            <div>
              <span className="t-label">Stand size</span>
              <strong>{project.boothSize}</strong>
            </div>
          )}
        </div>
      </section>

      <div className="gallery">
        {images.map((image) => (
          <Reveal as="figure" key={image.file}>
            <Image
              src={imagePath(project.slug, image.file)}
              alt={`${project.client} at ${project.event} - ${image.file.replace(/\.[^.]+$/, "").replace(/_/g, " ")}`}
              width={image.width}
              height={image.height}
              sizes="100vw"
            />
          </Reveal>
        ))}
      </div>

      <nav className="project-nav" aria-label="More projects">
        <Link href={`/projects/${prev.slug}`}>
          <span className="t-label t-muted">
            <span aria-hidden>↖</span> Previous
          </span>
          <strong>{prev.client}</strong>
        </Link>
        <Link href={`/projects/${next.slug}`} className="project-nav__next">
          <span className="t-label t-muted">
            Next <span aria-hidden>↘</span>
          </span>
          <strong>{next.client}</strong>
        </Link>
      </nav>
    </main>
  );
}
