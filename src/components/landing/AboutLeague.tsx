import Section from '../ui/Section';

export default function AboutLeague() {
  return (
    <Section id="liga" eyebrow="A LIGA" title="Premodern Beagá">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="frame-card-green p-2">
          <div className="name-box rounded-t-sm">
            <span>Comunidade Premodern de BH</span>
            <span className="text-pm-frame">⚔</span>
          </div>
          <img
            src="/refs/team-photo.png"
            alt="Jogadores da liga Premodern Beagá"
            className="w-full h-72 object-cover m-1"
          />
          <div className="type-line mx-1 mt-1 rounded-sm">
            <span>Liga · Belo Horizonte · 2024–presente</span>
          </div>
          <div className="parchment-texture m-1 mt-1 p-4 rounded-sm">
            <p className="font-body text-pm-ink leading-relaxed">
              Mais que uma liga: uma irmandade de jogadores apaixonados pelo Magic clássico.
              Reunimos veteranos e novatos toda semana no <strong>Vault of Cards</strong> pra duelar com decks
              do início dos anos 2000 — e dividir histórias entre uma rodada e outra.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Pillar
            icon="⚜"
            title="Comunidade primeiro"
            text="Não importa se você joga há 20 anos ou está chegando agora — todo mundo tem espaço na mesa."
          />
          <Pillar
            icon="🃏"
            title="Empréstimo gratuito"
            text="Temos as 30 cartas mais caras do formato disponíveis pra empréstimo. Não deixe o preço te impedir de jogar."
          />
          <Pillar
            icon="🏆"
            title="Liga competitiva"
            text="16 etapas, ranking, Top 8 finals, Cube Draft e prêmio de fim de temporada — a Geriatria."
          />
          <Pillar
            icon="📅"
            title="Encontros regulares"
            text="Etapas quinzenais aos domingos, com inscrição acessível e sorteios de staples e acessórios."
          />
        </div>
      </div>
    </Section>
  );
}

function Pillar({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="gold-seal w-14 h-14 text-2xl flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-title text-pm-gold-hi text-xl tracking-wide">{title}</h3>
        <p className="font-body text-pm-parchment-2 mt-1 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
