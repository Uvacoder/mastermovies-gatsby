import { CalendarFilled, DownOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import classnames from "classnames";
import moment, { Moment } from "moment";
import React, { useContext } from "react";
import { GlacierContext } from "../../../../context";
import { EGlacierActions } from "../../../../context/actions";
import styles from "./range.module.css";

export type TGlacierSearchRange = [Moment, Moment];

export interface IGlacierSearchRange {
  active: boolean;
  focus: boolean;
  range: TGlacierSearchRange | null;
}

export const GlacierSearchRangeDefault = {
  active: false,
  focus: false,
  range: null,
};

export const GlacierSearchRange: React.FC = () => {
  const [{ range }, dispatch] = useContext(GlacierContext);

  const updateRange = (newRange: Partial<IGlacierSearchRange>) => {
    dispatch({ type: EGlacierActions.UPDATE_RANGE, data: newRange });
  };

  return (
    <div className={styles.range}>
      <div
        className={classnames(styles.button, { [styles.active]: range.active })}
        onClick={() => updateRange({ focus: !range.focus })}
      >
        <CalendarFilled />
        {prettyRange(range.range)}
        <DownOutlined />
      </div>

      <DatePicker.RangePicker
        ranges={{
          "All films": null,
          "This Month": [moment().startOf("month"), moment().endOf("month")],
          "This Year": [moment().startOf("year"), moment().endOf("year")],
          "Last Year": [moment().startOf("year").subtract(1, "year"), moment().endOf("year").subtract(1, "year")],
        }}
        open={range.focus}
        value={range.range}
        onChange={(newRange) => updateRange({ range: processRange(newRange) })}
        onOpenChange={(open) => updateRange({ focus: open })}
        className={styles.picker}
      />
    </div>
  );
};

/** Cleans up the range to the entire day, or null to deselect range */
function processRange(range: TGlacierSearchRange | null): TGlacierSearchRange | null {
  if (range === null) return null;
  return [range[0].startOf("day"), range[1].endOf("day")];
}

/** Format a date range into a pretty relative/duration string */
function prettyRange(range: TGlacierSearchRange): string {
  if (range === null) return "Since the start";

  if (range[0].unix() === range[1].clone().startOf("day").unix()) {
    return `On ${range[0].format("ll")}`;
  }

  const now = moment().startOf("day");
  if (range[1].unix() === now.clone().endOf("day").unix()) {
    return `Since ${range[0].format("ll")}`;
  } else if (range[0].unix() === now.clone().startOf("day").unix()) {
    return `Until ${range[1].format("ll")}`;
  } else {
    return `During ${duration(range[1].unix() - range[0].unix())}`;
  }
}

const MINUTE = 60;
const DAY = 86400;
const WEEK = 604800;
const YEAR = 31557600;

/** Formats a second based duration into a pretty string  */
function duration(seconds: number) {
  let unit: string;
  let number: number;

  if (seconds >= YEAR * 0.99) {
    unit = "year";
    number = seconds / YEAR;
  } else if (seconds >= WEEK * 0.95) {
    unit = "week";
    number = seconds / WEEK;
  } else if (seconds >= DAY * 0.95) {
    unit = "day";
    number = seconds / DAY;
  } else if (seconds >= MINUTE * 0.95) {
    unit = "minute";
    number = seconds / MINUTE;
  } else {
    unit = "second";
    number = seconds;
  }

  const rounded = Math.round(number) || 1;
  return `${rounded} ${unit}${rounded !== 1 ? "s" : ""}`;
}
