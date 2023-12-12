import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

import CommonLayout from "components/v2/Layout";
import { roomDetailsIdState } from "atoms";
import BookInfoSection from "components/v2/BookDetails/BookInfoSection";
import BookReviewsSection from "components/v2/BookDetails/BookReviewsSection";

const Book: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [, setBookDetailsId] = useRecoilState(roomDetailsIdState);
  // const bookDetailsLodable = useRecoilValueLoadable(bookDetailsQuery);

  React.useEffect(() => {
    id && setBookDetailsId(id as string);
  }, [id, setBookDetailsId]);

  return (
    <>
      <Head>
        <title>Room Details</title>
        <meta name="description" content="Room Details" />
        <link rel="icon" href="/HM_LOGO.png" />
      </Head>

      <CommonLayout
        headerProps={{
          hideMenu: true,
        }}
      >
        <BookInfoSection />
        <BookReviewsSection />
      </CommonLayout>
    </>
  );
};

export default Book;
