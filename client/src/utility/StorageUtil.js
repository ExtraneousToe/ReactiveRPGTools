import Data from "../data/system-state.json";
import { getIdFromMonster } from "./monsterUtil";

// let initialised = false;
const Storage = {
    _init: false,

    // lists
    monsterList: [],

    // dictionaries
    monsterDict: {},
    harvestableItemDict: {},
    trinketTableDict: {},

    Init: () => {
        if (Storage._init) {
            console.log("Storage already initialised");
            return;
        }

        Storage.monsterList = Data.Monsters;
        for (let idx = 0; idx < Storage.monsterList.length; ++idx) {
            let monster = Storage.monsterList[idx];
            // console.log(getIdFromMonster(monster));
            Storage.monsterDict[getIdFromMonster(monster)] = monster;
        }

        Storage._init = true;
        // console.log(JSON.stringify(Storage));
    },
};

export default Storage;
