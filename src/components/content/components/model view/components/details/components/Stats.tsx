import React from "react";

const convert_bytes = (bytes: number) => {
  const k = 1028;
  const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = ~~(Math.log(bytes) / Math.log(k));
  return (bytes / k ** i).toFixed(2) + " " + sizes[i];
};

interface Props {
  stats?: Map<string, StatsItem>;
  meta?: { [key: string]: unknown };
}
const Stats: React.FC<Props> = (props) => {
  return (
    <div
      className={
        props.meta && Object.values(props.meta).length ? "first" : "second"
      }
    >
      {props.meta
        ? Object.entries(props.meta).map(([key, value]) => (
            <dl key={key} className="label-wrapper">
              <dt className="label">{key}</dt>
              <dd className="detail">
                {typeof value !== "string" ? JSON.stringify(value) : value}
              </dd>
            </dl>
          ))
        : null}
      {props.stats
        ? [...props.stats.values()].map((stat) => (
            <dl key={stat.id} className="label-wrapper">
              <dt className="label">{stat.label}</dt>
              <dd className="detail">
                {stat.id === "bytes"
                  ? convert_bytes(stat.value as number)
                  : stat.value}
              </dd>
            </dl>
          ))
        : null}
    </div>
  );
};

export default Stats;
