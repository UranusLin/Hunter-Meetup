import axios from "axios";
import { RoomProps, RoomDetailProps, RoomRatingsProps } from "const";

export async function fetchRooms(data: {
  page?: number;
  size?: number;
  location?: string;
  roomType?: string;
  sort?: string;
}): Promise<{ content: RoomProps[]; total: number; error?: any }> {
  try {
    const queryArray = Object.keys(data).reduce((prev: string[], item) => {
      const value = data[item as keyof typeof data];
      if (value) {
        prev.push(`${item}=${value}`);
      }
      return prev;
    }, []);
    const response = await axios.get(`/api/rooms?${queryArray.join(`&`)}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return { error, content: [], total: 0 };
  }
}

export async function fetchLocation(): Promise<{
  locationContent: string[];
  locationError?: any;
}> {
  try {
    const response = await axios.get(`/api/rooms/locations`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { locationContent: response.data as string[] };
  } catch (error) {
    console.error(error);
    return { locationError: error, locationContent: [] };
  }
}

// fetch room types
export async function fetchRoomTypes(): Promise<{
  roomTypeContent: string[];
  roomTypeError?: any;
}> {
  try {
    const response = await axios.get(`/api/rooms/roomTypes`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { roomTypeContent: response.data as string[] };
  } catch (error) {
    console.error(error);
    return { roomTypeError: error, roomTypeContent: [] };
  }
}

export async function fetchRoomDetailsById(id: string): Promise<{
  content: RoomDetailProps;
  error?: any;
}> {
  try {
    const response = await axios.get(`/api/rooms/${id}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data as RoomDetailProps };
  } catch (error) {
    console.error(error);
    return { error, content: {} as RoomDetailProps };
  }
}

export async function fetchBookRatingsById(id: string): Promise<{
  content: { content: RoomRatingsProps[]; total: number };
  error?: any;
}> {
  try {
    const response = await axios.get(`/api/rooms/${id}/ratings`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error, content: { content: [], total: 0 } };
  }
}

export async function updateBookDetails(
  id: string,
  params: Partial<RoomDetailProps>,
): Promise<{
  content?: { data: RoomDetailProps; message: string };
  error?: any;
}> {
  try {
    const response = await axios.put(`/api/rooms/${id}`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function addRatingByBookID(
  bookID: string,
  params: {
    score: number;
  },
): Promise<{
  content?: { data: Omit<RoomRatingsProps, "user">; message: string };
  error?: any;
}> {
  try {
    const response = await axios.post(`/api/rooms/${bookID}/ratings`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function deleteRating(
  bookID: string,
  userID: string,
): Promise<{
  content?: { message: string };
  error?: any;
}> {
  try {
    const response = await axios.delete(
      `/api/rooms/${bookID}/ratings?userId=${userID}`,
    );
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function buyBook(
  bookID: string,
  params: { userID: string; quality: number },
): Promise<{
  content?: { message: string };
  error?: any;
}> {
  try {
    const response = await axios.post(
      `/api/rooms/${bookID}/buy?userId=${params.userID}&quality=${params.quality}`,
    );
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}
