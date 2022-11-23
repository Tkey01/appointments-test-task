import { EventNameDTO } from "features/History/store/dto/EventDTO";
import React, { useMemo } from "react";
import { classnames } from "shared/utils/classnames";
import "./badge.css";

type Props = {
  title: EventNameDTO;
};

export const Badge = ({ title }: Props) => {
  const name = useMemo(() => {
    if (title === "AllergyIntolerance") {
      return "Allergy";
    }

    if (title === "MedicationStatement") {
      return "Medication";
    }

    return title;
  }, [title]);

  return (
    <div
      className={classnames([
        "badge",
        `badge__${name[0].toLowerCase()}${name.slice(1)}`,
      ])}
    >
      {name}
    </div>
  );
};
