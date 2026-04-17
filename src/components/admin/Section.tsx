interface SectionProps {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}

export default function Section({ eyebrow, title, children, id }: SectionProps) {
  return (
    <section id={id} className="max-w-5xl mx-auto px-4 py-10">
      {eyebrow && (
        <p className="font-title text-vc-cyan text-xs tracking-[0.3em] uppercase mb-1">{eyebrow}</p>
      )}
      <h2 className="font-title font-700 text-2xl text-vc-white mb-6 uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </section>
  );
}
