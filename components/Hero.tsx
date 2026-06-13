import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-surface relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(59,130,246,0.06) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-6 block">
            Web Developer &amp; Builder
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy leading-tight tracking-tight mb-6">
            Websites built for your business, not your developer&apos;s portfolio.
          </h1>
          <p className="text-xl text-neutral-mid leading-relaxed mb-10">
            I build it. You run your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#work"
              className="bg-navy text-white font-semibold px-8 py-4 rounded-lg text-center hover:bg-navy/90 transition-all hover:-translate-y-0.5 shadow-sm"
            >
              See My Work
            </a>
            <a
              href="#contact"
              className="bg-blue-accent text-white font-semibold px-8 py-4 rounded-lg text-center hover:bg-blue-600 transition-all hover:-translate-y-0.5 shadow-sm"
            >
              Get in Touch
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <Image
              src="/me.jpg"
              alt="Jamey Rumph"
              fill
              className="object-cover rounded-2xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
