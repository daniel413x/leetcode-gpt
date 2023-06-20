import { auth } from '@/firebase/firebase';
import { useEffect, useState } from 'react';

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    (async () => {
      await auth.currentUser?.getIdToken(true).then((token) => {
        localStorage.setItem('token', token || '');
      });
    })();
  }, []);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

export default useHasMounted;
