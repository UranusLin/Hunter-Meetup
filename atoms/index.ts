import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

import { shoppingCartItemProps, RoomProps, PAGE_SIZE } from "const";

export const homePageRoomSumState = atom({
  key: "homePageRoomSumState",
  default: 0,
});

export const shoppingCartState = atom<shoppingCartItemProps[]>({
  key: "shoppingCartState",
  default: [],
});

export const locationListState = atom<string[]>({
  key: "locationListState",
  default: [],
});

export const roomTypeListState = atom<string[]>({
  key: "roomTypeListState",
  default: [],
});

export const homePageQueryState = atom({
  key: "homePageQueryState",
  default: { page: 1, location: "", roomType: "", sort: "", size: PAGE_SIZE },
});

export const roomDetailsIdState = atom({
  key: "roomDetailsIdState",
  default: "",
});

export const currentUserIdState = atom({
  key: "currentUserIdState",
  default: "1",
});
