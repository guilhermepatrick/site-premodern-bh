import { ReactNode } from 'react';

type Variant = 'brown' | 'gold' | 'green';

interface CardFrameProps {
  variant?: Variant;
  name?: string;
  typeLine?: string;
  symbol?: ReactNode;
  children: ReactNode;
  pt?: ReactNode;
  className?: string;
}

const variantClass: Record<Variant, string> = {
  brown: 'frame-card',
  gold:  'frame-card-gold',
  green: 'frame-card-green',
};

/**
 * Wrapper que reproduz o "old frame" das cartas pre-Mirrodin:
 *  - moldura externa marrom/dourada/verde
 *  - name box (linha do titulo)
 *  - art box (children, geralmente uma imagem)
 *  - type line
 *  - text box em pergaminho
 *  - opcional: P/T no canto inferior direito
 */
export default function CardFrame({
  variant = 'brown',
  name,
  typeLine,
  symbol,
  children,
  pt,
  className = '',
}: CardFrameProps) {
  return (
    <article className={`${variantClass[variant]} ${className} p-2`}>
      {name && (
        <div className="name-box rounded-t-sm">
          <span className="text-base md:text-lg">{name}</span>
          {symbol && <span className="text-pm-frame">{symbol}</span>}
        </div>
      )}

      <div className="bg-pm-bg-2/30 m-1 mb-0 p-1">
        <div className="overflow-hidden rounded-sm border border-pm-frame">
          {children}
        </div>
      </div>

      {typeLine && (
        <div className="type-line mx-1 mt-1 flex items-center justify-between rounded-sm">
          <span>{typeLine}</span>
          {symbol && <span className="text-pm-frame text-xs opacity-80">{symbol}</span>}
        </div>
      )}

      {pt && (
        <div className="absolute bottom-2 right-2">
          <div className="pt-box w-14 h-9 text-base">{pt}</div>
        </div>
      )}
    </article>
  );
}
