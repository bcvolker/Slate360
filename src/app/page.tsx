// ...final, single implementation as above...
"use client";
import { useState } from "react";
import { clsx } from "clsx";

const sections = [
  {
    id: "overview",
    title: "360° Overview",
    content:
      "Slate360 is your all-in-one platform for visualizing, organizing, and sharing knowledge. Experience a new dimension of productivity.",
    bgClass: "bg-white dark:bg-slate-800",
  },
  {
    id: "features",
    title: "Features",
    content:
      "- Interactive dashboards\n- Real-time collaboration\n- Customizable layouts\n- Secure cloud storage",
    bgClass: "bg-slate-100 dark:bg-slate-700",
  },
  {
    id: "why",
    title: "Why Slate360?",
    content:
      "Built for teams and individuals who want clarity, speed, and control over their digital workspace.",
    bgClass: "bg-white dark:bg-slate-800",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Section({ section, isLast, index }: { section: any; isLast: any; index: any }) {
  const isOdd = index % 2 !== 0;
  return (
    <section
      id={section.id}
      className={clsx(
        "scroll-section py-16 px-4 md:px-0 transition-colors duration-300",
        section.bgClass,
        isOdd ? "md:flex-row-reverse" : "md:flex-row"
      )}
    >
      <div className={clsx("max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8", isOdd ? "md:flex-row-reverse" : "")}
      >
        <div className="flex-1">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-slate360-blue mb-4 drop-shadow-lg">{section.title}</h2>
          <p className="font-inter text-lg text-slate-700 dark:text-slate-200 whitespace-pre-line">{section.content}</p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-48 h-48 bg-slate360-blue/10 rounded-2xl flex items-center justify-center shadow-lg">
            {/* Placeholder for illustration */}
            <span className="text-6xl">🌐</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate360-blue/10 dark:from-slate-900 dark:to-slate-800">
      <div className="pt-8 pb-4">
        <h1 className="font-orbitron text-5xl md:text-6xl text-center font-bold text-slate360-blue drop-shadow-lg mb-4">Welcome to Slate360</h1>
        <p className="font-inter text-xl text-center text-slate-700 dark:text-slate-200 max-w-2xl mx-auto mb-8">
          The next generation knowledge platform for teams and creators.
        </p>
      </div>
      {/* Desktop sections */}
      <div className="hidden md:block">
        {sections.map((section, i) => (
          <Section key={section.id} section={section} isLast={i === sections.length - 1} index={i} />
        ))}
      </div>
      {/* Mobile accordion */}
      <div className="md:hidden px-2">
        {sections.map((section, i) => (
          <div key={section.id} className="mb-4">
            <button
              className={clsx(
                "w-full flex justify-between items-center px-4 py-3 rounded-lg shadow font-orbitron text-xl font-bold text-slate360-blue bg-white dark:bg-slate-800",
                openIndex === i ? "ring-2 ring-slate360-blue" : ""
              )}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
              aria-controls={`section-content-${i}`}
            >
              {section.title}
              <span>{openIndex === i ? "−" : "+"}</span>
            </button>
            <div
              id={`section-content-${i}`}
              className={clsx(
                "transition-all duration-300 overflow-hidden",
                openIndex === i ? "max-h-96 py-4 px-2" : "max-h-0"
              )}
              style={{ pointerEvents: openIndex === i ? "auto" : "none" }}
            >
              <p className="font-inter text-base text-slate-700 dark:text-slate-200 whitespace-pre-line">{section.content}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}