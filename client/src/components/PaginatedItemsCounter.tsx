interface PaginatedItemsCounterProps {
  page: number;
  itemsPerPage: number;
  dbCount: number;
  descriptor: string;
}

const PaginatedItemsCounter = ({
  page,
  itemsPerPage,
  dbCount,
  descriptor,
}: PaginatedItemsCounterProps) => {
  const currentPageCount = itemsPerPage * page;
  return (
    <span className="text-xs">
      {currentPageCount > dbCount ? dbCount : currentPageCount} of{' '}
      <span className="">{dbCount}</span> {descriptor}
    </span>
  );
};

export default PaginatedItemsCounter;
