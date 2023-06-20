import { RefObject, useEffect } from 'react';

const useOnOutsideClick = (
  ref: RefObject<any>,
  handler: undefined | ((event: Event) => void)
) => {
  useEffect(() => {
    if (!handler) {
      return;
    }
    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export default useOnOutsideClick;
