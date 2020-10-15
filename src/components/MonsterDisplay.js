import React, { useState } from "react";
import { StatBlock } from "../utility/statsUtil";
import { getCreatureTypeDisplayString } from "../utility/creatureTypeUtil";
import { getChallengeRatingDisplayString } from "../utility/challengeRatingUtil";
import { Tabs, Tab, Row, Col } from "react-bootstrap";
import { CARD_SIZES } from "../data/referenceCardSizes";
import Storage from "../utility/StorageUtil";
import { TrinketTableDisplay } from "../utility/trinketTableUtil";
import { HarvestingTableDisplay } from "../utility/harvestingTableUtil";

const COMBAT_TAB_KEY = "combat";
const TABLES_TAB_KEY = "tables";

const HARVESTING_TAB_KEY = "harvesting";
const TRINKET_TAB_KEY = "trinkets";

export function MonsterDisplay(props) {
    let [tabKey, setTabKey] = useState(TABLES_TAB_KEY);
    let [tablesTabKey, setTablesTabKey] = useState(HARVESTING_TAB_KEY);
    let monster = props.monster;

    if (monster === null) return <></>;

    let nameOut = monster.Name;
    let typeOut = getCreatureTypeDisplayString(monster.CreatureType);
    let cardSize = monster.ReferenceCardSize;
    let acOut = <i>nyi</i>;
    let hpOut = <i>nyi</i>;
    let speedOut = <i>nyi</i>;

    let statsOut = <StatBlock statBlock={monster.StatBlock} />;

    let hasHarvestingTable = monster.HarvestingTable.Rows.length > 0;
    let hasTrinketTable = monster.TrinketTableType !== null;

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
                        <i>{typeOut}</i>
                    </div>
                    <div>
                        <b>Card Size: </b>
                        {CARD_SIZES[cardSize]}
                    </div>
                </Col>
                <Col className="text-right">
                    <div>
                        <b>Source</b>
                        <div>{monster.PrimarySource}</div>
                        {monster.OtherSources.length > 0 && (
                            <i>{monster.OtherSources.join(", ")}</i>
                        )}
                    </div>
                </Col>
            </Row>
            <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
                <Tab eventKey={COMBAT_TAB_KEY} title="Combat">
                    <div>
                        <b>Armor Class: </b>
                        {acOut}
                    </div>
                    <div>
                        <b>Health: </b>
                        {hpOut}
                    </div>
                    <div>
                        <b>Speed: </b>
                        {speedOut}
                    </div>
                    <div className="border" />
                    {statsOut}
                    <div className="border" />
                    <div>
                        <b>Challenge Rating: </b>
                        {getChallengeRatingDisplayString(
                            monster.ChallengeRating
                        )}
                    </div>
                </Tab>
                <Tab
                    eventKey={TABLES_TAB_KEY}
                    title="Tables"
                    disabled={!hasTables}
                >
                    <Tabs
                        activeKey={tablesTabKey}
                        onSelect={(k) => setTablesTabKey(k)}
                    >
                        <Tab
                            eventKey={HARVESTING_TAB_KEY}
                            title="Harvesting"
                            disabled={!hasHarvestingTable}
                        >
                            <HarvestingTableDisplay
                                challengeRating={monster.ChallengeRating}
                                creatureType={monster.CreatureType}
                                harvestingTable={monster.HarvestingTable}
                            />
                            {/* {JSON.stringify(monster.HarvestingTable)} */}
                        </Tab>
                        <Tab
                            eventKey={TRINKET_TAB_KEY}
                            title="Trinkets"
                            disabled={!hasTrinketTable}
                        >
                            <TrinketTableDisplay
                                trinketTable={
                                    Storage.trinketTableDict[
                                        monster.TrinketTableType
                                    ]
                                }
                            />
                        </Tab>
                    </Tabs>
                </Tab>
            </Tabs>
            {/* <div className="border" /> */}
            {/* {JSON.stringify(monster)} */}
        </>
    );
}
