import { Link } from 'react-router-dom';
import { Trophy, Calendar } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage:
               'radial-gradient(ellipse at 30% 40%, rgba(92,122,62,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(201,169,97,0.25) 0%, transparent 60%)',
           }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="font-title text-pm-gold tracking-[0.4em] text-xs mb-4">
            LIGA · BELO HORIZONTE · DESDE 2024
          </div>
          <h1 className="font-title text-5xl md:text-6xl text-pm-cream leading-tight tracking-wide">
            Magic clássico,
            <span className="block text-pm-gold-hi italic">old frame</span>
            <span className="block">e nostalgia.</span>
          </h1>
          <p className="mt-6 font-body text-lg text-pm-parchment-2 max-w-lg leading-relaxed">
            A <strong className="text-pm-cream">Premodern Beagá</strong> é a liga oficiosa de Magic: The Gathering
            no formato <em>Premodern</em> em BH. Cartas de <strong className="text-pm-cream">4ª Edição até Scourge</strong>,
            comunidade acolhedora, decks lendários e o frame que todo mundo ama.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/ranking" className="btn-pm-gold">
              <Trophy size={18} /> VER RANKING
            </Link>
            <a href="#eventos" className="btn-pm">
              <Calendar size={18} /> PRÓXIMOS EVENTOS
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            <Stat label="ETAPAS" value="16" />
            <Stat label="JOGADORES" value="30+" />
            <Stat label="CARTAS DE EMPRÉSTIMO" value="30" />
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto w-72 md:w-96">
            <div className="absolute inset-0 -m-6 rounded-full bg-pm-green/30 blur-3xl" aria-hidden />
            <img
              src="/refs/logo.jpg"
              alt="Logo Premodern Beagá"
              className="relative rounded-full ring-4 ring-pm-gold ring-offset-8 ring-offset-pm-bg shadow-card-lift"
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-pm-bg border border-pm-gold rounded-sm font-title text-pm-gold tracking-[0.3em] text-xs">
              EST. 2024
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-title font-bold text-3xl text-pm-gold-hi">{value}</div>
      <div className="font-title text-pm-parchment-2 tracking-widest text-[10px] mt-1">{label}</div>
    </div>
  );
}
