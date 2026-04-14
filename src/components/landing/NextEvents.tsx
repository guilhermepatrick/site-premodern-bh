import Section from '../ui/Section';
import { Calendar, MapPin, Clock, Wallet } from 'lucide-react';

interface EventItem {
  date: string;
  weekday: string;
  title: string;
  venue: string;
  time: string;
  fee: string;
  highlight?: boolean;
}

const events: EventItem[] = [
  { date: '04/MAI', weekday: 'DOM', title: 'Etapa 6 — Premodern Beagá',  venue: 'Vault of Cards', time: '10:00', fee: 'R$70', highlight: true },
  { date: '13/MAI', weekday: 'TER', title: 'Etapa 7 — Quinta-feira Eterna', venue: 'Vault of Cards', time: '19:30', fee: 'R$70' },
  { date: '01/JUN', weekday: 'DOM', title: 'Etapa 8 — Cube Draft',       venue: 'Vault of Cards', time: '10:00', fee: 'R$70' },
];

export default function NextEvents() {
  return (
    <Section id="eventos" eyebrow="AGENDA" title="Próximos eventos">
      <div className="grid md:grid-cols-3 gap-6">
        {events.map((ev, i) => (
          <article
            key={i}
            className={`${ev.highlight ? 'frame-card-gold' : 'frame-card'} p-2 relative`}
          >
            <div className="name-box rounded-t-sm">
              <span>{ev.title}</span>
              <span className="text-pm-frame text-xs">{ev.weekday}</span>
            </div>

            <div className="parchment-texture m-1 p-5 rounded-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="font-title font-black text-pm-ink text-4xl">{ev.date}</div>
                {ev.highlight && (
                  <span className="gold-seal w-14 h-14 text-xs tracking-wider">PRÓX</span>
                )}
              </div>

              <ul className="font-body text-pm-ink space-y-1 text-sm">
                <li className="flex items-center gap-2"><Clock size={14} /> {ev.time}</li>
                <li className="flex items-center gap-2"><MapPin size={14} /> {ev.venue}</li>
                <li className="flex items-center gap-2"><Wallet size={14} /> {ev.fee}</li>
              </ul>
            </div>

            <div className="type-line mx-1 mb-1 rounded-sm flex items-center justify-center gap-2">
              <Calendar size={12} /> Etapa oficial
            </div>
          </article>
        ))}
      </div>

      <p className="text-center mt-8 font-body italic text-pm-parchment-2">
        Confirme sempre no <a href="https://www.instagram.com/premodernbeaga/" target="_blank" rel="noreferrer" className="text-pm-gold-hi underline">Instagram da liga</a> antes de aparecer.
      </p>
    </Section>
  );
}
