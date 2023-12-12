import {
  atom,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  waitForNone,
} from "recoil";
import { roomDetailsIdState, homePageQueryState } from "atoms";
import {
  fetchRoomDetailsById,
  fetchBookRatingsById,
  fetchRooms,
} from "lib/http";

export const homePageQuery = selector({
  key: "homePage",
  get: async ({ get }) => {
    const { page, size, location, roomType, sort } = get(homePageQueryState);
    const response = await fetchRooms({
      page,
      size,
      location,
      roomType,
      sort,
    });
    return response;
  },
});

export const roomInfoQuery = selector({
  key: "BookInfoQuery",
  get: async ({ get }) => {
    const roomID = get(roomDetailsIdState);
    const response = await fetchRoomDetailsById(roomID);
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});

export const bookRatingQuery = selector({
  key: "BookRatingQuery",
  get: async ({ get }) => {
    const bookID = get(roomDetailsIdState);
    if (!bookID) {
      throw new Error("Required bookID");
    }
    const response = await fetchBookRatingsById(bookID);
    if (response.error) {
      throw response.error;
    }
    return response;
  },
});
