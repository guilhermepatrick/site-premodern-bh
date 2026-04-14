import Section from '../ui/Section';
import { Calendar, Wallet, Users, Trophy } from 'lucide-react';

const steps = [
  { icon: Users,    title: 'Apareça',          text: 'Chegue no Vault of Cards no domingo da etapa. Não precisa avisar — só vir.' },
  { icon: Wallet,   title: 'Pague a inscrição', text: 'R$70 por etapa. O valor sustenta os prêmios, o ranking e os sorteios.' },
  { icon: Calendar, title: 'Jogue as rodadas',  text: '12 terças + 3 domingos + 1 final. Cada vitória gera pontos pro ranking.' },
  { icon: Trophy,   title: 'Suba no ranking',   text: 'Top 8 disputa as finais, Cube Draft especial e o cobiçado troféu Geriatria.' },
];

export default function HowToJoin() {
  return (
    <Section id="participar" eyebrow="COMO PARTICIPAR" title="Entre na liga">
      <div className="grid md:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="frame-card p-2 relative">
            <div className="name-box rounded-t-sm">
              <span className="text-base">{i + 1}. {step.title}</span>
              <span className="text-pm-frame text-xs">●</span>
            </div>
            <div className="parchment-texture m-1 p-5 rounded-sm flex flex-col items-center text-center">
              <step.icon size={48} className="text-pm-green-deep mb-3" strokeWidth={1.5} />
              <p className="font-body text-pm-ink leading-relaxed">{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 frame-card-gold p-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <img
            src="/refs/regulamento.png"
            alt="Regulamento da liga Premodern Beagá"
            className="rounded-sm border border-pm-frame max-h-64 mx-auto"
          />
          <div>
            <h3 className="font-title text-pm-ink text-2xl mb-3 tracking-wide">Regulamento da temporada</h3>
            <ul className="font-body text-pm-ink space-y-1 leading-relaxed">
              <li>· <strong>16 etapas</strong> por temporada</li>
              <li>· <strong>12 terças</strong> + <strong>3 domingos</strong> + <strong>Top 8 Finals</strong></li>
              <li>· Inscrição: <strong>R$70 por etapa</strong></li>
              <li>· Cube Draft especial e sorteios de staples</li>
              <li>· Ranking acumulativo + invitational pro Top 8</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
