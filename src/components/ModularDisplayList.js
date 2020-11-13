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

export function DefaultModularRow(props) {
  const { index, data, style } = props;
  const { headers, pathRoot, selectedId, history } = data;
  const item = data.items[index];

  let innerCols = [];

  let desiredId = item.id;
  const isSelected = selectedId === desiredId;

  let headerLen = headers.length;
  for (let h = 0; h < headerLen; ++h) {
    let headerObj = headers[h];

    innerCols.push(
      <Col key={`${desiredId}-${h}`}>{headerObj.listDisplayFunc(item)}</Col>
    );
  }

  let pathRoute = `${pathRoot}/${desiredId}`;

  let activeName = isSelected ? "active" : "";

  return (
    <li
      onClick={(e) => {
        history.push(pathRoute);
        e.preventDefault();
      }}
      className={activeName + (index % 2 === 0 ? " even" : "")}
      style={style}
    >
      <Row>{innerCols}</Row>
    </li>
  );
}

export function ModularDisplayList(props) {
  let {
    ListItemSlot,
    CustomFilterSlot,
    headers,
    items,
    pathRoot,
    height,
    selectedId,
    itemSize,
    //...otherProps
  } = props;
  const appTheme = useContext(AppTheme);
  let history = useHistory();
  let [simpleFilter, setSimpleFilter] = useState("");
  let [sortByIdx, setSortByIdx] = useState(0);
  let [sortAscending, setSortAscending] = useState(true);

  // TODO: Filter items in the list against a simple string filter

  if (!ListItemSlot) {
    ListItemSlot = DefaultModularRow;
    // function ({ style, index }) {
    //   return <div style={style}>Row: {index}</div>;
    // };
  }

  items = items.filter((i) => i.doSimpleFilter(simpleFilter));

  items.sort(headers[sortByIdx].sortFunc(sortAscending));

  return (
    <>
      <Row className="mx-0 w-100">
        <input
          placeholder="Filter"
          type="text"
          value={simpleFilter}
          style={{
            width: "100%",
          }}
          onInput={(e) => {
            setSimpleFilter(e.target.value);
          }}
          onChange={(e) => {
            setSimpleFilter(e.target.value);
          }}
        />
      </Row>
      <Row className="mx-0">{CustomFilterSlot && <CustomFilterSlot />}</Row>
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
        itemData={{ items, headers, pathRoot, history, selectedId }}
        itemSize={itemSize}
        headers={headers}
        style={{ overflowX: "hidden" }}
      >
        {ListItemSlot}
      </List>
    </>
  );
}

ModularDisplayList.propTypes = {
  ListItemSlot: PropTypes.func,
  CustomFilterSlot: PropTypes.element,
  headers: PropTypes.arrayOf(MDColumn),
  items: PropTypes.arrayOf(BaseDataItem),
  height: PropTypes.number,
};
