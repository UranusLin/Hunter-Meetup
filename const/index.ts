export type MemberType = {
  id: string;
  name: string;
};

export interface RoomProps {
  id: string;
  title: string;
  roomType: string;
  publishedAt: string;
  stock: number;
  price: string;
  members: { member: MemberType }[];
  averageRating: number;
  ratings: number;
  location: string;
  host: { id: string; name: string };
  event: { id: string; name: string; imgURL: string };
}

export interface shoppingCartItemProps extends RoomProps {
  quantity: number;
}

export type RoomDetailProps = Omit<
  RoomProps,
  "members" | "averageRating" | "ratings"
>;

export interface RoomRatingsProps {
  roomId: string;
  userId: string;
  score: number;
  ratedAt: string;
  user: {
    id: string;
    nickname: string;
  };
}

export const starLabels: { [index: string]: string } = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

export const PAGE_SIZE = 9;

export const SORT_VALUE = ["published_at", "price"];

export const KEY_PAIR_SESSION_STORAGE_KEY = "ephemeral_key_pair";
