interface SectionProps {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}

export default function Section({ eyebrow, title, children, id }: SectionProps) {
  return (
    <section id={id} className="max-w-5xl mx-auto px-4 py-10 md:py-12">
      <header className="mb-8 text-center">
        {eyebrow && (
          <div className="font-title text-pm-gold tracking-[0.4em] text-xs mb-2 uppercase">
            {eyebrow}
          </div>
        )}
        <h2 className="font-title text-3xl md:text-4xl text-pm-cream tracking-wider">
          {title}
        </h2>
        <div className="gold-divider max-w-md mx-auto" />
      </header>
      {children}
    </section>
  );
}
