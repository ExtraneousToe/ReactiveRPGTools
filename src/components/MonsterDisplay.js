import React, { useState } from "react";
import { StatBlock } from "../utility/statsUtil";
import { Tabs, Tab, Row, Col } from "react-bootstrap";
import { CARD_SIZES } from "../data/referenceCardSizes";
import Storage from "../utility/StorageUtil";
import { TrinketTableDisplay } from "../utility/trinketTableUtil";
import { HarvestingTableDisplay } from "../utility/harvestingTableUtil";
import { stripTags } from "../utility/stringUtil";
import { DynamicRender, SpellcastingBlock } from "./RenderBlocks";
import { stringFromSize } from "../utility/monsterUtil";
import Sources from "../data/sources.json";

import { connect } from "react-redux";
import { getMonsterDict, getSubMonsterDict } from "../redux/selectors";

const COMBAT_TAB_KEY = "combat";
const TABLES_TAB_KEY = "tables";

const HARVESTING_TAB_KEY = "harvesting";
const TRINKET_TAB_KEY = "trinkets";

function MonsterDisplay(props) {
  let [tabKey, setTabKey] = useState(COMBAT_TAB_KEY);
  let [tablesTabKey, setTablesTabKey] = useState(HARVESTING_TAB_KEY);
  let monster = props.monster;

  if (monster === null) {
    return (
      <>
        <div>Select an item from the list to see stats ...</div>
      </>
    );
  }

  let nameOut = monster.name;
  let typeOut = monster.type.displayString;

  let subMonster = Storage.subStateMonsterDict[monster.id];

  let cardSize = subMonster ? CARD_SIZES[subMonster.cardSize] : "-";

  let traitsAndSpellcastingOut = [];
  monster.traits.forEach((entry, i) => {
    traitsAndSpellcastingOut.push(<DynamicRender toRender={entry} key={i} />);
  });
  monster.spellcasting.forEach((entry, i) => {
    traitsAndSpellcastingOut.push(
      <SpellcastingBlock
        spellcasting={entry}
        key={entry.name ? entry.name : i}
      />
    );
  });
  if (traitsAndSpellcastingOut.length > 0) {
    traitsAndSpellcastingOut.push(
      <div key="traitsBorder" className="border" />
    );
  }

  let actionsOut = [];
  monster.actions.forEach((entry, i) => {
    actionsOut.push(<DynamicRender toRender={entry} key={i} />);
  });
  if (actionsOut.length > 0) {
    actionsOut.push(<div key="actionBorder" className="border" />);
  }

  let reactionsOut = [];
  monster.reactions.forEach((entry, i) => {
    reactionsOut.push(<DynamicRender toRender={entry} key={i} />);
  });
  if (reactionsOut.length > 0) {
    reactionsOut.push(<div key="reactionBorder" className="border" />);
  }

  let harvestingTable =
    subMonster !== undefined && subMonster.harvestingTableGroup !== null
      ? Storage.harvestingTableDict[subMonster.harvestingTableGroup]
      : null;
  let trinketTable =
    subMonster !== undefined && subMonster.trinketTableType !== null
      ? Storage.trinketTableDict[subMonster.trinketTableType]
      : null;

  let hasHarvestingTable = harvestingTable !== null;
  let hasTrinketTable = trinketTable !== null;

  let hasTables = hasHarvestingTable || hasTrinketTable;

  if (!hasTables) {
    if (tabKey === TABLES_TAB_KEY) {
      tabKey = COMBAT_TAB_KEY;
    }
  } else {
    if (!hasHarvestingTable && tablesTabKey === HARVESTING_TAB_KEY) {
      tablesTabKey = TRINKET_TAB_KEY;
    } else if (!hasTrinketTable && tablesTabKey === TRINKET_TAB_KEY) {
      tablesTabKey = HARVESTING_TAB_KEY;
    }
  }
  //tabKey = COMBAT_TAB_KEY;

  let otherSourcesOut = monster.otherSources.map((oSrc, idx) => {
    let line = (
      <span key={idx} title={Sources[oSrc.source]}>
        {oSrc.source}
      </span>
    );
    if (idx !== 0) {
      return [<span key={idx + ","}>{", "}</span>, line];
    } else {
      return line;
    }
  });

  return (
    <>
      <Row>
        <Col sm="9">
          <h4>{nameOut}</h4>
          <div>
            <i>
              {stringFromSize(monster.size)} {typeOut}
              {monster.alignment.length && (
                <span>
                  ,{" "}
                  {monster.alignment
                    .map((ali) => ali.convertedString)
                    .join(" or ")}
                </span>
              )}
            </i>
          </div>
          <div>
            <b>Card Size: </b>
            {cardSize}
          </div>
        </Col>
        <Col className="text-right">
          <div>
            <b>Source</b>
            <div title={Sources[monster.source]}>{monster.source}</div>
            {otherSourcesOut.length > 0 && <i>{otherSourcesOut}</i>}
          </div>
        </Col>
      </Row>
      <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
        <Tab eventKey={COMBAT_TAB_KEY} title="Combat">
          <div>
            <ACHPSpeed monster={monster} />
          </div>
          <div>
            <StatBlock statBlock={monster.stats} />
          </div>
          <div className="border" />
          <div>
            <SkillsAndSavesBlock monster={monster} />
          </div>
          {traitsAndSpellcastingOut}
          {actionsOut}
          {reactionsOut}
        </Tab>
        <Tab eventKey={TABLES_TAB_KEY} title="Tables" disabled={!hasTables}>
          <Tabs activeKey={tablesTabKey} onSelect={(k) => setTablesTabKey(k)}>
            <Tab
              eventKey={HARVESTING_TAB_KEY}
              title="Harvesting"
              disabled={!hasHarvestingTable}
            >
              {
                <HarvestingTableDisplay
                  challengeRating={monster.challengeRating}
                  creatureType={monster.type}
                  harvestingTable={harvestingTable}
                />
              }
              {/* {JSON.stringify(monster.HarvestingTable)} */}
            </Tab>
            <Tab
              eventKey={TRINKET_TAB_KEY}
              title="Trinkets"
              disabled={!hasTrinketTable}
            >
              <TrinketTableDisplay trinketTable={trinketTable} />
            </Tab>
          </Tabs>
        </Tab>
      </Tabs>
      {/* <div className="border" /> */}
      {/* {JSON.stringify(monster)} */}
    </>
  );
}

function ACHPSpeed(props) {
  let monster = props.monster;
  let topBlock = [];

  let acOut = (
    <>
      {monster.armorClass
        .map((ac) => {
          if (ac.from) {
            return ac.ac + " (" + ac.from.map(stripTags).join(", ") + ")";
          } else if (ac.condition) {
            return ac.ac + " " + stripTags(ac.condition);
          } else return ac.ac;
        })
        .join(", ")}
    </>
  );
  topBlock.push(
    <div key="ac">
      <b>AC:</b> {acOut}
    </div>
  );
  let hpOut = (
    <>
      {monster.health.average} ({monster.health.formula})
    </>
  );
  topBlock.push(
    <div key="hp">
      <b>Health:</b> {hpOut}
    </div>
  );
  let speedOut = <>{monster.speed.simpleDisplay}</>;
  topBlock.push(
    <div key="speed">
      <b>Speed:</b> {speedOut}
    </div>
  );
  topBlock.push(<div key="borderTop" className="border" />);

  return <>{topBlock}</>;
}

function SkillsAndSavesBlock(props) {
  let monster = props.monster;

  // let testFunction = function (mon) {
  //   return JSON.stringify(mon[this.key]);
  // };
  let keyValueFunction = function (mon) {
    return Object.keys(mon[this.key])
      .map((inKey) => inKey + " " + mon[this.key][inKey])
      .join(", ");
  };
  let simpleJoinFunction = function (mon) {
    return mon[this.key].join(", ");
  };
  const SSE_PAIRS = [
    {
      key: "saves",
      header: "Saving Throws",
      disp: keyValueFunction,
    },
    {
      key: "skills",
      header: "Skills",
      disp: keyValueFunction,
    },
    {
      key: "resistances",
      header: "Resistances",
      disp: simpleJoinFunction,
    },
    {
      key: "immunity",
      header: "Immunities",
      disp: simpleJoinFunction,
    },
    {
      key: "conditionImmunities",
      header: "Condition Immunities",
      disp: simpleJoinFunction,
    },
    {
      key: "languages",
      header: "Languages",
      disp: simpleJoinFunction,
    },
    {
      key: "senses",
      header: "Senses",
      disp: function (mon) {
        return (
          mon[this.key].join(", ") + ", passive Perception " + mon.passivePerc
        );
      },
    },
  ];
  let skillsSavesEtcOut = [];
  SSE_PAIRS.forEach((pair) => {
    if (monster[pair.key]) {
      skillsSavesEtcOut.push(
        <div key={pair.key}>
          <b>{pair.header}: </b>
          {pair.disp(monster)}
        </div>
      );
    }
  });
  skillsSavesEtcOut.push(
    <div key="cr">
      <b>Challenge Rating: </b>
      {monster.challengeRating.displayString}
    </div>
  );
  if (skillsSavesEtcOut.length > 0) {
    skillsSavesEtcOut.push(<div key="border" className="border" />);
  }

  return <>{skillsSavesEtcOut}</>;
}

const monstersSelector = (state) => ({
  monsterDict: getMonsterDict(state),
  subMonsterDict: getSubMonsterDict(state),
});

export default connect(monstersSelector)(MonsterDisplay);