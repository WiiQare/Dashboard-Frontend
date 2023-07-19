import { UserContext } from '@/context/UserContext';
import Router from 'next/router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { fetchData } from '../api/fetchData';
import CardsData from "@/data/tableData/vouchers/vouchersCards";
import Pagination from "@/components/atom/pagination";
import Content from '@/components/content';
import VouchersColumns from '@/data/tableData/vouchers/vouchersColumns';
interface UserInterface {
    type: string;
    userId: string;
    phoneNumber: string;
    names: string;
    email: string;
    access_token: string;
}

let newSkip: number = 0;

const Vouchers = () => {
    const User = React.useContext(UserContext);
    const [userState, setUserState] = useState<UserInterface | null>(User?.user);
    const [userAuth, setUserAuth] = useState<boolean | undefined>(User?.authenticated);
    const [tablData, setTableData] = useState<any>(null);
    const [summary, setSummary] = useState<any>();
    const [numOfItems, setNumOfItems] = useState<number>(0); // Set initial value to 0
    const [cardData, setCardData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>();

    const [mounted, setMounted] = useState<boolean>(false);

    const take = 10; // Default number of items to take
    const skip = 0; // Default amount to skip

    useLayoutEffect(() => {
        setUserAuth(Boolean(localStorage.getItem("userAuth")));
        setUserState(JSON.parse(localStorage.getItem("userState") || 'null'));
        setMounted(true);
    }, [User?.authenticated, User?.user]);

    if (mounted) {
        if (userAuth === false) {
            // console.log("userAuth", userAuth)

            Router.replace("/auth/signin");

        }
    }

    useEffect(() => {
        if (!mounted) return; // Return early if the component is not mounted

        const fetchDataAsync = async () => {
            const res = await fetchData("/vouchers", userState?.access_token, take, skip);
            const summaryData = await fetchData("/vouchers/summary", userState?.access_token);
            setTableData(res);
            setSummary(summaryData);

        };
        if (mounted && userAuth) {
            fetchDataAsync();
        }

    }, [mounted, userAuth, userState?.access_token]); // Remove other dependencies to fetch data only once when mounted


    useEffect(() => {
        if (summary) {
            setCardData(CardsData(summary))
            setNumOfItems(summary.vouchersInMaxTime.numberOfVouchers)

        }
    }, [numOfItems, summary]);


    const handlePageChange = async (page: number) => {
        if (page >= 1 && page <= Math.ceil(numOfItems / take)) {
            setCurrentPage(page);
            const newSkip = (page - 1) * take;
            const res = await fetchData('/vouchers', userState?.access_token, take, newSkip);
            setTableData(res);
        }
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.target.value);
        setPageSize(newPageSize);

        fetchData('/vouchers', userState?.access_token, newPageSize, 0).then((res) => {
            setTableData(res);
            setCurrentPage(1);
        });
    };


    if (!tablData || !summary) {
        return null; // Render nothing until data and summary are available
    }

    return (
        <div>
            <Content columns={VouchersColumns} data={tablData} cardsData={cardData} groups={[]}>
                <div className="flex">
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
                                    {/* Add more options as needed */}
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
            <h1 className="bg-red-500 w-28"> </h1>
        </div>
    );
};

export default Vouchers;
