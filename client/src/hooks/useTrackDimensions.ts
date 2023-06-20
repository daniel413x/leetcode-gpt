import { RefObject, useEffect, useState } from 'react';

const useTrackDimensions: (refOrId?: RefObject<any>) => {
  height: number | undefined;
  width: number | undefined;
} = (refOrId) => {
  const [height, setHeight] = useState<number | undefined>(0);
  const [width, setWidth] = useState<number | undefined>(0);
  useEffect(() => {
    const update = () => {
      let returnedHeight;
      let returnedWidth;
      if (refOrId) {
        if (!(refOrId as any).current) {
          return;
        }
        const ref = refOrId as any;
        returnedHeight = ref?.current.clientHeight || 0;
        returnedWidth = ref?.current.clientWidth || 0;
      } else {
        returnedHeight = window.innerHeight || 0;
        returnedWidth = window.innerWidth || 0;
      }
      setHeight(returnedHeight);
      setWidth(returnedWidth);
    };
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, []);
  return { height, width };
};

export default useTrackDimensions;
