type Props = {
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
};

const radii = { sm: 'rounded', md: 'rounded-lg', lg: 'rounded-2xl', full: 'rounded-full' };

export function Skeleton({ width = '100%', height = 12, rounded = 'md', className = '' }: Props) {
  return (
    <div
      aria-hidden
      className={['skeleton', radii[rounded], className].join(' ')}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={['space-y-2', className].join(' ')}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={12} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}

export default Skeleton;