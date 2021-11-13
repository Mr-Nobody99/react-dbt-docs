import React from "react";
import styled from "styled-components";
import Stats from "./components/Stats";
import Tag_Links from "./components/Tag_Links";

const Details_Wrapper = styled.section`
  padding: 20px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgb(0 30 60 / 3%), 0 3px 3px -1.5px rgb(0 0 0 / 3%);
  display: flex;
  flex-direction: column;

  .first {
    order: 1;
  }
  .second {
    border-top: 1px solid #eeeeee;
    order: 2;
  }

  .label-wrapper {
    margin: 0;
    padding: 0.5em 1em;
    vertical-align: top;
    display: inline-block;
  }

  .label {
    margin: 0;
    color: #8b969e;
    font-weight: 500;
    font-size: 0.75em;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .detail {
    margin-left: 0;
    color: #313539;
    line-height: 1.6;
  }

  .tag {
    cursor: pointer;
    color: #0aa;
  }
`;

interface Props {
  data: ManifestData;
  setSearching: (value: boolean) => void;
  setSearchString: (value: string) => void;
  setSearchOptions: (value: SearchOption) => void;
}
const Details = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div ref={ref}>
      <h5>Details</h5>
      <Details_Wrapper>
        {props.data.resource_type === "exposure" ? (
          <div>
            <dl className="label-wrapper">
              <dt className="label">package</dt>
              <dd className="detail">{props.data.package_name}</dd>
            </dl>
            <dl className="label-wrapper">
              <dt className="label">maturity</dt>
              <dd className="detail">{props.data.maturity}</dd>
            </dl>
            <dl className="label-wrapper">
              <dt className="label">owner</dt>
              <dd className="detail">{props.data?.owner?.name}</dd>
            </dl>
            <dl className="label-wrapper">
              <dt className="label">owner email</dt>
              <dd className="detail">{props.data?.owner?.email}</dd>
            </dl>
          </div>
        ) : (
          <>
            <div
              className={
                props.data.meta && Object.values(props.data.meta).length
                  ? "second"
                  : "first"
              }
            >
              {props.data.tags?.length ? (
                <dl className="label-wrapper">
                  <dt className="label">tags</dt>
                  <dd className="detail">
                    <Tag_Links
                      tags={props.data.tags}
                      setSearching={props.setSearching}
                      setSearchString={props.setSearchString}
                      setSearchOptions={props.setSearchOptions}
                    />
                  </dd>
                </dl>
              ) : null}

              {props.data.meta && "owner" in props.data.meta ? (
                <dl className="label-wrapper">
                  <dt className="label">owner</dt>
                  <dd className="detail">
                    {props.data.meta["owner"] as string}
                  </dd>
                </dl>
              ) : null}

              <dl className="label-wrapper">
                <dt className="label">type</dt>
                <dd className="detail">
                  {props.data.resource_type === "source" ||
                  props.data.resource_type === "seed"
                    ? "table"
                    : "config" in props.data && props.data.config?.materialized
                    ? (props.data.config.materialized as string)
                    : null}
                </dd>
              </dl>

              <dl className="label-wrapper">
                <dt className="label">package</dt>
                <dd className="detail">{props.data.package_name}</dd>
              </dl>

              {"database" in props.data && "schema" in props.data ? (
                <dl className="label-wrapper">
                  <dt className="label">relation</dt>
                  <dd className="detail">{`${props.data.database}.${props.data.schema}.${props.data.name}`}</dd>
                </dl>
              ) : null}
            </div>
            <Stats
              stats={("stats" in props.data && props.data.stats) || undefined}
              meta={props.data.meta}
            />
          </>
        )}
      </Details_Wrapper>
    </div>
  );
});
export default Details;
