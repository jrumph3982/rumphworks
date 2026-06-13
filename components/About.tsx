import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-24 bg-slate-bg scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex justify-center lg:justify-start">
          <div className="relative w-72 h-72 lg:w-80 lg:h-80">
            <Image
              src="/me2.png"
              alt="Jamey Rumph"
              fill
              className="object-cover object-top rounded-2xl shadow-xl"
            />
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
            About
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy tracking-tight mb-6">
            Hi, I&apos;m Jamey
          </h2>
          <p className="text-lg text-neutral-mid leading-relaxed mb-5">
            I&apos;m a web developer focused on building websites and web
            applications for small businesses and entrepreneurs. I&apos;ve spent
            over 20 years working in technology, and what I&apos;ve learned is
            this: the best solution is the one you never have to think about.
          </p>
          <p className="text-lg text-neutral-mid leading-relaxed mb-8">
            My job is to build you something that looks great, works on every
            device, and actually helps your business grow then get out of your
            way so you can focus on what you do best.
          </p>
          <a
            href="#contact"
            className="inline-block bg-blue-accent text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-all hover:-translate-y-0.5 shadow-sm"
          >
            Work With Me
          </a>
        </div>
      </div>
    </section>
  );
}
