import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import WorldMap from "@/components/WorldMap";
import { otherPartners, partnerNetwork, site } from "@/content/site";
import { gallery, heroImage, imagePath, visibleProjects } from "@/lib/content";

export default function Home() {
  const featured = visibleProjects[0];
  // The featured project opens the page AND leads the reel; use its alternate
  // image up top so the two don't show the same photo back to back.
  const featuredPanel = heroImage(featured);
  const heroFile =
    gallery(featured.slug).find((i) => i.file !== featuredPanel.file) ?? featuredPanel;
  const heroSrc = imagePath(featured.slug, heroFile.file);
  const countries = new Set(partnerNetwork.map((p) => p.country)).size;
  const partners = new Set([
    ...visibleProjects.map((p) => p.partner),
    ...partnerNetwork.flatMap((p) => (p.partner ? [p.partner] : [])),
    ...otherPartners,
  ]).size;

  return (
    <main>
      <section className="hero">
        <Image
          src={heroSrc}
          alt={`${featured.client} stand at ${featured.event}`}
          fill
          priority
          sizes="100vw"
          className="hero__image"
        />
        <div className="hero__scrim" />
        <div className="hero__content">
          <p className="label label--copper hero__role">{site.role}</p>
          <h1 className="hero__name">
            Mehrnaz
            <br />
            Arshad
          </h1>
          <div className="hero__meta label">
            <span>Renders that get built</span>
            <span className="hero__scroll-cue">Scroll</span>
          </div>
        </div>
      </section>

      <section id="projects" className="reel" aria-label="Selected projects">
        {visibleProjects.map((project, i) => (
          <article key={project.slug} className="reel__item">
            <div className="reel__panel">
              <Image
                src={imagePath(project.slug, heroImage(project).file)}
                alt={`${project.client} stand at ${project.event}`}
                fill
                sizes="100vw"
                loading={i < 2 ? "eager" : "lazy"}
                className="reel__image"
              />
              <div className="reel__scrim" />
              <div className="reel__caption">
                <Reveal>
                  <span className="reel__index">{String(i + 1).padStart(2, "0")}</span>
                  <p className="label label--copper">{project.event}</p>
                  <h2 className="reel__client">{project.client}</h2>
                  <p className="reel__meta label">
                    {project.location} · {project.year} · Built with {project.partner}
                  </p>
                </Reveal>
                <Link href={`/projects/${project.slug}`} className="reel__open label">
                  View project <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section id="about" className="about" data-header-ink>
        <p className="label label--copper">About</p>
        <Reveal>
          <p className="about__statement">
            Custom exhibition stands - from <em>first sketch</em> to the show
            floor, delivered with trusted construction partners across{" "}
            {countries} countries.
          </p>
          <div className="about__facts">
            <div className="about__fact">
              <strong>{visibleProjects.length}</strong>
              <span className="label">Featured projects</span>
            </div>
            <div className="about__fact">
              <strong>{countries}</strong>
              <span className="label">Partner countries</span>
            </div>
            <div className="about__fact">
              <strong>{partners}</strong>
              <span className="label">Construction partners</span>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="contact" className="contact">
        <div className="section-head section-head--dark">
          <span className="label label--copper">Contact</span>
          <span className="label reel__meta">Construction partner network</span>
        </div>
        <div className="contact__grid">
          <div>
            <h2 className="contact__title">
              Let&apos;s build <em>your next stand</em> together.
            </h2>
            <ul className="partner-list">
              {partnerNetwork.map((p) => (
                <li key={p.country}>
                  <span>{p.country}</span>
                  <span>{p.partner}</span>
                </li>
              ))}
              {otherPartners.map((name) => (
                <li key={name}>
                  <span>{name}</span>
                  <span></span>
                </li>
              ))}
            </ul>
            <a className="contact__email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
          <Reveal>
            <WorldMap />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
