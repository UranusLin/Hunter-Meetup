import { NextApiRequest, NextApiResponse } from "next";

import { Location, RoomType } from "@prisma/client";
import prisma from "../../../lib/prisma";

const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 9;

enum SortType {
  PRICE = "price",
  PUBLISHED_AT = "publishedAt",
}
enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}
const sortTypes = Object.values(SortType);
const sortOrders = Object.values(SortOrder);
const locations = Object.keys(Location);
const roomTypes = Object.keys(RoomType);

const roomListHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>,
) => {
  if (req.method === "GET") {
    try {
      res.status(200).json(await getRoomList(req));
    } catch (err: any) {
      console.error(err);
      res.status(500).json({
        message: err.message,
      });
    }
  } else {
    res.status(401).json({
      message: `HTTP method ${req.method} is not supported.`,
    });
  }
};

async function getRoomList(req: NextApiRequest) {
  // Querying with joins (Many-to-many relation).
  const query = parseLocationsQuery(req.query, true, true);
  const rooms: any[] = await prisma.room.findMany({
    ...query,
    include: {
      members: {
        select: {
          member: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      event: {
        select: {
          id: true,
          name: true,
          imgURL: true,
        },
      },
    },
  });
  const roomIds = rooms.map((b) => b.id);

  // Grouping.
  //
  // Calculate the average rating score for the rooms in the result.
  //
  // Notice: It is more suitable to add column named `average_rating` in rooms table to store
  // the average rating score, which can avoid the need to query every time you use it, and
  // it is easier to implement the sorting feature.
  const roomAverageRatings = await prisma.rating.groupBy({
    by: ["roomId"],
    _avg: {
      score: true,
    },
    where: {
      roomId: {
        in: roomIds,
      },
    },
    // Why must set orderBy?
    orderBy: {
      _avg: {
        score: "asc",
      },
    },
  });
  for (const rating of roomAverageRatings) {
    const index = rooms.findIndex((b) => b.id === rating.roomId);
    rooms[index].averageRating = rating._avg.score;
  }

  const bookCountRatings = await prisma.rating.groupBy({
    by: ["roomId"],
    _count: {
      roomId: true,
    },
    where: {
      roomId: {
        in: roomIds,
      },
    },
    orderBy: {
      _count: {
        roomId: "asc",
      },
    },
  });
  for (const rating of bookCountRatings) {
    const index = rooms.findIndex((b) => b.id === rating.roomId);
    rooms[index].ratings = rating._count.roomId;
  }

  // Counting.
  const total = await prisma.room.count(parseLocationsQuery(req.query));

  return {
    content: rooms,
    total: total,
  };
}

function parseLocationsQuery(
  query: any,
  sorting: boolean = false,
  paging: boolean = false,
) {
  const q: any = {};

  // Filtering.
  // Reference: https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting
  q.where = {};
  if (typeof query.location === "string") {
    if (!locations.includes(query.location)) {
      throw new Error(
        `Parameter \`location\` must be one of [${locations.join(", ")}].`,
      );
    }
    q.where.location = query.location;
  }

  // Filtering by roomType
  if (typeof query.roomType === "string") {
    if (!roomTypes.includes(query.roomType)) {
      throw new Error(
        `Parameter \`roomType\` must be one of [${roomTypes.join(", ")}].`,
      );
    }
    q.where.roomType = query.roomType;
  }

  // Sorting.
  if (sorting) {
    if (sortTypes.includes(query.sort)) {
      let order = SortOrder.ASC;
      if (sortOrders.includes(query.order)) {
        order = query.order;
      }

      if (query.sort === SortType.PRICE) {
        q.orderBy = {
          price: order,
        };
      } else if (query.sort === SortType.PUBLISHED_AT) {
        q.orderBy = {
          publishedAt: order,
        };
      }
    }
  }

  // Paging.
  if (paging) {
    let page = DEFAULT_PAGE_NUM;
    let size = DEFAULT_PAGE_SIZE;
    if (typeof query.page === "string") {
      page = parseInt(query.page);
    }
    if (typeof query.size === "string") {
      size = parseInt(query.size);
    }
    if (size < 0 || size > 100) {
      throw new Error("Parameter `size` must between 0 and 100.");
    }
    q.take = size;
    q.skip = (page - 1) * size;
  }

  return q;
}

export default roomListHandler;
