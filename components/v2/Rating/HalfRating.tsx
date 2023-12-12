import * as React from "react";
import clsx from "clsx";
import { UserIcon } from "@heroicons/react/24/outline";
import { UserIcon as UserIconSolid } from "@heroicons/react/24/solid";

export interface HalfRatingProps {
  joined?: number;
  pending?: number;
  disabled?: boolean;
  onChange?: (rating: number) => void;
}

const STAR_COUNT = 10;

export default function HalfRating(props: HalfRatingProps) {
  const { joined = 0, pending = 0, disabled = false, onChange } = props;

  const [value, setValue] = React.useState(joined);
  const randomId = React.useId();

  return (
    <div className="flex items-center">
      {new Array(STAR_COUNT).fill(0).map((_, index) => {
        const isJoined = index < joined;
        const isPending = index >= joined && index < joined + pending;

        return (
          <button key={index} disabled={disabled} className="rating-button">
            {isJoined && <UserIconSolid className="h-5 w-5 text-green-500" />}
            {isPending && <UserIconSolid className="h-5 w-5 text-orange-500" />}
            {!isJoined && !isPending && (
              <UserIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        );
      })}
    </div>
  );
}
