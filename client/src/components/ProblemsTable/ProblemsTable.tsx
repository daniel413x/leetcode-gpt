import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { AiFillYoutube } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import YouTube from 'react-youtube';
import { doc, getDoc, orderBy } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import usePagination from '@/hooks/usePagination';
import { DBProblem } from '@/utils/types/problem';
import PaginatedItemsCounter from '../PaginatedItemsCounter';

const LoadingSkeleton = () => (
  <div className="flex items-center space-x-12 mt-4 px-6">
    <div className="w-6 h-6 shrink-0 rounded-full bg-dark-layer-1" />
    <div className="h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1" />
    <div className="h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1" />
    <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1" />
    <span className="sr-only">Loading...</span>
  </div>
);

function useGetSolvedProblems() {
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [user] = useAuthState(auth);
  useEffect(() => {
    const getSolvedProblems = async () => {
      const userRef = doc(firestore, 'users', user!.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setSolvedProblems(userDoc.data().solvedProblems);
      }
    };
    if (user) getSolvedProblems();
    if (!user) setSolvedProblems([]);
  }, [user]);

  return solvedProblems;
}

const ProblemsTable: React.FC = () => {
  const [youtubePlayer, setYoutubePlayer] = useState({
    isOpen: false,
    videoId: '',
  });
  const problemsLimit = 10;
  const countRef = doc(firestore, 'metadata', 'problems');
  const constraints = [orderBy('order', 'asc')];
  const {
    page,
    pageLimitReached,
    changePage,
    dbCount,
    items: problems,
    loading,
  } = usePagination<DBProblem>({
    itemsPerPage: problemsLimit,
    collectionName: 'problems',
    countRef,
    constraints,
  });
  const solvedProblems = useGetSolvedProblems();
  const closeModal = () => {
    setYoutubePlayer({ isOpen: false, videoId: '' });
  };
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);

    return () => window.removeEventListener('keydown', handleEsc);
  }, []);
  return (
    <>
      {loading && (
        <div className="max-w-[1200px] mx-auto w-full animate-pulse">
          {[...Array(10)].map((_, idx) => (
            <LoadingSkeleton key={idx} />
          ))}
        </div>
      )}
      <table className="text-sm text-left text-gray-500 dark:text-gray-400 w-full max-w-[1200px] mx-auto">
        {!loading && (
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b ">
            <tr>
              <th scope="col" className="px-1 py-3 w-0 font-medium">
                Status
              </th>
              <th scope="col" className="px-6 py-3 w-0 font-medium">
                Title
              </th>
              <th scope="col" className="px-6 py-3 w-0 font-medium">
                Difficulty
              </th>
              <th scope="col" className="px-6 py-3 w-0 font-medium">
                Category
              </th>
              <th scope="col" className="px-6 py-3 w-0 font-medium">
                Solution
              </th>
            </tr>
          </thead>
        )}
        <tbody className="text-white">
          {problems.map((problem, idx) => {
            let difficulyColor = 'text-dark-pink';
            if (problem.difficulty === 'Easy') {
              difficulyColor = 'text-dark-green-s';
            }
            if (problem.difficulty === 'Medium') {
              difficulyColor = 'text-dark-yellow';
            }
            return (
              <tr
                className={`${idx % 2 === 1 ? 'bg-dark-layer-1' : ''}`}
                key={problem.id}
              >
                <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                  {solvedProblems.includes(problem.id) && (
                    <BsCheckCircle fontSize="18" width="18" />
                  )}
                </th>
                <td className="px-6 py-4">
                  {problem.link ? (
                    <Link
                      href={problem.link}
                      className="hover:text-blue-600 cursor-pointer"
                      target="_blank"
                    >
                      {problem.title}
                    </Link>
                  ) : (
                    <Link
                      className="hover:text-blue-600 cursor-pointer"
                      href={`/problems/${problem.id}`}
                    >
                      {problem.title}
                    </Link>
                  )}
                </td>
                <td className={`px-6 py-4 ${difficulyColor}`}>
                  {problem.difficulty}
                </td>
                <td className="px-6 py-4">{problem.category}</td>
                <td className="px-6 py-4">
                  {problem.videoId ? (
                    <AiFillYoutube
                      fontSize="28"
                      className="cursor-pointer hover:text-red-600"
                      onClick={() =>
                        setYoutubePlayer({
                          isOpen: true,
                          videoId: problem.videoId as string,
                        })
                      }
                    />
                  ) : (
                    <p className="text-gray-400">Coming soon</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        {youtubePlayer.isOpen && (
          <tfoot className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
            <button
              className="bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute"
              onClick={closeModal}
              type="button"
              aria-label="Close"
            />
            <div className="w-full z-50 h-full px-6 relative max-w-4xl">
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="w-full relative">
                  <IoClose
                    fontSize="35"
                    className="cursor-pointer absolute -top-16 right-0"
                    onClick={closeModal}
                  />
                  <YouTube
                    videoId={youtubePlayer.videoId}
                    loading="lazy"
                    iframeClassName="w-full min-h-[500px]"
                  />
                </div>
              </div>
            </div>
          </tfoot>
        )}
      </table>
      <div className="flex justify-between items-center gap-4 w-max text-gray-400 m-auto mt-4">
        <button
          type="button"
          className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
                  text-sm px-5 py-2.5 text-center hover:bg-brand-orange-s w-max disabled:opacity-25 disabled:hover:bg-opacity-0"
          disabled={page === 1}
          onClick={() => changePage(page - 1)}
        >
          Previous
        </button>
        <PaginatedItemsCounter
          page={page}
          itemsPerPage={problemsLimit}
          dbCount={dbCount}
          descriptor="challenges"
        />
        <button
          type="button"
          className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
                  text-sm px-5 py-2.5 text-center hover:bg-brand-orange-s w-max disabled:opacity-25 disabled:hover:bg-opacity-0"
          onClick={() => changePage(page + 1)}
          disabled={pageLimitReached}
        >
          Next
        </button>
      </div>
    </>
  );
};
export default ProblemsTable;
