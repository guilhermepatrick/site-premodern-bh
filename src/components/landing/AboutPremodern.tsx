import Section from '../ui/Section';
import CardFrame from '../ui/CardFrame';

export default function AboutPremodern() {
  return (
    <Section id="formato" eyebrow="O FORMATO" title="O que é Premodern">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CardFrame
            variant="brown"
            name="Premodern"
            typeLine="Eternal Format — Old Frame"
            symbol={<span className="font-title">★</span>}
          >
            <img
              src="/refs/cards-table.png"
              alt="Cartas Premodern sobre a mesa"
              className="w-full h-64 object-cover"
            />
          </CardFrame>

          <div className="parchment-texture mt-3 p-6 rounded-sm shadow-old-frame text-pm-ink">
            <p className="font-body text-base md:text-lg leading-relaxed">
              <strong>Premodern</strong> é um formato eterno de Magic: The Gathering criado em <strong>2003 por Martin Berlin</strong>.
              Permite cartas de <strong>4ª Edição (1995)</strong> até <strong>Scourge (2003)</strong> — a "era de ouro" do jogo,
              entre o Old School e o Modern.
            </p>
            <p className="font-body text-base md:text-lg leading-relaxed mt-3 italic">
              É o formato perfeito pra revisitar Psychatog, Goblins, The Rock, Madness e tantos outros
              decks lendários — sem o custo absurdo de Legacy ou Vintage. Tudo no <strong>old frame</strong>,
              do jeito que Magic sempre foi.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <FactCard label="SETS LEGAIS" value="4ED → SCG" caption="4ª Edição até Scourge (1995–2003)" />
          <FactCard label="DECK" value="60 + 15" caption="60 cartas + sideboard" />
          <FactCard label="FRAME" value="OLD" caption="Pre-Mirrodin / pre-Modern" />
          <FactCard label="BANLIST" value="ENXUTA" caption="Foco em meta saudável" />
        </div>
      </div>
    </Section>
  );
}

function FactCard({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="frame-card-gold p-4 text-center">
      <div className="font-title text-pm-frame text-[10px] tracking-[0.3em]">{label}</div>
      <div className="font-title text-2xl font-black text-pm-ink mt-1">{value}</div>
      <div className="font-body italic text-pm-frame text-sm mt-1">{caption}</div>
    </div>
  );
}
