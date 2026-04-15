import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Users, Gavel } from 'lucide-react';
import Section from '../components/ui/Section';
import PowerToughnessBox from '../components/ui/PowerToughnessBox';
import { useStageDetail } from '../hooks/useStages';

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function StageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useStageDetail(id);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center italic text-pm-parchment-2">
        Carregando etapa...
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center text-red-400">
        {error ?? 'Etapa nao encontrada.'}
      </div>
    );
  }

  const maxPoints = (data.rounds ?? 4) * 3;

  return (
    <>
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 50% 0%, rgba(201,169,97,0.6) 0%, transparent 60%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-12 text-center">
          <Link
            to="/etapas"
            className="inline-flex items-center gap-1 text-pm-cream hover:text-pm-gold-hi text-sm font-title tracking-wider mb-3"
          >
            <ChevronLeft size={14} /> voltar
          </Link>
          <div className="font-title text-pm-gold tracking-[0.4em] text-xs mb-3">ETAPA</div>
          <h1 className="font-title text-4xl md:text-5xl text-pm-cream tracking-wide">
            {data.name}
          </h1>
          <div className="gold-divider max-w-md mx-auto" />
          <div className="flex items-center justify-center gap-6 text-pm-parchment-2 text-sm font-body">
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} /> {formatDate(data.eventDate)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={14} /> {data.results.length} jogadores
            </span>
            {data.rounds && (
              <span className="inline-flex items-center gap-1">
                <Gavel size={14} /> {data.rounds} rodadas
              </span>
            )}
          </div>
        </div>
      </header>

      <Section eyebrow="CLASSIFICACAO" title="Resultado da etapa" id="resultado">
        <div className="frame-card p-2">
          <div className="name-box rounded-t-sm">
            <span>
              Maximo possivel: {maxPoints} pts · Vencedor: {data.results[0]?.name ?? '—'}
            </span>
            <span className="text-pm-frame text-xs">⚜</span>
          </div>
          <div className="parchment-texture m-1 p-2 md:p-4 rounded-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-pm-frame">
                  <th className="text-left py-2 px-2 md:px-4 font-title text-pm-frame text-xs tracking-widest">POS</th>
                  <th className="text-left py-2 px-2 md:px-4 font-title text-pm-frame text-xs tracking-widest">JOGADOR</th>
                  <th className="text-right py-2 px-2 md:px-4 font-title text-pm-frame text-xs tracking-widest">PONTOS</th>
                </tr>
              </thead>
              <tbody>
                {data.results.map((r) => {
                  const isTop8 = r.position <= 8;
                  return (
                    <tr
                      key={r.playerId}
                      className={`border-b border-pm-brown/40 ${isTop8 ? 'bg-pm-gold/15' : 'bg-pm-cream/40'} hover:bg-pm-cream/70 transition`}
                    >
                      <td className="py-2 px-2 md:px-4">
                        {isTop8 ? (
                          <span className="gold-seal w-8 h-8 text-sm">{r.position}</span>
                        ) : (
                          <span className="font-title text-pm-frame font-bold text-base pl-2">
                            {r.position}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 md:px-4 font-title text-pm-ink">{r.name}</td>
                      <td className="py-2 px-2 md:px-4">
                        <div className="flex justify-end">
                          <PowerToughnessBox power={r.points} size="sm" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="type-line mx-1 mb-1 rounded-sm flex items-center justify-between italic text-xs">
            <span>{data.results.length} participantes</span>
            <span>Liga Premodern Beagá</span>
          </div>
        </div>
      </Section>
    </>
  );
}
