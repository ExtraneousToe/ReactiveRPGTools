import React, { useState } from "react";
import { StatBlock } from "../utility/statsUtil";
import { getCreatureTypeDisplayString } from "../utility/creatureTypeUtil";
import { getChallengeRatingDisplayString } from "../utility/challengeRatingUtil";
import { Tabs, Tab, Row, Col } from "react-bootstrap";
import { CARD_SIZES } from "../data/referenceCardSizes";
import Storage from "../utility/StorageUtil";
import { TrinketTableDisplay } from "../utility/trinketTableUtil";
import { HarvestingTableDisplay } from "../utility/harvestingTableUtil";
import { stripTags } from "../utility/stringUtil";

const COMBAT_TAB_KEY = "combat";
const TABLES_TAB_KEY = "tables";

const HARVESTING_TAB_KEY = "harvesting";
const TRINKET_TAB_KEY = "trinkets";

export function MonsterDisplay(props) {
  let [tabKey, setTabKey] = useState(TABLES_TAB_KEY);
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
  let typeOut = getCreatureTypeDisplayString(monster.type);
  let cardSize = monster.cardSize;

  let topBlock = [];

  let acOut = (
    <>
      {monster.armorClass
        .map((ac) => {
          if (ac.from) {
            return ac.ac + " (" + stripTags(ac.from) + ")";
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

  let statsOut = [];
  statsOut.push(<StatBlock statBlock={monster.stats} />);
  statsOut.push(<div key="borderStats" className="border" />);

  let testFunction = function (mon) {
    return JSON.stringify(mon[this.key]);
  };
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
    <div>
      <b>Challenge Rating: </b>
      {getChallengeRatingDisplayString(monster.challengeRating)}
    </div>
  );
  if (skillsSavesEtcOut.length > 0) {
    skillsSavesEtcOut.push(<div className="border" />);
  }

  let traitsAndSpellcastingOut = [];
  monster.traits.forEach((entry) => {
    traitsAndSpellcastingOut.push(
      <>
        <b>{entry.name}</b>:{" "}
        {entry.entries.map((val) => (
          <p>{val}</p>
        ))}
      </>
    );
  });
  monster.spellcasting.forEach((entry) => {
    traitsAndSpellcastingOut.push(
      <>
        <b>{entry.name}</b>:{" "}
        {entry.headerEntries.map((val, idx) => (
          <p key={idx}>{val}</p>
        ))}
        {Object.keys(entry.spells).map((val, idx) => {
          var row = entry.spells[val];
          return (
            <div key={idx}>
              {val === "0" ? "Cantrips" : val} (
              {row.slots ? row.slots + " slots" : "at will"}):{" "}
              {row.spells.map(stripTags).join(", ")}
            </div>
          );
        })}
        {entry.footerEntries &&
          entry.footerEntries.map((val, idx) => <p key={idx}>{val}</p>)}
      </>
    );
  });
  if (traitsAndSpellcastingOut.length > 0) {
    traitsAndSpellcastingOut.push(
      <div key="traitsBorder" className="border" />
    );
  }

  let actionsOut = [];
  monster.actions.forEach((entry) => {
    actionsOut.push(
      <>
        <b>{entry.name}</b>:{" "}
        {entry.entries.map((val) => (
          <p>{val}</p>
        ))}
      </>
    );
  });
  if (actionsOut.length > 0) {
    actionsOut.push(<div key="actionBorder" className="border" />);
  }

  let reactionsOut = [];
  monster.reactions.forEach((entry) => {
    reactionsOut.push(
      <>
        <b>{entry.name}</b>:{" "}
        {entry.entries.map((val) => (
          <p>{val}</p>
        ))}
      </>
    );
  });
  if (reactionsOut.length > 0) {
    reactionsOut.push(<div key="reactionBorder" className="border" />);
  }

  let hasHarvestingTable =
    monster.harvestingTable && monster.harvestingTable.rows.length > 0;
  let hasTrinketTable = monster.trinketTableType !== null;

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

  return (
    <>
      <Row>
        <Col>
          <h4>{nameOut}</h4>
          <div>
            <i>
              {typeOut}, {"<<"}ALIGNMENT{">>"}
            </i>
          </div>
          <div>
            <b>Card Size: </b>
            {CARD_SIZES[cardSize]}
          </div>
        </Col>
        <Col className="text-right">
          <div>
            <b>Source</b>
            <div>{monster.source}</div>
            {monster.otherSources.length > 0 && (
              <i>
                {monster.otherSources.map((oSrc) => oSrc.source).join(", ")}
              </i>
            )}
          </div>
        </Col>
      </Row>
      <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
        <Tab eventKey={COMBAT_TAB_KEY} title="Combat">
          {topBlock}
          {statsOut}
          {skillsSavesEtcOut}
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
              {/* <HarvestingTableDisplay
                challengeRating={monster.challengeRating}
                creatureType={monster.creatureType}
                harvestingTable={monster.harvestingTable}
              /> */}
              {/* {JSON.stringify(monster.HarvestingTable)} */}
            </Tab>
            <Tab
              eventKey={TRINKET_TAB_KEY}
              title="Trinkets"
              disabled={!hasTrinketTable}
            >
              {/* <TrinketTableDisplay
                trinketTable={
                  Storage.trinketTableDict[monster.trinketTableType]
                }
              /> */}
            </Tab>
          </Tabs>
        </Tab>
      </Tabs>
      {/* <div className="border" /> */}
      {/* {JSON.stringify(monster)} */}
    </>
  );
}
