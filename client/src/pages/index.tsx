import ProblemsTable from '@/components/ProblemsTable/ProblemsTable';
import Topbar from '@/components/Topbar/Topbar';
import useHasMounted from '@/hooks/useHasMounted';
import { useEffect, useState } from 'react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { SiOpenai } from 'react-icons/si';
import useBreakpoints from '@/hooks/useBreakpoints';
import GenerateModal from '@/components/Modals/GenerateModal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import Footer from '@/components/Footer';
import UtilService from '@/services/utilService';

interface BylineProps {
  md: boolean;
}

const Byline = ({ md }: BylineProps) => (
  <h1
    className="text-xl text-center text-gray-700 dark:text-gray-400 font-bold
			uppercase mt-10 mb-5
			tracking-wider flex justify-center gap-2 opacity-80"
  >
    {md && <span>&#128072;</span>}
    {!md && <span>&#128071;</span>}
    <FaQuoteLeft />
    The machine challenges you!
    <FaQuoteRight />
  </h1>
);

const Home = () => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const hasMounted = useHasMounted();
  const { md } = useBreakpoints();
  useEffect(() => {
    if (hasMounted) {
      (async () => {
        await UtilService.ping();
      })();
    }
  }, [hasMounted]);
  if (!hasMounted) return null;
  return (
    <main className=" bg-dark-layer-2 min-h-screen flex flex-col items-center">
      <Topbar />
      <div className="px-6 w-full max-w-5xl">
        <div className="md:block flex flex-col-reverse relative md:py-0 md:mb-10 mb-6">
          <button
            className="py-1.5 font-medium items-center transition-all inline-flex bg-dark-fill-3 text-sm hover:bg-dark-fill-2 text-gray-400 rounded-lg px-4 py-2 m-auto md:absolute z-10"
            type="button"
            onClick={() => {
              if (!user?.uid) {
                router.push('auth');
                setAuthModalState((prev) => ({
                  ...prev,
                  isOpen: true,
                  type: 'login',
                }));
                return;
              }
              setShowGenerateModal(true);
            }}
          >
            <div className="transform transition flex items-center">
              <SiOpenai className="fill-gray-500 mx-1" />
            </div>
            Generate problem
          </button>
          <Byline md={md} />
        </div>
        <div className="relative overflow-x-auto mx-auto pb-10">
          <ProblemsTable />
        </div>
      </div>
      {showGenerateModal && <GenerateModal setShow={setShowGenerateModal} />}
      <div className="h-full" />
      <Footer />
    </main>
  );
};

export default Home;
