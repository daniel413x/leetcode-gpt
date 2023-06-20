import { useEffect, useState } from 'react';
import useTrackDimensions from './useTrackDimensions';

const useBreakpoints: () => {
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
} = () => {
  const { width } = useTrackDimensions();
  const [sm, setSm] = useState<boolean>(false);
  const [md, setMd] = useState<boolean>(false);
  const [lg, setLg] = useState<boolean>(false);
  const [xl, setXl] = useState<boolean>(false);
  const [xxl, setXxl] = useState<boolean>(false);
  useEffect(() => {
    const update = () => {
      setXxl(false);
      setXl(false);
      setLg(false);
      setMd(false);
      setSm(false);
      if (width! >= 1536) {
        setXxl(true);
      }
      if (width! >= 1280) {
        setXl(true);
      }
      if (width! >= 1024) {
        setLg(true);
      }
      if (width! >= 768) {
        setMd(true);
      }
      if (width! >= 640) {
        setSm(true);
      }
    };
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, [width]);
  return {
    sm,
    md,
    lg,
    xl,
    xxl,
  };
};

export default useBreakpoints;
