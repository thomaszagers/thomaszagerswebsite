import { useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { urlFor } from "../lib/sanity";

type ProjectModalProject = {
  _id: string;
  name: string;
  role?: string;
  category?: string;
  logo?: unknown;
  image?: unknown;
  shortDescription?: string;
  description?: string;
  projectUrl?: string;
};

type ProjectModalProps = {
  projects: ProjectModalProject[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onClose: () => void;
};

function formatCategory(category?: string) {
  if (!category) return "";

  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getProjectHero(project: ProjectModalProject) {
  return project.image || project.logo || null;
}

export default function ProjectModal({
  projects,
  selectedProjectId,
  onSelectProject,
  onClose,
}: ProjectModalProps) {
  const selectedProject =
    projects.find((project) => project._id === selectedProjectId) || projects[0];

  const selectedIndex = useMemo(() => {
    return projects.findIndex((project) => project._id === selectedProject?._id);
  }, [projects, selectedProject]);

  const previousProject = selectedIndex > 0 ? projects[selectedIndex - 1] : null;

  const nextProject =
    selectedIndex >= 0 && selectedIndex < projects.length - 1
      ? projects[selectedIndex + 1]
      : null;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && previousProject) {
        onSelectProject(previousProject._id);
      }
      if (event.key === "ArrowRight" && nextProject) {
        onSelectProject(nextProject._id);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [nextProject, onClose, onSelectProject, previousProject]);

  if (!selectedProject) return null;

  const selectedHero = getProjectHero(selectedProject);

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/55 px-3 py-3 backdrop-blur-md sm:px-6 sm:py-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden border border-white/20 bg-[var(--background)] shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Sluit projecten"
          className="absolute right-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/90 text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:right-5 sm:top-5 sm:h-12 sm:w-12"
        >
          <X size={20} />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-8 sm:px-8 sm:pb-10 sm:pt-12 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-[6px] w-20 bg-[var(--accent)] sm:mb-5 sm:w-24" />

              <h2 className="text-center text-2xl font-semibold uppercase tracking-[0.16em] text-[var(--foreground)] sm:text-4xl md:text-5xl">
                Projecten
              </h2>
            </div>

            <div className="mt-7 lg:hidden">
              <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {projects.map((project) => {
                  const isActive = project._id === selectedProject._id;

                  return (
                    <button
                      key={project._id}
                      type="button"
                      onClick={() => onSelectProject(project._id)}
                      className={[
                        "min-w-[240px] snap-center border px-4 py-4 text-left transition-all duration-300",
                        isActive
                          ? "border-[var(--accent)] bg-white shadow-[0_14px_28px_rgba(36,61,120,0.10)]"
                          : "border-transparent bg-white/68 hover:bg-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={[
                            "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-300",
                            isActive ? "bg-[var(--accent)]" : "bg-[var(--border)]",
                          ].join(" ")}
                        />

                        <div>
                          <p className="text-base font-semibold leading-tight sm:text-lg">
                            {project.name}
                          </p>

                          {(project.category || project.role) && (
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                              {project.category ? formatCategory(project.category) : ""}
                              {project.category && project.role ? " • " : ""}
                              {project.role || ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => previousProject && onSelectProject(previousProject._id)}
                  disabled={!previousProject}
                  className="inline-flex items-center gap-2 border border-[var(--border)] bg-white/82 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Vorige
                </button>

                <button
                  type="button"
                  onClick={() => nextProject && onSelectProject(nextProject._id)}
                  disabled={!nextProject}
                  className="inline-flex items-center gap-2 border border-[var(--border)] bg-white/82 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Volgende
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
              <aside className="hidden self-start border border-white/50 bg-white/55 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.04)] backdrop-blur-sm lg:block">
                <div className="space-y-2.5">
                  {projects.map((project) => {
                    const isActive = project._id === selectedProject._id;

                    return (
                      <button
                        key={project._id}
                        type="button"
                        onClick={() => onSelectProject(project._id)}
                        className={[
                          "group relative w-full overflow-hidden border px-4 py-4 text-left transition-all duration-300",
                          isActive
                            ? "border-[var(--accent)] bg-white shadow-[0_14px_28px_rgba(36,61,120,0.10)]"
                            : "border-transparent bg-white/60 hover:bg-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "absolute inset-y-4 left-0 w-[3px] transition-all duration-300",
                            isActive
                              ? "bg-[var(--accent)] opacity-100"
                              : "bg-[var(--accent)] opacity-0 group-hover:opacity-40",
                          ].join(" ")}
                        />

                        <div className="pl-3">
                          <p className="text-lg font-semibold leading-tight">
                            {project.name}
                          </p>

                          {(project.category || project.role) && (
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                              {project.category ? formatCategory(project.category) : ""}
                              {project.category && project.role ? " • " : ""}
                              {project.role || ""}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <section className="border border-white/50 bg-white/58 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:p-5">
                <div className="overflow-hidden">
                  <div className="relative min-h-[250px] overflow-hidden bg-[linear-gradient(135deg,rgba(250,250,250,0.98),rgba(243,240,235,0.98))] sm:min-h-[340px] lg:min-h-[430px]">
                    {selectedHero ? (
                      <>
                        <img
                          src={urlFor(selectedHero)
                            .width(1800)
                            .height(1200)
                            .fit("crop")
                            .url()}
                          alt={selectedProject.name}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.24)_42%,rgba(0,0,0,0.05)_100%)]" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(248,248,248,0.96),rgba(236,233,228,0.96))]" />
                    )}

                    <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 pt-16 text-center text-white sm:px-10 sm:pb-10 sm:pt-20">
                      <h3 className="text-3xl font-semibold sm:text-5xl">
                        {selectedProject.name}
                      </h3>

                      {(selectedProject.category || selectedProject.role) && (
                        <p className="mt-3 text-sm text-white/90 sm:text-lg">
                          {selectedProject.category
                            ? formatCategory(selectedProject.category)
                            : ""}
                          {selectedProject.category && selectedProject.role ? " • " : ""}
                          {selectedProject.role || ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mx-auto mt-6 max-w-3xl text-center sm:mt-7">
                  <p className="text-[15px] leading-7 text-[var(--muted-foreground)] sm:text-lg sm:leading-8">
                    {selectedProject.description ||
                      selectedProject.shortDescription ||
                      "Meer informatie over dit project volgt hier zodra er extra projecttekst in de CMS staat."}
                  </p>

                  {selectedProject.projectUrl ? (
                    <div className="pt-5">
                      <a
                        href={selectedProject.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                      >
                        Bekijk project
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}