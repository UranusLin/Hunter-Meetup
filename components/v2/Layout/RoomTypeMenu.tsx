import * as React from "react";
import { useSnackbar } from "notistack";

import { useRecoilState } from "recoil";
import {
  roomTypeListState,
  homePageQueryState,
  locationListState,
} from "atoms";
import clsx from "clsx";

import { SORT_VALUE } from "const";
import { upperCaseEachWord } from "lib/utils";
import { fetchLocation, fetchRoomTypes } from "lib/http";

export default function RoomTypeMenu() {
  const [loadingRoomLocation, setLoadingLocation] = React.useState(false);
  const [loadingRoomType, setLoadingRoomType] = React.useState(false);

  const [locationList, setLocationList] = useRecoilState(locationListState);
  // roomTypeListState
  const [roomTypeList, setRoomTypeList] = useRecoilState(roomTypeListState);
  const [homePageQueryData, setHomePageQueryData] =
    useRecoilState(homePageQueryState);
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    const func = async () => {
      setLoadingLocation(true);
      setLoadingRoomType(true);
      const locationRes = await fetchLocation();
      const roomTypeRes = await fetchRoomTypes();
      const { locationError, locationContent } = locationRes;
      const { roomTypeError, roomTypeContent } = roomTypeRes;
      if (locationError || roomTypeError) {
        setLoadingLocation(false);
        setLoadingRoomType(false);
        if (locationError)
          enqueueSnackbar(`Error: Fetch Locations`, {
            variant: "error",
          });
        if (roomTypeError)
          enqueueSnackbar(`Error: Fetch Room Types`, {
            variant: "error",
          });
      }
      setLocationList(locationContent);
      setRoomTypeList(roomTypeContent);
      setLoadingLocation(false);
      setLoadingRoomType(false);
    };
    !locationList?.length && !roomTypeList?.length && func();
  }, [
    locationList.length,
    roomTypeList.length,
    enqueueSnackbar,
    setLocationList,
    setRoomTypeList,
  ]);

  return (
    <>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <div className="menu-title">Room Type</div>
          <ul>
            {roomTypeList.map((roomType) => (
              <li
                key={roomType}
                onClick={() => {
                  setHomePageQueryData({
                    ...homePageQueryData,
                    page: 1,
                    roomType: roomType,
                  });
                }}
              >
                <span
                  className={clsx({
                    active: homePageQueryData.roomType === roomType,
                  })}
                >
                  {roomType.replaceAll(`_nbsp_`, ` `).replaceAll(`_amp_`, `&`)}
                </span>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <div className="menu-title">Locations</div>
          <ul>
            {locationList.map((location) => (
              <li
                key={location}
                onClick={() => {
                  setHomePageQueryData({
                    ...homePageQueryData,
                    page: 1,
                    location: location,
                  });
                }}
              >
                <span
                  className={clsx({
                    active: homePageQueryData.location === location,
                  })}
                >
                  {location.replaceAll(`_nbsp_`, ` `).replaceAll(`_amp_`, `&`)}
                </span>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <div className="menu-title">Order by</div>
          <ul>
            {SORT_VALUE.map((sortType) => (
              <li
                key={sortType}
                onClick={() => {
                  setHomePageQueryData({
                    ...homePageQueryData,
                    page: 1,
                    sort: sortType,
                  });
                }}
              >
                <span
                  className={clsx({
                    active: homePageQueryData?.sort === sortType,
                  })}
                >
                  {upperCaseEachWord(sortType.replaceAll(`_`, ` `))}
                </span>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </>
  );
}
