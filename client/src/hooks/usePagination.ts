import { useCallback, useEffect, useState } from 'react';
import { getMaxPage } from '@/utils/misc';
import {
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
  query,
  collection,
  limit,
  DocumentSnapshot,
  startAfter,
  Query,
} from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';

interface UsePaginationProps {
  itemsPerPage: number;
  concurrentlySetQueryPage?: boolean;
  countRef: DocumentReference<DocumentData>;
  constraints: any[];
  collectionName: string;
}

interface UsePaginationReturn<T> {
  page: number;
  pageLimit: number;
  pageLimitReached: boolean;
  loading: boolean;
  dbCount: number;
  changePage: (number: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  items: T[];
}

const usePagination = <T>({
  itemsPerPage,
  constraints,
  countRef,
  collectionName,
}: UsePaginationProps): UsePaginationReturn<T> => {
  const [items, setItems] = useState<T[]>([]);
  const [pageDocs, setPageDocs] = useState<{
    [page: number]: QueryDocumentSnapshot<DocumentData>;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const qCollection = collection(firestore, collectionName);
  const qParams = useCallback(
    () => [...constraints, limit(itemsPerPage)],
    [itemsPerPage, constraints]
  );
  const [dbCount, setDbCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(1);
  const [pageLimitReached, setPageLimitReached] = useState<boolean>(true);
  const fetchDocs = useCallback(
    async (itemsQuery: Query<DocumentData>, newPage: number) => {
      const itemsSnapshot = await getDocs(itemsQuery);
      const nextItems: T[] = [];
      itemsSnapshot.forEach((docu: DocumentSnapshot) => {
        nextItems.push({ id: docu.id, ...docu.data() } as unknown as T);
      });
      setItems(nextItems);
      setPageDocs({
        ...pageDocs,
        [newPage + 1]: itemsSnapshot.docs[itemsSnapshot.docs.length - 1],
      });
    },
    [pageDocs]
  );
  const changePage = useCallback(
    async (number: number) => {
      const forward = number > page;
      const newPage = number > pageLimit || number < 1 ? pageLimit : number;
      setPage(newPage);
      let changePageQuery;
      if (newPage === 1) {
        changePageQuery = query(qCollection, ...qParams());
      } else if (forward) {
        changePageQuery = query(
          qCollection,
          ...qParams(),
          startAfter(pageDocs[newPage])
        );
      } else {
        changePageQuery = query(
          qCollection,
          ...qParams(),
          startAfter(pageDocs[newPage])
        );
      }
      await fetchDocs(changePageQuery, newPage);
    },
    [pageLimit, fetchDocs, page, qCollection, qParams, pageDocs]
  );
  const nextPage = () => changePage(page + 1);
  const prevPage = () => changePage(page - 1);
  useEffect(() => {
    const newPageLimit = getMaxPage(dbCount, itemsPerPage);
    setPageLimit(newPageLimit || 1);
    if (newPageLimit > 0 && page > newPageLimit) {
      changePage(newPageLimit);
    }
  }, [dbCount, itemsPerPage, page, changePage]);
  useEffect(() => {
    if (page === pageLimit) {
      setPageLimitReached(true);
    } else {
      setPageLimitReached(false);
    }
  }, [page, pageLimit]);
  useEffect(() => {
    (async () => {
      const countDoc = await getDoc(countRef);
      setDbCount(countDoc?.data()?.count);
      const itemsQuery = query(qCollection, ...qParams());
      await fetchDocs(itemsQuery, page);
      setLoading(false);
    })();
  }, []);
  return {
    page,
    pageLimit,
    pageLimitReached,
    changePage,
    nextPage,
    prevPage,
    dbCount,
    items,
    loading,
  };
};

export default usePagination;
