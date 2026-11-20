import { useState } from 'react';

export function usePin(length = 4) {
  const [value, setValue] = useState('');
  const reset = () => setValue('');
  return { value, setValue, reset, length };
}