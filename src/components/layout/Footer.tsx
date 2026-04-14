import { Instagram, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-pm-frame bg-pm-bg-2">
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-pm-gold to-transparent" />
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-pm-cream">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src="/refs/logo.jpg" alt="Premodern Beagá" className="w-12 h-12 rounded-full ring-2 ring-pm-gold" />
            <div>
              <div className="font-title font-bold tracking-wider">PREMODERN</div>
              <div className="font-title text-pm-gold text-xs tracking-[0.3em]">BEAGÁ</div>
            </div>
          </div>
          <p className="font-body text-pm-parchment-2 text-sm">
            Liga de Magic: The Gathering — formato Premodern em Belo Horizonte. Cartas clássicas, old frame, comunidade que respira nostalgia.
          </p>
        </div>

        <div>
          <h4 className="font-title text-pm-gold mb-3 tracking-wider">ONDE NOS ENCONTRAR</h4>
          <ul className="space-y-2 font-body text-pm-parchment-2 text-sm">
            <li className="flex items-center gap-2"><MapPin size={16} /> Vault of Cards — Belo Horizonte/MG</li>
            <li className="flex items-center gap-2"><Instagram size={16} />
              <a href="https://www.instagram.com/premodernbeaga/" target="_blank" rel="noreferrer" className="hover:text-pm-gold-hi">@premodernbeaga</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-title text-pm-gold mb-3 tracking-wider">SOBRE O FORMATO</h4>
          <p className="font-body text-pm-parchment-2 text-sm">
            Cartas de <span className="text-pm-cream">4ª Edição (1995)</span> até <span className="text-pm-cream">Scourge (2003)</span>.
            Old frame, decks de 60 cartas + 15 de sideboard, banlist enxuta.
          </p>
        </div>
      </div>

      <div className="border-t border-pm-frame">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center font-body text-xs text-pm-parchment-2/80">
          © {new Date().getFullYear()} Liga Premodern Beagá · Site não-oficial · Magic: The Gathering é © Wizards of the Coast.
        </div>
      </div>
    </footer>
  );
}
