import type { EventType } from '../../lib/stagesStorage';

interface Props {
  value: EventType;
  onChange: (v: EventType) => void;
  disabled?: boolean;
}

const OPTIONS: Array<{ value: EventType; label: string; hint: string }> = [
  { value: 'semanal', label: 'Semanal', hint: 'Torneio avulso' },
  { value: 'liga', label: 'Liga', hint: 'Etapa de liga oficial' },
];

export default function EventTypeSelect({ value, onChange, disabled }: Props) {
  return (
    <fieldset disabled={disabled} className="flex flex-col gap-2">
      <legend className="font-title text-xs tracking-[0.25em] uppercase text-pm-parchment-2">
        Tipo de evento
      </legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo de evento">
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={`px-5 py-2 rounded-full text-sm font-title font-600 uppercase tracking-widest border transition-all ${
                active
                  ? 'bg-pm-green border-pm-green text-pm-cream'
                  : 'bg-transparent border-pm-frame text-pm-parchment-2 hover:border-pm-gold hover:text-pm-cream'
              }`}
            >
              <span>{opt.label}</span>
              <span className="block text-[10px] tracking-normal normal-case font-body font-400 opacity-70">
                {opt.hint}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
