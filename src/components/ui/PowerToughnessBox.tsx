interface PowerToughnessBoxProps {
  power: number | string;
  toughness?: number | string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClass = {
  sm: 'w-12 h-7 text-sm',
  md: 'w-16 h-9 text-base',
  lg: 'w-20 h-12 text-2xl',
};

export default function PowerToughnessBox({
  power,
  toughness,
  size = 'md',
}: PowerToughnessBoxProps) {
  return (
    <div className={`pt-box ${sizeClass[size]}`}>
      {toughness !== undefined ? (
        <span>
          {power}<span className="opacity-60 mx-0.5">/</span>{toughness}
        </span>
      ) : (
        <span>{power}</span>
      )}
    </div>
  );
}
