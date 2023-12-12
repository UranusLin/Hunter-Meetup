import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../lib/prisma";

const buyBookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>,
) => {
  if (req.method === "POST") {
    try {
      const result = await buyBook(req);
      res.status(result.status).json({
        message: result.message,
        data: result,
      });
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

async function buyBook(req: NextApiRequest): Promise<any> {
  // Get roomId;
  if (typeof req.query.id !== "string") {
    throw new Error("Invalid parameter `id`.");
  }
  const roomId = BigInt(req.query.id);

  // Get quality;
  if (typeof req.query.quality !== "string") {
    throw new Error("Invalid parameter `num`.");
  }
  const quality = Math.floor(Number(req.query.quality));
  if (quality <= 0) {
    throw new Error("Parameter `quality` must greater than zero.");
  }

  // TODO: get user ID from context.
  if (typeof req.query.userId !== "string") {
    throw new Error("Invalid parameter `userId`.");
  }
  const userId = BigInt(req.query.userId);

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Found the room that the user want to purchase.
      const book = await prisma.room.findFirst({
        where: {
          id: roomId,
        },
      });

      if (book === undefined || book === null) {
        throw new Error(
          `Can not found the book <${roomId}> that you want to buy.`,
        );
      }

      // Check if has enough rooms for the user purchase.
      const stock = book.stock;
      if (quality > stock) {
        throw new Error(
          `Didn't have enough stock of book <${roomId}> for your purchase.`,
        );
      }

      // Cost the user balance to buy the room.
      const cost = book?.price.mul(quality).toNumber();
      const purchaser = await prisma.user.update({
        data: {
          balance: {
            decrement: cost,
          },
        },
        where: {
          id: userId,
        },
      });
      if (purchaser.balance.lt(0)) {
        throw new Error(
          `User <${userId}> doesn't have enough money to buy book <${roomId}>, which need to cost ${cost}.`,
        );
      }

      // Update the room stock.
      const newBook = await prisma.room.update({
        data: {
          stock: {
            decrement: 1,
          },
        },
        where: {
          id: roomId,
        },
      });
      if (newBook.stock < 0) {
        throw new Error(`The book ${newBook.stock} is out of stock.`);
      }

      // Generate a new order to record.
      const order = prisma.order.create({
        data: {
          userId: userId,
          roomId: roomId,
          quality: quality,
        },
      });

      return {
        userId: userId,
        roomId: roomId,
        bookTitle: book.title,
        cost: cost,
        remaining: purchaser.balance,
        orderId: order,
      };
    });
    return {
      status: 200,
      message: `User <${userId}> buy ${quality} books <${roomId}> successfully, cost: ${result.cost}, remain: ${result.remaining} .`,
      data: result,
    };
  } catch (err: any) {
    console.error(err);
    return {
      status: 500,
      message: `Failed to buy book ${roomId} for user ${userId}: ${err.message}`,
    };
  }
}

export default buyBookHandler;
