import Image from "next/image";
import ALink from "@/components/ALink";
import ExpertiseProcess from "@/components/ExpertiseProcess";
import LanguageToggle from "@/components/LanguageToggle";
import LogoWall from "@/components/LogoWall";
import Parallax from "@/components/Parallax";
import ProjectCardLink from "@/components/ProjectCardLink";
import Reveal from "@/components/Reveal";
import Ribbons from "@/components/Ribbons";
import { NavLinks } from "@/components/SiteHeader";
import T from "@/components/T";
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

export default function Home() {
  const featured = visibleProjects[0];
  const featuredPanel = heroImage(featured);
  const introProject = visibleProjects[2] ?? featured;
  const introImage = gallery(introProject.slug)[0];
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
          src={imagePath(featured.slug, featuredPanel.file)}
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
            <LanguageToggle className="hero2__lang-toggle" />
            <p className="t-label">
              <T k="heroTagline" />
            </p>
            <ALink href="#studio">
              <T k="moreAboutMehrnaz" />
            </ALink>
          </div>
          <span className="hero2__scroll" aria-hidden>
            <T k="scroll" />
          </span>
          <div className="hero2__feature">
            <p className="t-label">{projectTitle(featured)}</p>
            <ALink
              href={`/projects/${featured.slug}`}
              trackEvent={`project_click_${featured.slug}`}
              trackProps={{ client: featured.client, source: "hero" }}
            >
              <T k="viewTheProject" />
            </ALink>
          </div>
        </div>
      </section>

      <section id="studio" className="intro">
        <Reveal>
          <p className="t-statement intro__statement">
            <T k="introStatement" />
          </p>
        </Reveal>
        <div className="intro__cols">
          <div>
            <p>
              <T k="introP1" />
            </p>
            <p>
              <T k="introP2" />
            </p>
          </div>
          <figure className="intro__media">
            <Image
              src={imagePath(introProject.slug, introImage.file)}
              alt={projectAlt(introProject)}
              width={introImage.width}
              height={introImage.height}
              sizes="(max-width: 860px) 100vw, 40vw"
            />
          </figure>
        </div>
        <div className="intro__more">
          <ALink href="#contact" trackEvent="contact_click" trackProps={{ source: "intro-cta" }}>
            <T k="getInTouch" />
          </ALink>
        </div>
      </section>

      <section id="expertise" className="expertise" data-header-invert>
        <Reveal>
          <p className="t-statement expertise__statement">
            <T k="expertiseStatement" />
          </p>
        </Reveal>
        <p className="expertise__note">
          <T k="expertiseNote" />
        </p>
        <ExpertiseProcess ambientImage={imagePath(featured.slug, featuredPanel.file)} />
        <div className="expertise__cta">
          <ALink href="#projects">
            <T k="seeTheProjects" />
          </ALink>
        </div>
      </section>

      <section id="projects" className="projects2">
        <p className="t-label">
          <T k="selectedProjects" />
        </p>
        <div className="projects2__grid">
          {visibleProjects.map((project) => (
            <ProjectCardLink key={project.slug} slug={project.slug} client={project.client} className="card">
              <div className="card__media">
                <Parallax>
                  <Image
                    src={imagePath(project.slug, heroImage(project).file)}
                    alt={projectAlt(project)}
                    fill
                    quality={90}
                    sizes="(max-width: 860px) 120vw, 65vw"
                  />
                </Parallax>
              </div>
              <h2 className="card__title">
                {projectTitle(project)} {project.location?.split(",")[0] ?? ""}
              </h2>
              <span className="alink">
                <T k="discover" />{" "}
                <span className="arw" aria-hidden>
                  ↘
                </span>
              </span>
            </ProjectCardLink>
          ))}
        </div>
      </section>

      <section className="logos" aria-label="Exhibitions and venues">
        <p className="t-label t-muted">
          <T k="showsVenues" />
        </p>
        <LogoWall rows={logoRows} />
      </section>

      <div className="designline t-label" aria-hidden>
        <span>
          <T k="stageDesign" />
        </span>
        <span className="designline__rule" />
        <span>
          <T k="stageBuild" />
        </span>
      </div>

      <section id="partners" className="partners">
        <div>
          <p className="t-label t-muted">
            <T k="constructionPartners" />
          </p>
          <p className="t-statement partners__title">
            <T k="partnersTitle" />
          </p>
          <ul className="partner-list">
            {partnerNetwork.map((p) => (
              <li key={p.country}>
                <span>{p.country}</span>
              </li>
            ))}
          </ul>
          <div className="partners__email">
            <ALink href={`mailto:${site.email}`} trackEvent="email_click" trackProps={{ source: "partners" }}>
              {site.email}
            </ALink>
          </div>
        </div>
        <Reveal>
          <WorldMap />
        </Reveal>
      </section>
    </main>
  );
}
