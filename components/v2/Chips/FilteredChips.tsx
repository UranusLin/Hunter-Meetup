import * as React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SetterOrUpdater } from "recoil";

export function Chip(props: any) {
  const { label, onDelete } = props;

  return (
    <div className="badge badge-ghost gap-2 cursor-default">
      {label}
      <XMarkIcon
        className="inline-block w-4 h-4 stroke-current cursor-pointer"
        onClick={onDelete}
        tabIndex={0}
      />
    </div>
  );
}

export const FilteredChips = (props: {
  data: {
    page: number;
    location: string;
    roomType: string;
    sort: string;
    size: number;
  };
  onChange: SetterOrUpdater<{
    page: number;
    location: string;
    roomType: string;
    sort: string;
    size: number;
  }>;
}) => {
  const { data, onChange } = props;
  const handleDelete = (key: "location" | "roomType" | "sort") => {
    onChange((originData) => ({ ...originData, [key]: "" }));
  };
  return (
    <div className="flex flex-wrap items-center justify-start gap-2 pb-4">
      {data.location && (
        <Chip
          label={`Location: ${data.location
            .replaceAll(`_nbsp_`, ` `)
            .replaceAll(`_amp_`, `&`)}`}
          onDelete={() => {
            handleDelete("location");
          }}
        />
      )}
      {data.roomType && (
        <Chip
          label={`Room Type: ${data.roomType
            .replaceAll(`_nbsp_`, ` `)
            .replaceAll(`_amp_`, `&`)}`}
          onDelete={() => {
            handleDelete("roomType");
          }}
        />
      )}
      {data.sort && (
        <Chip
          label={`Sort: ${data.sort}`}
          onDelete={() => {
            handleDelete("sort");
          }}
        />
      )}
    </div>
  );
};
