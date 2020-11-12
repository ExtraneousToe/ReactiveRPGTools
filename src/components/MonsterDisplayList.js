import "../css/Columnable.css";
import "../css/DisplayList.css";
import "../css/Layout.css";

import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
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
import { selectMonster } from "../redux/actions";
import { ModularDisplayList, MDColumn } from "../components/ModularDisplayList";

const listSelector = (store) => ({
  monsterDict: getMonsterDict(store),
  subMonsterDict: getSubMonsterDict(store),
});

export default connect(listSelector)(MonsterDisplayList);

function MonsterDisplayList(props) {
  let [sortByIdx, setSortByIdx] = useState(0);
  let [sortAscending, setSortAscending] = useState(true);

  // headers should be a collection of DisplayColumn instances
  let items = Object.values(props.monsterDict);
  let headers = [
    new MDColumn(
      "Name",
      (item) => {
        return <>{item["name"]}</>;
      },
      (a, b) => {
        return sortStrAsc(a.name, b.name);
      }
    ),
    new MDColumn(
      "Type",
      (item) => {
        return <>{item["type"].displayString}</>;
      },
      (a, b) => {
        return CreatureType.sortAscending(a.type, b.type);
      }
    ),
    new MDColumn(
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
    new MDColumn(
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
    new MDColumn(
      "Source",
      (item) => {
        return <span title={Sources[item["source"]]}>{item["source"]}</span>;
      },
      (a, b) => {
        return sortStrAsc(a.source, b.source);
      }
    ),
  ];

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

  items.sort(headers[sortByIdx].sortFunc(sortAscending));

  return (
    <>
      <ModularDisplayList
        headers={headers}
        items={items}
        pathRoot={props.pathRoot}
        selectedId={props.selectedId}
        height={600}
        itemSize={40}
        ListItemSlot={ListRow}
      />
    </>
  );
}

function ListRow(props) {
  const { index, data, style } = props;
  let item = data.items[index];
  // return <div style={style}>{Object.keys(props).join(",")}</div>;
  return (
    <DisplayListRow
      key={`row-${item.id}`}
      headers={data.headers}
      item={item}
      pathRoot={data.pathRoot}
      style={style}
      history={data.history}
      index={index}
    />
  );
}

const idSelector = (store) => ({
  selectedMonsterId: getSelectedMonsterId(store),
});

const dispatchProps = (disp) => ({
  selectMonster: (monId) => disp(selectMonster(monId)),
});

const areMergedPropsEqual = (next, prev) => {
  let itemChanged = prev.item.id !== next.item.id;
  let selectedChanged = prev.selectedMonsterId !== next.selectedMonsterId;

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
)(
  class DisplayListRowInner extends React.PureComponent {
    render() {
      let history = this.props.history; //useHistory();

      let {
        headers,
        item,
        pathRoot,
        selectedMonsterId,
        index,
        style,
      } = this.props;

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
            this.props.selectMonster(desiredId);
            e.preventDefault();
          }}
          className={activeName + (index % 2 === 0 ? " even" : "")}
          style={style}
        >
          <Row>{innerCols}</Row>
        </li>
      );
    }
  }
);
