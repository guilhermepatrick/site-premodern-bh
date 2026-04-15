import { Crown } from 'lucide-react';
import type { RankingEntry } from '../../types/domain';
import PowerToughnessBox from '../ui/PowerToughnessBox';

interface Top8BannerProps {
  entries: RankingEntry[];
}

export default function Top8Banner({ entries }: Top8BannerProps) {
  const top8 = entries.slice(0, 8);

  return (
    <div className="frame-card-gold p-2">
      <div className="name-box rounded-t-sm">
        <span className="flex items-center gap-2"><Crown size={18} /> TOP 8 — INVITATIONAL</span>
        <span className="text-pm-frame text-xs">★</span>
      </div>

      <div className="parchment-texture m-1 p-5 rounded-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {top8.map((entry) => (
            <div
              key={entry.player.id}
              className="bg-pm-cream/60 border border-pm-brown rounded-sm p-3 text-center relative"
            >
              <div className="absolute -top-3 -left-2">
                <span className="gold-seal w-7 h-7 text-xs">{entry.position}</span>
              </div>
              <div className="font-title text-pm-ink text-sm md:text-base mt-2 truncate">
                {entry.player.name}
              </div>
              <div className="mt-2 flex justify-center">
                <PowerToughnessBox power={entry.points} size="sm" />
              </div>
              <div className="mt-1 text-[10px] font-title tracking-wider text-pm-frame">
                {entry.winRate.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="type-line mx-1 mb-1 rounded-sm flex items-center justify-center italic">
        Os 8 primeiros disputam as Finais ao fim da temporada
      </div>
    </div>
  );
}
