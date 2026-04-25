import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { sanityClient, urlFor } from "../lib/sanity";
import { projectsQuery } from "../lib/queries";
import type { ProjectData } from "../lib/types";

function formatCategory(category?: string) {
  if (!category) return "";
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch<ProjectData[]>(projectsQuery)
      .then((data) => setProjects(data || []))
      .catch((error) => console.error("Failed to fetch projects:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-section">
      <div className="container-shell space-y-12 sm:space-y-16">
        <PageHeader
          kicker="Projects"
          title="Current Bands & Collaborations"
          description="An overview of ensembles, bands, and musical collaborations in which Thomas Zagers is currently active."
        />

        {loading ? (
          <p className="text-[var(--muted-foreground)]">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-[var(--muted-foreground)]">
            No projects available at the moment.
          </p>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <article
                key={project._id}
                className="soft-card overflow-hidden rounded-[2rem]"
              >
                <div className="grid gap-0 md:grid-cols-[320px_1fr]">
                  <div className="bg-[var(--muted)]">
                    {project.image ? (
                      <img
                        src={urlFor(project.image)
                          .width(800)
                          .height(700)
                          .fit("crop")
                          .url()}
                        alt={project.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-[220px] items-center justify-center text-sm uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
                        Project Image
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                          {project.name}
                        </h2>

                        {project.isCurrent ? (
                          <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                            Active
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
                        {project.category ? (
                          <span>{formatCategory(project.category)}</span>
                        ) : null}
                        {project.role ? <span>{project.role}</span> : null}
                      </div>

                      {project.description ? (
                        <p className="leading-8 text-[var(--muted-foreground)]">
                          {project.description}
                        </p>
                      ) : null}

                      {project.projectUrl ? (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                        >
                          Visit project →
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
