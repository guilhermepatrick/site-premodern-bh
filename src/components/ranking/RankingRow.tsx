import type { RankingEntry } from '../../types/domain';
import PowerToughnessBox from '../ui/PowerToughnessBox';

interface RankingRowProps {
  entry: RankingEntry;
}

export default function RankingRow({ entry }: RankingRowProps) {
  const isTop8 = entry.position <= 8;

  return (
    <tr className={`border-b border-pm-brown/40 ${isTop8 ? 'bg-pm-gold/15' : 'bg-pm-cream/40'} hover:bg-pm-cream/70 transition`}>
      <td className="py-3 px-2 md:px-4">
        {isTop8 ? (
          <span className="gold-seal w-9 h-9 text-sm">{entry.position}</span>
        ) : (
          <span className="font-title text-pm-frame font-bold text-lg pl-2">{entry.position}</span>
        )}
      </td>
      <td className="py-3 px-2 md:px-4">
        <div className="font-title text-pm-ink text-base md:text-lg">{entry.player.name}</div>
        {entry.player.nickname && (
          <div className="font-body italic text-pm-frame text-xs">"{entry.player.nickname}"</div>
        )}
      </td>
      <td className="py-3 px-2 md:px-4 text-center">
        <span className="font-body text-pm-ink">{entry.eventsPlayed}</span>
      </td>
      <td className="py-3 px-2 md:px-4 text-center">
        <span className="font-title text-pm-ink font-semibold">{entry.winRate.toFixed(1)}%</span>
      </td>
      <td className="py-3 px-2 md:px-4">
        <div className="flex justify-end">
          <PowerToughnessBox power={entry.points} size="md" />
        </div>
      </td>
    </tr>
  );
}
