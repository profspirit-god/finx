import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  strong?: boolean;
};

export const GlassPanel = forwardRef<HTMLDivElement, Props>(function GlassPanel(
  { strong = false, className = '', children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[strong ? 'glass-strong' : 'glass', className].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
});

export default GlassPanel;