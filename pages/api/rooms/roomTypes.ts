import { NextApiRequest, NextApiResponse } from "next";

import { RoomType } from "@prisma/client";

const roomTypes = Object.values(RoomType);

const roomTypesListHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>,
) => {
  if (req.method === "GET") {
    res.status(200).json(roomTypes);
  } else {
    res.status(401).json({
      message: `HTTP method ${req.method} is not supported.`,
    });
  }
};

export default roomTypesListHandler;
