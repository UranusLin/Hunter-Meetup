import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRecoilState } from "recoil";
import { homePageRoomSumState, homePageQueryState } from "atoms";

import CommonLayout from "components/v2/Layout";
import { FilteredChips } from "components/v2/Chips/FilteredChips";
import BookList from "components/v2/Cards/ShoppingItemCardList";
import Pagination from "components/v2/Pagination";
import { PAGE_SIZE } from "const";

const Home: NextPage = () => {
  const [homePageQueryData, setHomePageQueryData] =
    useRecoilState(homePageQueryState);
  const [homePageBookSum] = useRecoilState(homePageRoomSumState);

  const handleClickPagination = (page: number) => {
    setHomePageQueryData({ ...homePageQueryData, page });
  };

  return (
    <>
      <Head>
        <title>Hunter Meetup</title>
        <meta name="description" content="Hunter Meetup" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <CommonLayout>
        {(homePageQueryData.sort ||
          homePageQueryData.location ||
          homePageQueryData.roomType) && (
          <FilteredChips
            data={homePageQueryData}
            onChange={setHomePageQueryData}
          />
        )}
        <BookList page={homePageQueryData?.page || 1} pageSize={PAGE_SIZE} />
        <div className="flex justify-center pt-6">
          <Pagination
            currentPage={homePageQueryData?.page || 1}
            pages={Math.round(homePageBookSum / PAGE_SIZE)}
            onClick={handleClickPagination}
          />
        </div>
      </CommonLayout>
    </>
  );
};

export default Home;
