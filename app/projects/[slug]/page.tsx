import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectNav from "@/components/ProjectNav";
import Reveal from "@/components/Reveal";
import T from "@/components/T";
import { gallery, imagePath, projectAlt, visibleProjects } from "@/lib/content";

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
  const title = [project.client, project.event].filter(Boolean).join(" · ");
  const bits = [
    `${project.client} exhibition stand`,
    project.event && `at ${project.event}`,
    project.location && `in ${project.location}`,
    project.year && `(${project.year})`,
  ].filter(Boolean);
  const description = project.partner
    ? `${bits.join(" ")}. Designed by Mehrnaz Arshad, built with ${project.partner}.`
    : `${bits.join(" ")}. Designed by Mehrnaz Arshad.`;
  return {
    title: `${title} - Mehrnaz Arshad`,
    description,
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
          {String(index + 1).padStart(2, "0")} — {project.event ?? project.client}
        </p>
        <h1 className="phero__title">{project.client}</h1>
        <div className="phero__meta">
          {project.event && (
            <div>
              <span className="t-label">
                <T k="eventLabel" />
              </span>
              <strong>{project.event}</strong>
            </div>
          )}
          {project.location && (
            <div>
              <span className="t-label">
                <T k="locationLabel" />
              </span>
              <strong>{project.location}</strong>
            </div>
          )}
          {project.year && (
            <div>
              <span className="t-label">
                <T k="yearLabel" />
              </span>
              <strong>{project.year}</strong>
            </div>
          )}
          {project.partner && (
            <div>
              <span className="t-label">
                <T k="builtWithLabel" />
              </span>
              <strong>{project.partner}</strong>
            </div>
          )}
          {project.boothSize && (
            <div>
              <span className="t-label">
                <T k="standSizeLabel" />
              </span>
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
              alt={`${projectAlt(project)} - ${image.file.replace(/\.[^.]+$/, "").replace(/_/g, " ")}`}
              width={image.width}
              height={image.height}
              sizes="100vw"
            />
          </Reveal>
        ))}
      </div>

      <ProjectNav>
        <Link href={`/projects/${prev.slug}`}>
          <span className="t-label t-muted">
            <span aria-hidden>↖</span> <T k="previous" />
          </span>
          <strong>{prev.client}</strong>
        </Link>
        <Link href={`/projects/${next.slug}`} className="project-nav__next">
          <span className="t-label t-muted">
            <T k="next" /> <span aria-hidden>↘</span>
          </span>
          <strong>{next.client}</strong>
        </Link>
      </ProjectNav>
    </main>
  );
}
