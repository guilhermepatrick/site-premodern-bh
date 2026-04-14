import type { RankingEntry } from '../../types/domain';
import RankingRow from './RankingRow';

interface RankingTableProps {
  entries: RankingEntry[];
}

export default function RankingTable({ entries }: RankingTableProps) {
  return (
    <div className="frame-card p-2">
      <div className="name-box rounded-t-sm">
        <span>Classificação geral</span>
        <span className="text-pm-frame text-xs">⚜</span>
      </div>

      <div className="parchment-texture m-1 p-2 md:p-4 rounded-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-pm-frame">
              <th className="text-left py-2 px-2 md:px-4 font-title text-pm-frame text-xs tracking-widest">POS</th>
              <th className="text-left py-2 px-2 md:px-4 font-title text-pm-frame text-xs tracking-widest">JOGADOR</th>
              <th className="hidden sm:table-cell py-2 px-2 md:px-4 font-title text-pm-frame text-xs tracking-widest text-center">ETAPAS</th>
              <th className="hidden md:table-cell py-2 px-2 md:px-4 font-title text-pm-frame text-xs tracking-widest text-center">VAR.</th>
              <th className="text-right py-2 px-2 md:px-4 font-title text-pm-frame text-xs tracking-widest">PONTOS</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <RankingRow key={entry.player.id} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="type-line mx-1 mb-1 rounded-sm flex items-center justify-between italic text-xs">
        <span>{entries.length} jogadores</span>
        <span>Liga Premodern Beagá · Temporada atual</span>
      </div>
    </div>
  );
}
