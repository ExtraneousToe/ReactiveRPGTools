import React, { useState } from "react";
import { useHistory } from "react-router";
import { Row, Col } from "react-bootstrap";
import "./DisplayList.css";
import { connect } from "react-redux";
import {
  getMonsterDict,
  getSelectedMonsterId,
  getSubMonsterDict,
} from "../redux/selectors";
import { CARD_SIZES } from "../data/referenceCardSizes";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";
import { ChallengeRating, CreatureType } from "../data/Monster";
import Sources from "../data/sources.json";
import "./Columnable.css";
import "../LayoutControl/Layout.css";
import { selectMonster } from "../redux/actions";

class DisplayColumn {
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

const listSelector = (store) => ({
  monsterDict: getMonsterDict(store),
  subMonsterDict: getSubMonsterDict(store),
});

export default connect(listSelector)(MonsterDisplayList);

function MonsterDisplayList(props) {
  // headers should be a collection of DisplayColumn instances
  let items = Object.values(props.monsterDict);
  let headers = [
    new DisplayColumn(
      "Name",
      (item) => {
        return <>{item["name"]}</>;
      },
      (a, b) => {
        return sortStrAsc(a.name, b.name);
      }
    ),
    new DisplayColumn(
      "Type",
      (item) => {
        return <>{item["type"].displayString}</>;
      },
      (a, b) => {
        return CreatureType.sortAscending(a.type, b.type);
      }
    ),
    new DisplayColumn(
      "CR",
      (item) => {
        return <>{item.challengeRating.displayString}</>;
      },
      (a, b) => {
        return ChallengeRating.sortAscending(
          a.challengeRating,
          b.challengeRating
        );
      }
    ),
    new DisplayColumn(
      "Card Size",
      (item) => {
        var subMon = props.subMonsterDict[item.id];
        return <>{subMon ? CARD_SIZES[subMon.cardSize] : "-"}</>;
      },
      (a, b) => {
        var subMonA = props.subMonsterDict[a.id];
        var subMonB = props.subMonsterDict[b.id];

        if (subMonA && subMonB) {
          return subMonA.cardSize - subMonB.cardSize;
        } else if (subMonA && !subMonB) {
          return -1;
        } else if (!subMonA && subMonB) {
          return 1;
        } else {
          // TODO: Fix this
          return -1;
        }
      }
    ),
    new DisplayColumn(
      "Source",
      (item) => {
        return <span title={Sources[item["source"]]}>{item["source"]}</span>;
      },
      (a, b) => {
        return sortStrAsc(a.source, b.source);
      }
    ),
  ];

  let [sortByIdx, setSortByIdx] = useState(0);
  let [sortAscending, setSortAscending] = useState(true);

  let headerRowContents = [];
  for (let i = 0; i < headers.length; ++i) {
    headerRowContents.push(
      <Col
        key={`dl-h-col-${i}`}
        onClick={(e) => {
          e.preventDefault();

          if (i === sortByIdx) {
            setSortAscending(!sortAscending);
          } else {
            setSortByIdx(i);
            setSortAscending(true);
          }
        }}
        className={`list-header ${i === sortByIdx && "active"}`}
      >
        {headers[i].colDisplay}{" "}
        {i === sortByIdx && <>{sortAscending ? "^" : "v"}</>}
      </Col>
    );
  }

  let filterObject = props.filterObject;
  let filterKeys = Object.keys(filterObject);

  for (let i = 0; i < filterKeys.length; ++i) {
    items = items.filter(filterObject[filterKeys[i]]);
  }

  items.sort(headers[sortByIdx].sortFunc(sortAscending));

  let contentsRows = [];
  let itemLen = items.length;
  for (let i = 0; i < itemLen; ++i) {
    contentsRows.push();
  }

  contentsRows = items.map((item, idx) => {
    return (
      <DisplayListRow
        key={`row-${item.id}`}
        headers={headers}
        item={item}
        // idFunction={props.idFunction}
        pathRoot={props.pathRoot}
        //isSelected={props.idFunction(item) === props.selectedId}
      />
    );
  });

  return (
    <>
      {/* <span>{items.length}</span> */}
      <Row className="mx-0">{headerRowContents}</Row>
      <ul className="element-list">{contentsRows}</ul>
    </>
  );
}

const idSelector = (store) => ({
  //selectedMonsterId: getSelectedMonsterId(store),
  selectedMonsterId: getSelectedMonsterId(store),
  previousMonsterId: store.monsters.previousMonsterId,
});

const dispatchProps = (disp) => ({
  selectMonster: (monId) => disp(selectMonster(monId)),
});

const areMergedPropsEqual = (next, prev) => {
  if (prev.item.id === "aboleth_mm") {
    const printMergeProps = (name, props) => {
      console.log(
        `${name}: ${props.item.id} [${JSON.stringify({
          selectedMonsterId: props.selectedMonsterId,
          previousMonsterId: props.previousMonsterId,
        })}]`
      );
      // console.log(
      //   `${name}: ${Object.keys(props)
      //     .map((it) => `[${it}, ${[props[it]]}]`)
      //     .join(", ")}`
      // );
    };
    printMergeProps("next", next);
    printMergeProps("prev", prev);
  }

  // return false;

  let itemChanged = prev.item.id !== next.item.id;
  let selectedChanged = prev.selectedMonsterId !== next.selectedMonsterId;

  // return (
  //   itemChanged ||
  //   next.item.id === next.selectedMonsterId ||
  //   next.item.id === next.previousMonsterId
  // );

  if (selectedChanged && itemChanged) {
    return false; // redraw
  } else if (selectedChanged && !itemChanged) {
    // if it equals either, redraw
    return !(
      next.item.id === prev.selectedMonsterId ||
      next.item.id === next.selectedMonsterId
    );
  } else if (!selectedChanged && itemChanged) {
    // if it equals either, redraw
    return !(
      prev.selectedMonsterId === next.item.id ||
      prev.selectedMonsterId === prev.item.id
    );
  } else {
    return true;
  }
};

const DisplayListRow = connect(
  idSelector,
  dispatchProps,
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
  }),
  {
    pure: true,
    areMergedPropsEqual,
  }
)(function (props) {
  let history = useHistory();

  let { headers, item, pathRoot, selectedMonsterId } = props;

  let isSelected = item.id === selectedMonsterId;

  let innerCols = [
    //  <Col key="id">{selectedMonsterId + "|" + item.id}</Col>
  ];

  let desiredId = item.id;

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
        props.selectMonster(desiredId);
        e.preventDefault();
      }}
      className={activeName}
    >
      <Row>{innerCols}</Row>
    </li>
  );
});
