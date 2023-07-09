import Content from "../components/content";
import PayersColumns from "../data/tableData/payers/payerColumns";
import { GetStaticProps } from "next";
import { fetchData } from "./api/fetchData";
import React, { useEffect, useState } from "react";
import CardsData from "../data/tableData/payers/payersCards";
import Cards from "../components/molecules/cards";

export interface PayersInterface {
    result: any[];
    summary: any[];
}


export default function Payers({ result, summary }: PayersInterface) {

    const [data] = useState<any[]>(result);
    const [cardData, setCardData] = useState<any[]>([]);
    useEffect(() => {
        setCardData(CardsData(summary))
    }, [summary])
    return (
        <div>

            <Content columns={PayersColumns} data={data} groups={[]}>
                <Cards data={cardData} />
            </Content>
        </div>
    );

}


export const getStaticProps: GetStaticProps = async () => {
    const res = await fetchData("/payers");
    const result = await JSON.parse(JSON.stringify(await res));
    const summary = await JSON.parse(JSON.stringify(await fetchData("/payers/summary")))
    return {
        props: { result, summary },
        revalidate: 30
    }
}