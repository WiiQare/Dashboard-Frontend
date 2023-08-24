import { UserContext } from '@/context/UserContext';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { fetchData } from '../api/fetchData';
import CardsData from '@/data/pagesData/payments/paymentsCards';
import Pagination from '@/components/atom/pagination';
import Content from '@/components/content';
import payersColumns from '@/data/pagesData/payments/payers/payersColumns';
import PageSkeleton from '@/components/molecules/pageSkeleton';
interface UserInterface {
  type: string;
  userId: string;
  phoneNumber: string;
  names: string;
  email: string;
  access_token: string;
}

let newSkip: number = 0;

const Payers = () => {
  const User = React.useContext(UserContext);
  const [userState, setUserState] = useState<UserInterface | null>(User?.user);
  const [userAuth, setUserAuth] = useState<boolean | undefined>(
    User?.authenticated,
  );
  const [tableData, setTableData] = useState<any>(null);
  const [summary, setSummary] = useState<any>();
  const [numOfItems, setNumOfItems] = useState<number>(0); // Set initial value to 0
  const [cardData, setCardData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>();
  const [showLoader, setShowLoader] = useState(true);
  const [mounted, setMounted] = useState<boolean>(false);

  const take = 10;
  const skip = 0;
  useLayoutEffect(() => {
    setUserAuth(Boolean(sessionStorage.getItem('userAuth')));
    setUserState(JSON.parse(sessionStorage.getItem('userState') || 'null'));
    setMounted(true);
  }, [User?.authenticated, User?.user]);

  useEffect(() => {
    if (!mounted) return; // Return early if the component is not mounted

    const fetchDataAsync = async () => {
      const res = await fetchData(
        '/payments/payers',
        userState?.access_token,
        take,
        skip,
      );
      const summaryData = await fetchData(
        '/payments/summary',
        userState?.access_token,
      );
      setTableData(res);
      setSummary(summaryData);
      // console.log("res", res);
    };
    if (mounted && userAuth) {
      fetchDataAsync();
    }
  }, [mounted, userAuth, userState?.access_token]); // Remove other dependencies to fetch data only once when mounted

  useEffect(() => {
    if (summary) {
      setCardData(CardsData(summary));
      setNumOfItems(summary.numberOfRows | 10);
    }
  }, [summary]);

  const handlePageChange = async (page: number) => {
    if (page >= 1 && page <= Math.ceil(numOfItems / take)) {
      setCurrentPage(page);
      const newSkip = (page - 1) * take;
      const res = await fetchData(
        '/payments/payers',
        userState?.access_token,
        take,
        newSkip,
      );
      setTableData(res);
    }
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);

    fetchData('/payments/payers', userState?.access_token, newPageSize, 0).then(
      (res) => {
        setTableData(res);
        setCurrentPage(1);
      },
    );
  };

  useEffect(() => {
    if (tableData && summary) {
      setTimeout(() => {
        setShowLoader(false);
      }, 25);
    }
  }, [summary, tableData]);
  console.log(showLoader);
  if (showLoader) {
    return <PageSkeleton number={8} row={10} />;
  }

  return (
    <div>
      <Content
        columns={payersColumns}
        data={tableData}
        cardsData={cardData}
        groups={[]}
        currentPage={'payer_payments'}
      >
        <div className="flex items-center justify-end mt-3 mr-2">
          <div>
            <div className="flex items-center mt-3 mr-2">
              <div className="mr-4">
                <label htmlFor="pageSize">Items per Page:</label>
                <select
                  id="pageSize"
                  className="ml-2 p-1 border border-gray-300 rounded"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </div>
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(numOfItems / take)}
            onPageChange={handlePageChange}
          />
        </div>
      </Content>
    </div>
  );
};

export default Payers;
