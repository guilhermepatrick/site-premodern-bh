import { ReactNode } from 'react';

interface GoldSealProps {
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

const sizeClass: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
};

export default function GoldSeal({ size = 'md', children, className = '' }: GoldSealProps) {
  return <span className={`gold-seal ${sizeClass[size]} ${className}`}>{children}</span>;
}
