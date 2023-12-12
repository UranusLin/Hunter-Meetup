import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";

import CommonLayout from "components/v2/Layout";
import ShoppingCartList from "components/v2/List/ShoppingCartList";

const MyRooms: NextPage = () => {
  return (
    <>
      <Head>
        <title>My Rooms</title>
        <meta name="description" content="shopping cart" />
        <link rel="icon" href="/HM_LOGO.png" />
      </Head>

      <CommonLayout
        headerProps={{
          hideMenu: true,
        }}
      >
        <h1 className="font-bold text-5xl">My Rooms</h1>
        <ShoppingCartList />
      </CommonLayout>
    </>
  );
};

export default MyRooms;
