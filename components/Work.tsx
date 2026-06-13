"use client";
import { useState, useCallback } from "react";

type Project = {
  name: string;
  category: string;
  description: string;
  tags: string[];
  images: string[];
};

const projects: Project[] = [
  {
    name: "Baker Law Office",
    category: "Client Work",
    description:
      "A clean, professional site for a family law practice in Buffalo, NY. Built to establish trust quickly and make it easy for people in difficult situations to reach out.",
    tags: ["Business Website", "Law Firm", "Contact-Focused"],
    images: [
      "/portfolio/baker1.png",
      "/portfolio/baker2.png",
      "/portfolio/baker3.png",
    ],
  },
  {
    name: "Sandoval Home Improvement",
    category: "Client Work",
    description:
      "A full-featured contractor site serving Northern Virginia, DC, and Maryland. Services showcase, gallery, and multiple conversion points throughout.",
    tags: ["Business Website", "Contractor", "Lead Generation"],
    images: [
      "/portfolio/sal1.png",
      "/portfolio/sal2.png",
      "/portfolio/sal3.png",
    ],
  },
  {
    name: "Job Tracker",
    category: "Web Application",
    description:
      "A web app for tracking job applications from first contact to offer. Keeps every opportunity organized in one place so nothing falls through the cracks.",
    tags: ["Web App", "Full-Stack", "React"],
    images: [
      "/portfolio/job1.png",
      "/portfolio/job2.png",
      "/portfolio/job3.png",
      "/portfolio/job4.png",
    ],
  },
  {
    name: "Chore Quest",
    category: "Web Application",
    description:
      "A gamified chore tracking app for kids and families. Turns household tasks into an adventure with rewards and progress tracking.",
    tags: ["React", "Next.js", "Web App", "UX Design"],
    images: [
      "/portfolio/cq1.jpg",
      "/portfolio/cq2.jpg",
      "/portfolio/cq3.jpg",
      "/portfolio/cq4.jpg",
      "/portfolio/cq5.jpg",
    ],
  },
  {
    name: "Financial Check-In",
    category: "Web Application",
    description:
      "A guided financial planning tool for couples. Walks partners through honest conversations about money — no spreadsheets, no jargon, just clarity.",
    tags: ["Web App", "Interactive", "Personal Finance"],
    images: [
      "/portfolio/finance.png",
      "/portfolio/finance2.png",
      "/portfolio/finance3.png",
    ],
  },
  {
    name: "Destin Beach Travel Guide",
    category: "Website Design",
    description:
      "A rich, visually detailed travel brochure site for Destin, FL. Heavy on photography, content hierarchy, and responsive layout.",
    tags: ["Content Design", "Responsive", "Visual Design"],
    images: [
      "/portfolio/travel1.png",
      "/portfolio/travel2.png",
      "/portfolio/travel3.png",
      "/portfolio/travel4.png",
    ],
  },
];

function ChevronLeft() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const hasMultiple = project.images.length > 1;

  const goTo = useCallback(
    (next: number) => {
      if (fading) return;
      setFading(true);
      setTimeout(() => {
        setIdx(next);
        setFading(false);
      }, 180);
    },
    [fading]
  );

  const prev = () => goTo((idx - 1 + project.images.length) % project.images.length);
  const next = () => goTo((idx + 1) % project.images.length);

  return (
    <div className="bg-slate-bg border border-divider rounded-2xl overflow-hidden flex flex-col shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.05)]">
      {/* Image area */}
      <div className="relative h-[420px] overflow-hidden bg-slate-50 group">
        <img
          src={project.images[idx]}
          alt={`${project.name} — screen ${idx + 1}`}
          className={`w-full h-full object-contain transition-opacity duration-[180ms] ${
            fading ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />

        {hasMultiple && (
          <>
            <button
              onClick={prev}
              aria-label="Previous screenshot"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              aria-label="Next screenshot"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {project.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to screenshot ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    i === idx
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
            <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full pointer-events-none">
              {idx + 1} / {project.images.length}
            </div>
          </>
        )}
      </div>

      {/* Card content */}
      <div className="p-7 flex flex-col flex-1">
        <div className="text-blue-accent text-xs font-semibold tracking-widest uppercase mb-2">
          {project.category}
        </div>
        <h3 className="text-xl font-bold text-navy mb-3">{project.name}</h3>
        <p className="text-neutral-mid leading-relaxed mb-5 flex-1 text-sm">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-white border border-divider text-navy text-xs font-semibold px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  return (
    <section id="work" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
            Portfolio
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy tracking-tight">
            Selected Work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
