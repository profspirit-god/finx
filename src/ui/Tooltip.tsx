import { useState } from 'react';
import type { ReactNode } from 'react';

type Props = {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
};

const positions: Record<NonNullable<Props['side']>, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({ content, children, side = 'top', delay = 300 }: Props) {
  const [show, setShow] = useState(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const open = () => {
    timer = setTimeout(() => setShow(true), delay);
  };
  const close = () => {
    if (timer) clearTimeout(timer);
    setShow(false);
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          className={[
            'absolute z-50 px-2 py-1 rounded-md',
            'bg-black/90 border border-[var(--gold-line)] text-gold-300',
            'text-xs whitespace-nowrap pointer-events-none',
            'animate-fade-in',
            positions[side],
          ].join(' ')}
        >
          {content}
        </span>
      )}
    </span>
  );
}

export default Tooltip;