import { useRanking } from '../hooks/useRanking';
import RankingTable from '../components/ranking/RankingTable';
import Top8Banner from '../components/ranking/Top8Banner';
import Section from '../components/ui/Section';

export default function RankingPage() {
  const { season, updatedAt, entries } = useRanking();
  const updated = new Date(updatedAt).toLocaleDateString('pt-BR');

  return (
    <>
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-25"
             style={{
               backgroundImage:
                 'radial-gradient(ellipse at 50% 0%, rgba(201,169,97,0.6) 0%, transparent 60%)',
             }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="font-title text-pm-gold tracking-[0.4em] text-xs mb-3">
            CLASSIFICAÇÃO OFICIAL
          </div>
          <h1 className="font-title text-4xl md:text-5xl text-pm-cream tracking-wide">
            Ranking · {season.name}
          </h1>
          <div className="gold-divider max-w-md mx-auto" />
          <p className="font-body italic text-pm-parchment-2">
            Atualizado em {updated} · {entries.length} jogadores ativos
          </p>
        </div>
      </header>

      <Section eyebrow="INVITATIONAL" title="Top 8 da temporada" id="top8">
        <Top8Banner entries={entries} />
      </Section>

      <Section eyebrow="TABELA COMPLETA" title="Ranking geral" id="tabela">
        <RankingTable entries={entries} />
      </Section>
    </>
  );
}
