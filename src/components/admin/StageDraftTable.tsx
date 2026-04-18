import { Trash2, UserPlus } from 'lucide-react';
import { isNewPlayer } from '../../lib/stagesStorage';
import type { StageResult } from '../../lib/stagesStorage';

export interface DraftRow extends StageResult {
  _key: string;
}

interface Props {
  rows: DraftRow[];
  known: Set<string>;
  onChange: (rows: DraftRow[]) => void;
  disabled?: boolean;
}

export default function StageDraftTable({ rows, known, onChange, disabled }: Props) {
  function update(key: string, patch: Partial<StageResult>) {
    onChange(rows.map((r) => (r._key === key ? { ...r, ...patch } : r)));
  }

  function remove(key: string) {
    onChange(rows.filter((r) => r._key !== key));
  }

  if (rows.length === 0) {
    return (
      <p className="text-pm-parchment-2 italic text-sm font-body">
        Nenhuma linha extraida ainda. Faca upload de um PDF.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-pm-frame rounded-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-pm-frame text-pm-gold uppercase tracking-wider text-xs font-title">
          <tr>
            <th className="px-3 py-2 text-left w-16">Pos</th>
            <th className="px-3 py-2 text-left">Jogador</th>
            <th className="px-3 py-2 text-left w-24">Pontos</th>
            <th className="px-3 py-2 w-12" aria-label="acoes" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isNew = row.name.trim().length > 0 && isNewPlayer(row.name, known);
            return (
              <tr key={row._key} className="border-t border-pm-frame hover:bg-pm-bg-2">
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    value={row.position}
                    disabled={disabled}
                    onChange={(e) => update(row._key, { position: Number(e.target.value) || 0 })}
                    className="w-14 bg-transparent border border-pm-frame rounded px-1.5 py-1 text-pm-cream text-right focus:outline-none focus:border-pm-gold"
                    aria-label="Posicao"
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={row.name}
                      disabled={disabled}
                      onChange={(e) => update(row._key, { name: e.target.value })}
                      className="flex-1 bg-transparent border border-pm-frame rounded px-2 py-1 text-pm-cream focus:outline-none focus:border-pm-gold"
                      aria-label="Nome do jogador"
                    />
                    {isNew && (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-widest bg-pm-gold/10 text-pm-gold border border-pm-gold/40"
                        title="Jogador novo — sera cadastrado"
                      >
                        <UserPlus size={10} />
                        Novo
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    value={row.points}
                    disabled={disabled}
                    onChange={(e) => update(row._key, { points: Number(e.target.value) || 0 })}
                    className="w-20 bg-transparent border border-pm-frame rounded px-1.5 py-1 text-pm-cream text-right focus:outline-none focus:border-pm-gold"
                    aria-label="Pontos"
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => remove(row._key)}
                    disabled={disabled}
                    className="text-pm-parchment-2 hover:text-red-400 transition-colors"
                    aria-label={`Remover linha ${row.position}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
