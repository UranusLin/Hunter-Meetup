import * as React from "react";
import NextLink from "next/link";
import Image from "next/image";
import { VariantType, useSnackbar } from "notistack";
import { ShoppingCartIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { shoppingCartState } from "atoms";
import { useRecoilState } from "recoil";

import { RoomProps } from "const";
import { currencyFormat } from "lib/utils";
import HalfRating from "components/v2/Rating/HalfRating";

export default function ShoopingItemCard(props: RoomProps) {
  const {
    id,
    title,
    roomType,
    location,
    price,
    averageRating = 0,
    members,
    ratings,
    stock,
    event,
  } = props;
  const [shoppingCart, setShoppingCart] = useRecoilState(shoppingCartState);

  const { enqueueSnackbar } = useSnackbar();

  const addItem = () => {
    setShoppingCart((oldShoppingCart) => {
      const existingItem = oldShoppingCart.find((i) => i.id === id);
      if (existingItem) {
        if (existingItem.quantity >= stock) {
          enqueueSnackbar(`Out of stock!`, { variant: "error" });
          return [...oldShoppingCart];
        }
        const newItem = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };
        enqueueSnackbar(`"${title}" was successfully added.`, {
          variant: "success",
        });
        return [...oldShoppingCart.filter((i) => i.id !== id), newItem];
      }
      enqueueSnackbar(`"${title}" was successfully added.`, {
        variant: "success",
      });
      return [
        ...oldShoppingCart,
        {
          ...props,
          quantity: 1,
        },
      ];
    });
  };

  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl">
      <figure>
        <Image src={event.imgURL} alt={event.name} width={384} height={140} />
      </figure>
      <div className="card-body">
        <div className="flex space-x-2">
          <div className="text-sm text-slate-500">
            {" "}
            {roomType.replaceAll(`_nbsp_`, ` `).replaceAll(`_amp_`, `&`)}
          </div>
          <div className="text-sm text-slate-500">
            {" "}
            {location.replaceAll(`_nbsp_`, ` `).replaceAll(`_amp_`, `&`)}
          </div>
        </div>
        <h2 className="card-title">{title}</h2>
        <p className="font-medium text-slate-500">
          {members.map((author) => author.member.name).join(`, `)}
        </p>
        <HalfRating joined={averageRating} pending={3} disabled />
        <div className="card-actions justify-end">
          <button className="btn" onClick={addItem}>
            <UserPlusIcon className="h-6 w-6" />
          </button>
          <NextLink href={`/room/${id}`} className="btn btn-info">
            View Details
          </NextLink>
        </div>
      </div>
    </div>
  );
}
