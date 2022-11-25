import { EventNameDTO } from "features/History/store/dto/EventDTO";
import React from "react";
import { Status } from "shared/types";
import { classnames } from "shared/utils/classnames";
import { Badge } from "../Badge";
import { Shimmer } from "../Shimmer";

import "./row.css";

type Props =
  | {
      type: "basic";
      item: {
        name: EventNameDTO;
        details?: string;
        date: string;
        values?: Array<
          | string
          | {
              value: number;
              unit: string;
            }
        >;
        code?: string;
      };
      status: Status;
      errorText?: string;
      isRef: boolean;
      lastRef: React.RefObject<HTMLTableRowElement>;
      isMainEvent: boolean;
    }
  | {
      type: "header";
      headers: [string, string, string, string];
    };

export const Row = (props: Props) => {
  if (props.type === "header") {
    return (
      <div className={classnames(["row", "row-header"])}>
        <div className="cell-1">{props.headers[0]}</div>
        <div className="cell-2">{props.headers[1]}</div>
        <div className="cell-3">{props.headers[2]}</div>
        <div className="cell-4">{props.headers[3]}</div>
      </div>
    );
  }

  const { isRef, lastRef, status, item, isMainEvent } = props;

  if (status === Status.failed) {
    return (
      <div
        ref={isRef ? lastRef : undefined}
        className={classnames([
          "row",
          isMainEvent ? "main-row" : "not-main-row",
        ])}
      >
        Error occurred while loading event
      </div>
    );
  }

  return (
    <div
      ref={isRef ? lastRef : undefined}
      className={classnames(["row", isMainEvent ? "main-row" : "not-main-row"])}
    >
      <div className="cell-1">{isMainEvent && <Badge title={item.name} />}</div>
      <div className="cell-2">
        {status === Status.loading ? (
          <Shimmer />
        ) : (
          <>
            {item.details &&
              item.details[0].toUpperCase() +
                item.details.slice(1) +
                `${item.values && item.values.length !== 0 ? ": " : ""}`}
            {item.values &&
              item.values.map((value, index, arr) =>
                typeof value === "string"
                  ? `${value}${index === arr.length - 1 ? "" : ", "}`
                  : `${value.value} ${value.unit}`
              )}
          </>
        )}
      </div>
      <div className="cell-3">
        {status === Status.loading ? <Shimmer /> : item.code}
      </div>
      <div className="cell-4">
        <span className={!isMainEvent ? "cell-4__date-not-main" : undefined}>
          {new Date(item.date).toLocaleString("en", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};
