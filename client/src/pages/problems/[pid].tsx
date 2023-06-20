import Topbar from '@/components/Topbar/Topbar';
import Workspace from '@/components/Workspace/Workspace';
import useHasMounted from '@/hooks/useHasMounted';
import { Problem } from '@/utils/types/problem';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React from 'react';
import { firestore } from '@/firebase/firebase';

type ProblemPageProps = {
  problem: Problem;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  return (
    <div>
      <Topbar problemPage />
      <Workspace problem={problem} />
    </div>
  );
};
export default ProblemPage;

export async function getStaticPaths() {
  const q = query(collection(firestore, 'problems'));
  const querySnapshot = await getDocs(q);
  const paths = querySnapshot.docs.map((doc) => ({
    params: { pid: doc.id },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: { params: { pid: string } }) {
  const { pid } = params;
  const probQuery = query(
    collection(firestore, 'problem_pages'),
    where('problemId', '==', pid)
  );
  const probSnapshot = await getDocs(probQuery);
  if (probSnapshot.empty) {
    return {
      notFound: true,
    };
  }

  const probDoc = probSnapshot.docs[0];
  const problem = probDoc.data();

  problem.handlerFunction = problem.handlerFunction.toString();
  const [lineOne, lineTwo, lineThree] = problem.starterCode;
  problem.starterCode = `${lineOne}\n  ${lineTwo}\n${lineThree}`;

  return {
    props: {
      problem,
    },
  };
}
