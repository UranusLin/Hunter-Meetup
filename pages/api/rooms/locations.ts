import { NextApiRequest, NextApiResponse } from "next";

import { Location } from "@prisma/client";

const locations = Object.values(Location);

const locationsListHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>,
) => {
  if (req.method === "GET") {
    res.status(200).json(locations);
  } else {
    res.status(401).json({
      message: `HTTP method ${req.method} is not supported.`,
    });
  }
};

export default locationsListHandler;
