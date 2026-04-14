import Section from '../ui/Section';

const items = [
  { src: '/refs/trophy.png',         caption: 'Geriatria 2025 — troféu de campeão',    variant: 'gold' as const },
  { src: '/refs/top8-bracket.png',   caption: 'Chaveamento Top 8 Finals',              variant: 'green' as const },
  { src: '/refs/loaner-cards.png',   caption: '30 staples disponíveis pra empréstimo', variant: 'brown' as const },
  { src: '/refs/players-event.png',  caption: 'Jogadores em uma das etapas',           variant: 'green' as const },
  { src: '/refs/event-poster.png',   caption: 'Etapa 3 — Vault of Cards',              variant: 'brown' as const },
  { src: '/refs/tokens.png',         caption: 'Tokens exclusivos da liga',             variant: 'gold' as const },
];

const variantToClass = {
  brown: 'frame-card',
  gold:  'frame-card-gold',
  green: 'frame-card-green',
};

export default function Gallery() {
  return (
    <Section id="galeria" eyebrow="MOMENTOS" title="A liga em ação">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <figure key={item.src} className={`${variantToClass[item.variant]} p-2 group`}>
            <div className="overflow-hidden rounded-sm border border-pm-frame m-1">
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-56 object-cover transition group-hover:scale-105"
              />
            </div>
            <figcaption className="type-line mx-1 mt-1 rounded-sm flex items-center justify-center text-center">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
