import { useRef, useState } from 'react';

export function useMenuToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);

  const handleBlur = (event) => {
    if (ref.current?.contains(event.relatedTarget)) return;
    close();
  };

  return {
    isOpen,
    toggle,
    close,
    ref,
    handleBlur
  };
}
