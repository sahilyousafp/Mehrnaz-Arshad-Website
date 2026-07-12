import Image from "next/image";
import Link from "next/link";
import ExpertiseProcess from "@/components/ExpertiseProcess";
import LogoWall from "@/components/LogoWall";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import Ribbons from "@/components/Ribbons";
import { NavLinks } from "@/components/SiteHeader";
import Wordmark from "@/components/Wordmark";
import WorldMap from "@/components/WorldMap";
import { partnerNetwork, site } from "@/content/site";
import {
  gallery,
  heroImage,
  imagePath,
  logoPath,
  projectAlt,
  projectTitle,
  visibleEventLogos,
  visibleProjects,
} from "@/lib/content";

function ALink({ href, children }: { href: string; children: React.ReactNode }) {
  const inner = (
    <>
      {children}{" "}
      <span className="arw" aria-hidden>
        ↘
      </span>
    </>
  );
  return href.startsWith("/") || href.startsWith("#") ? (
    <Link className="alink" href={href}>
      {inner}
    </Link>
  ) : (
    <a className="alink" href={href}>
      {inner}
    </a>
  );
}

export default function Home() {
  const featured = visibleProjects[0];
  const featuredPanel = heroImage(featured);
  const introProject = visibleProjects[2] ?? featured;
  const logos = visibleEventLogos.map((logo) => ({
    src: logoPath(logo.file),
    name: logo.name,
    width: logo.width,
    height: logo.height,
    invert: logo.invert,
  }));
  const perRow = Math.ceil(logos.length / 3);
  const logoRows = [
    logos.slice(0, perRow),
    logos.slice(perRow, perRow * 2),
    logos.slice(perRow * 2),
  ];

  return (
    <main>
      <section className="hero2">
        <Image
          src="/pinned/hero-contact.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero2__bg"
        />
        <div className="hero2__shade" />
        <div className="hero2__ribbons" aria-hidden>
          <Ribbons colors={["#ffffff"]} baseThickness={30} speedMultiplier={0.5} maxAge={500} enableFade enableShaderEffect />
        </div>
        <Wordmark text="MEHRNAZ ARSHAD" className="hero2__mark" />
        <div className="hero2__nav" data-hero-nav>
          <NavLinks />
          <span className="t-label">{site.base}</span>
        </div>
        <div className="hero2__spacer" />
        <div className="hero2__bottom">
          <div className="hero2__intro">
            <p className="t-label">
              Exhibition stand designer — from the first render to the show floor
            </p>
            <ALink href="#studio">More about Mehrnaz</ALink>
          </div>
          <span className="hero2__scroll" aria-hidden>
            Scroll
          </span>
          <div className="hero2__feature">
            <p className="t-label">{projectTitle(featured)}</p>
            <ALink href={`/projects/${featured.slug}`}>View the project</ALink>
          </div>
        </div>
      </section>

      <section id="studio" className="intro">
        <Reveal>
          <p className="t-statement intro__statement">
            Serving brands on the show floor, I design and deliver custom
            exhibition stands — from concept and 3D visualisation to
            fabrication and on-site installation, across Europe, the Middle
            East and Asia.
          </p>
        </Reveal>
        <div className="intro__cols">
          <div>
            <p>
              From MWC Barcelona to Web Summit Qatar and the Farnborough
              International Airshow, my stands are designed to stop visitors
              mid-aisle — and engineered to survive the schedule of a live
              show.
            </p>
            <p>
              Working with trusted construction partners in nine countries, I
              follow every project personally from the first sketch to
              handover on site, so the stand that opens on day one is the
              stand the client approved in the render.
            </p>
          </div>
          <div className="intro__media">
            <Image
              src={imagePath(introProject.slug, heroImage(introProject).file)}
              alt={projectAlt(introProject)}
              width={gallery(introProject.slug)[0].width}
              height={gallery(introProject.slug)[0].height}
              sizes="(max-width: 860px) 100vw, 40vw"
            />
          </div>
        </div>
        <div className="intro__more">
          <ALink href="#contact">Get in touch</ALink>
        </div>
      </section>

      <section id="expertise" className="expertise" data-header-invert>
        <Reveal>
          <p className="t-statement expertise__statement">
            One designer, four stages: every stand follows the same path from
            idea to opening day.
          </p>
        </Reveal>
        <p className="expertise__note">
          Each stage can be commissioned on its own or run as one continuous
          chain — depending on the client, the venue and the deadline.
        </p>
        <ExpertiseProcess ambientImage={imagePath(featured.slug, featuredPanel.file)} />
        <div className="expertise__cta">
          <ALink href="#projects">See the projects</ALink>
        </div>
      </section>

      <section id="projects" className="projects2">
        <p className="t-label">Selected projects</p>
        <div className="projects2__grid">
          {visibleProjects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="card">
              <div className="card__media">
                <Parallax>
                  <Image
                    src={imagePath(project.slug, heroImage(project).file)}
                    alt={projectAlt(project)}
                    fill
                    sizes="(max-width: 860px) 100vw, 50vw"
                  />
                </Parallax>
              </div>
              <h2 className="card__title">
                {projectTitle(project)} {project.location?.split(",")[0] ?? ""}
              </h2>
              <span className="alink">
                Discover{" "}
                <span className="arw" aria-hidden>
                  ↘
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="logos" aria-label="Exhibitions and venues">
        <p className="t-label t-muted">Shows &amp; venues</p>
        <LogoWall rows={logoRows} />
      </section>

      <div className="designline t-label" aria-hidden>
        <span>Design</span>
        <span className="designline__rule" />
        <span>Build</span>
      </div>

      <section id="partners" className="partners">
        <div>
          <p className="t-label t-muted">Construction partners</p>
          <p className="t-statement partners__title">
            Built with trusted partners across nine countries.
          </p>
          <ul className="partner-list">
            {partnerNetwork.map((p) => (
              <li key={p.country}>
                <span>{p.country}</span>
                <span>{p.partner}</span>
              </li>
            ))}
          </ul>
          <div className="partners__email">
            <ALink href={`mailto:${site.email}`}>{site.email}</ALink>
          </div>
        </div>
        <Reveal>
          <WorldMap />
        </Reveal>
      </section>
    </main>
  );
}
