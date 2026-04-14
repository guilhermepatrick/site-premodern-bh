import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ id, eyebrow, title, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`max-w-6xl mx-auto px-4 py-12 md:py-16 ${className}`}>
      <header className="mb-8 text-center">
        {eyebrow && (
          <div className="font-title text-pm-gold tracking-[0.4em] text-xs mb-2">
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
