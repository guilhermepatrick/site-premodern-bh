import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, ChevronRight } from 'lucide-react';
import Section from '../components/ui/Section';
import { useStagesList, type StageSummary } from '../hooks/useStages';

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function StagesListPage() {
  const { data, loading, error } = useStagesList();

  return (
    <>
      <header className="relative overflow-hidden">     
      </header>

      <Section eyebrow="TEMPORADA 2026" title="Lista completa" id="lista">
        {loading && (
          <p className="text-center italic text-pm-parchment-2">Carregando etapas...</p>
        )}
        {error && (
          <p className="text-center text-red-400">Erro: {error}</p>
        )}
        {data && data.length === 0 && (
          <p className="text-center italic text-pm-parchment-2">
            Nenhuma etapa registrada ainda.
          </p>
        )}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.map((s) => (
              <StageCard key={s.id} stage={s} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

function StageCard({ stage }: { stage: StageSummary }) {
  const winner = stage.topThree[0];

  return (
    <Link
      to={`/etapas/${stage.id}`}
      className="frame-card-gold p-2 block group hover:-translate-y-0.5 transition"
    >
      <div className="name-box rounded-t-sm">
        <span className="truncate">{stage.name}</span>
        <ChevronRight size={16} className="text-pm-frame shrink-0" />
      </div>
      <div className="parchment-texture m-1 p-4 rounded-sm">
        <div className="flex items-center gap-4 text-pm-ink text-sm mb-4">
          <span className="inline-flex items-center gap-1">
            <Calendar size={14} className="text-pm-frame" />
            {formatDate(stage.eventDate)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={14} className="text-pm-frame" />
            {stage.participantsCount} jogadores
          </span>
          {stage.rounds && (
            <span className="inline-flex items-center gap-1 text-pm-frame italic">
              {stage.rounds} rodadas
            </span>
          )}
        </div>

        {stage.topThree.length > 0 && (
          <div className="border-t border-pm-frame/30 pt-3">
            <div className="flex items-center gap-2 text-pm-frame text-[10px] font-title tracking-widest mb-2">
              <Trophy size={12} /> PODIO
            </div>
            <ol className="space-y-1">
              {stage.topThree.map((p) => (
                <li key={p.position} className="flex items-center justify-between text-pm-ink text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className={`gold-seal w-5 h-5 text-[10px] ${
                        p.position === 1 ? '' : 'opacity-80'
                      }`}
                    >
                      {p.position}
                    </span>
                    <span className={p.position === 1 ? 'font-title font-semibold' : ''}>
                      {p.name}
                    </span>
                  </span>
                  <span className="font-title text-pm-frame text-xs">{p.points} pts</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {winner && stage.topThree.length === 0 && (
          <p className="italic text-pm-ink/60 text-sm">Sem resultados registrados.</p>
        )}
      </div>
    </Link>
  );
}
