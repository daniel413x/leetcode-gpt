import { auth, firestore } from '@/firebase/firebase';
import ChatGptService from '@/services/chatGptService';
import { errorCatch, rParse } from '@/utils/misc';
import { GeneratedProblem, GeneratedProblemForm } from '@/utils/types/problem';
import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GiHammerNails } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { SiOpenai } from 'react-icons/si';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Dropdown from '../Dropdown';
import Loading from '../Loading/Loading';
import Checkmark from '../../../public/check.png';

const DIFFICULTIES = ['Any', 'Easy', 'Medium', 'Hard'];
const CATEGORIES = [
  'Any',
  'Array',
  'String',
  'Linked List',
  'Stack',
  'Queue',
  'Tree',
  'Graph',
  'Binary Search',
  'Dynamic Programming',
  'Greedy Algorithm',
  'Bit Manipulation',
  'Backtracking',
  'Recursion',
  'Sorting and Searching',
  'Heap',
  'Hashing',
  'Mathematics',
  'Two Pointers',
  'Sliding Window',
];

interface GenerateModalProps {
  setShow: (boolean: boolean) => void;
}

const GenerateModal: React.FC<GenerateModalProps> = ({ setShow }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user] = useAuthState(auth);
  const [difficulty, setDifficulty] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [dropdowns, setDropdowns] = useState<{ [key: string]: boolean }>({
    difficulty: false,
    category: false,
  });
  const handleClickDropdown =
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    (dropdown: 'difficulty' | 'category') => {
      e.stopPropagation();
      setDropdowns({
        ...dropdowns,
        [dropdown]: !dropdowns[dropdown],
      });
    };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const q = query(collection(firestore, 'problems'));
      const querySnapshot = await getDocs(q);
      const prevProblems = querySnapshot.docs
        .map((docu) => docu.data().title)
        .filter(Boolean)
        .join(', ');
      // avoid generating repetitive problems by sending refs of previously generated problems to chatgpt api
      const params: GeneratedProblemForm = {};
      if (difficulty !== 'Any') {
        params.difficulty = difficulty;
      }
      if (category !== 'Any') {
        params.category = category;
      }
      if (prevProblems) {
        params.prevProblems = prevProblems;
      }
      const data = await ChatGptService.generateProblem(params);
      const unwrapped: GeneratedProblem = rParse(data);
      const {
        problemId,
        title,
        difficulty: realizedDifficulty,
        category: realizedCategory,
        problemStatement,
        handlerFunction,
        starterFunctionName,
        constraints,
        starterCode,
        examples,
      } = unwrapped;
      const order = prevProblems.length + 1 || 0;
      const newProblem = {
        title,
        difficulty: realizedDifficulty,
        category: realizedCategory,
        likes: 0,
        dislikes: 0,
        id: problemId,
        order,
        userId: user!.uid,
      };
      const newProblemPage = {
        pageTitle: `${order}. ${title}`,
        problemStatement,
        handlerFunction,
        starterFunctionName,
        problemId,
        id: problemId,
        constraints,
        starterCode,
        examples,
      };
      await setDoc(doc(firestore, 'problems', problemId), newProblem);
      await setDoc(doc(firestore, 'problem_pages', problemId), newProblemPage);
      const countRef = doc(firestore, 'metadata', 'problems');
      await updateDoc(countRef, {
        count: increment(1),
      });
      setSuccess(true);
      router.push(`problems/${problemId}`);
    } catch (e: any) {
      let error = errorCatch(e);
      if (error.includes('JSON')) {
        error = 'An error occurred';
      }
      toast.error(error, {
        position: 'top-center',
        autoClose: 3000,
        theme: 'dark',
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="text-white z-80">
      <div
        aria-modal="true"
        role="dialog"
        className="fixed inset-0 overflow-y-auto z-modal"
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          {/* overlay */}
          <div className="opacity-100">
            <div className="fixed top-0 left-0 inset-0 bg-gray-8 opacity-60">
              <button
                type="button"
                onClick={() => setShow(false)}
                aria-label="overlay"
                className="w-full h-full cursor-default"
              />
            </div>
          </div>
          <form
            className="my-8 inline-block min-w-full transform rounded-[13px] text-left transition-all bg-overlay-3 md:min-w-[420px] shadow-level4 shadow-lg p-0 bg-[rgb(40,40,40)] w-[600px] !overflow-visible opacity-100 scale-100 flex flex-col"
            onSubmit={submit}
          >
            {/* header */}
            <div className="flex items-center border-b px-5 py-4 text-lg font-medium  border-dark-divider-border-2">
              Generate problem
              <button
                className="ml-auto cursor-pointer rounded transition-all"
                onClick={() => setShow(false)}
                type="button"
              >
                <IoClose />
              </button>
            </div>
            <div className="px-6 pb-6 mt-6 transition-all">
              {!success && (
                <div
                  className={`flex flex-col relative ${
                    loading ? 'pointer-events-none' : ''
                  } opacity-${loading ? '50' : '100'}`}
                >
                  <Dropdown
                    show={dropdowns.difficulty}
                    handleClickDropdown={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => handleClickDropdown(e)('difficulty')}
                    desc="Choose problem difficulty."
                    label="Difficulty"
                    value={difficulty}
                    handleClickItem={(newDifficulty) => {
                      setDifficulty(newDifficulty);
                    }}
                    items={DIFFICULTIES}
                  />
                  <Dropdown
                    show={dropdowns.category}
                    handleClickDropdown={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => handleClickDropdown(e)('category')}
                    desc="Choose problem category."
                    label="Category"
                    value={category}
                    handleClickItem={(newCategory) => {
                      setCategory(newCategory);
                    }}
                    items={CATEGORIES}
                  />
                  <button
                    className="py-1.5 font-medium items-center transition-all inline-flex bg-dark-fill-3 text-sm hover:bg-dark-fill-2 text-gray-400 rounded-lg px-4 py-2 z-10 w-max self-end relative"
                    type="submit"
                    disabled={loading}
                  >
                    <div className="transform transition flex items-center">
                      <SiOpenai className="fill-gray-500 mr-1" />
                    </div>
                    Ready!
                  </button>
                </div>
              )}
              {(loading || success) && (
                <Loading
                  style={{ left: success ? '94%' : '75%', top: '85%' }}
                />
              )}
              <div
                className={`
                      relative
                      flex
                      flex-col
                      items-center
                      gap-2
                      mt-${success ? '4' : '0'}
                      opacity-${success ? '100' : '0'}
                      h-${success ? 'full' : '0'}
                      transition-all
                      top-${success ? '0' : '10'}
                      text-dark-gray-6
                      overflow-hidden
                    `}
              >
                <Image
                  src={Checkmark}
                  width={640}
                  height={360}
                  alt="Success"
                  className="w-max"
                />
                <span className="flex items-center">Problem generated!</span>
                <span className="flex items-center gap-2">
                  Building the page... <GiHammerNails className="text-lg" />
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateModal;
