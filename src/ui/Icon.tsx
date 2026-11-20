import type { LucideIcon, LucideProps } from 'lucide-react';

type Props = LucideProps & { Icon: LucideIcon; tone?: 'gold' | 'dim' | 'white' };

export default function Icon({ Icon, tone = 'gold', ...rest }: Props) {
  const color =
    tone === 'gold'  ? 'var(--gold)' :
    tone === 'dim'   ? 'var(--text-dim)' :
                       'var(--text)';
  return <Icon color={color} strokeWidth={1.75} {...rest} />;
}