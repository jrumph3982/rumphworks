import Link from "next/link";

type ServiceHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  titleClassName?: string;
};

export default function ServiceHero({ eyebrow, title, intro, titleClassName = "max-w-3xl" }: ServiceHeroProps) {
  return (
    <section className="pt-40 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/#services"
          className="text-xs font-semibold tracking-widest uppercase text-neutral-mid hover:text-blue-accent transition-colors mb-8 inline-block"
        >
          ← All Services
        </Link>
        <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
          {eyebrow}
        </span>
        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy leading-tight tracking-tight mb-6 ${titleClassName}`}>
          {title}
        </h1>
        <p className="text-lg lg:text-xl text-neutral-mid leading-relaxed max-w-2xl">
          {intro}
        </p>
      </div>
    </section>
  );
}
