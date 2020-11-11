import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { FixedSizeList as List } from "react-window";
import { Row, Col } from "reactstrap";
import BaseDataItem from "../data/BaseDataItem";
import AppTheme from "../themeContext";
import PropTypes from "prop-types";

export class MDColumn {
  constructor(colDisplay, listDisplayFunc, ascendingSortFunction) {
    this.colDisplay = colDisplay;
    this.listDisplayFunc = listDisplayFunc;
    this.ascendingSortFunction = ascendingSortFunction;

    this.sortFunc = this.sortFunc.bind(this);
    this.sortAscending = this.sortAscending.bind(this);
    this.sortDescending = this.sortDescending.bind(this);
  }

  sortFunc(isAscending) {
    return isAscending ? this.sortAscending : this.sortDescending;
  }

  sortAscending(a, b) {
    return this.ascendingSortFunction(a, b);
  }

  sortDescending(a, b) {
    return -this.ascendingSortFunction(a, b);
  }
}

export function ModularDisplayList(props) {
  let {
    ListItemSlot,
    CustomFilterSlot,
    headers,
    items,
    pathRoot,
    height,
  } = props;
  const appTheme = useContext(AppTheme);
  let history = useHistory();
  let [simpleFilter, setSimpleFilter] = useState("");
  let [sortByIdx, setSortByIdx] = useState(0);
  let [sortAscending, setSortAscending] = useState(true);

  // TODO: Filter items in the list against a simple string filter

  if (!ListItemSlot) {
    ListItemSlot = function ({ style, index }) {
      return <div style={style}>Row: {index}</div>;
    };
  }

  items = items.filter((i) => i.doSimpleFilter(simpleFilter));

  items.sort(headers[sortByIdx].sortFunc(sortAscending));

  return (
    <>
      <Row>
        <input
          placeholder="Filter"
          value={simpleFilter}
          onInput={(e) => {
            setSimpleFilter(e.target.value);
          }}
        />
      </Row>
      <Row>{CustomFilterSlot && <CustomFilterSlot />}</Row>
      <Row className="mx-0">
        {headers.map((h, idx) => {
          return (
            <Col
              key={`dl-h-col-${idx}`}
              onClick={(e) => {
                // e.preventDefault();
                if (idx === sortByIdx) {
                  setSortAscending(!sortAscending);
                } else {
                  setSortByIdx(idx);
                  setSortAscending(true);
                }
              }}
              className={`list-header ${idx === sortByIdx && "active"}`}
            >
              {h.colDisplay}{" "}
              {idx === sortByIdx && <>{sortAscending ? "^" : "v"}</>}
            </Col>
          );
        })}
      </Row>
      <List
        className={`element-list ${appTheme.theme.styleName}`}
        height={height}
        width={"100%"}
        itemCount={items.length}
        itemData={{ items, headers, pathRoot, history }}
        itemSize={40}
        headers={headers}
        style={{ overflowX: "hidden" }}
      >
        {ListItemSlot}
      </List>
    </>
  );
}

ModularDisplayList.propTypes = {
  ListItemSlot: PropTypes.element,
  CustomFilterSlot: PropTypes.element,
  headers: PropTypes.arrayOf(MDColumn),
  items: PropTypes.arrayOf(BaseDataItem),
  height: PropTypes.number,
};
