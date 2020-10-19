import React, { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import {
    StringInput,
    CheckboxInput,
    SelectInput,
    ArrayInput,
} from "./inputUtil";
import Storage from "../utility/StorageUtil";

export function getIdFromItemName(name) {
    return name.toLowerCase().replace(/\s+/g, "_");
}

export function getIdFromItem(item) {
    if (item.Id !== undefined) return item.Id;
    else return getIdFromItemName(item.Name);
}

export function CraftableItemDisplay(props) {
    let craftableItem = props.craftableItem;

    let materialOutput = craftableItem.Materials.map((mat, idx) => {
        return (
            <span key={idx}>
                {Storage.harvestableItemDict[mat.ComponentId].Name} (
                {mat.Quantity})
            </span>
        );
    });
    let finalMaterialOutput = [];
    for (let i = 0; i < materialOutput.length; ++i) {
        if (finalMaterialOutput.length !== 0) {
            finalMaterialOutput.push(" or ");
        }
        finalMaterialOutput.push(materialOutput[i]);
    }

    return (
        <>
            <Row>
                <Col className="font-weight-bold">{craftableItem.Name}</Col>
            </Row>
            <Row>
                <Col>
                    <i>
                        {craftableItem.Type},{" "}
                        {(craftableItem.Rarity !== null
                            ? craftableItem.Rarity
                            : ""
                        ).toLowerCase()}{" "}
                        {craftableItem.RequiresAttunement &&
                            "(requires attunement)"}
                    </i>
                </Col>
            </Row>
            <Row>
                <Col>
                    <i>
                        Crafted by: {finalMaterialOutput} (
                        {craftableItem.Crafter})
                    </i>
                </Col>
            </Row>
            &nbsp;
            <Row>
                <Col className="col-3 font-weight-bold">Description:</Col>
            </Row>
            <Row>
                <Col>
                    {craftableItem.Description.length > 0 &&
                        craftableItem.Description.map((para, idx) => {
                            return <p key={idx}>{para}</p>;
                        })}
                </Col>
            </Row>
        </>
    );
}

export class EditingCraftableItemDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.generateStateObject(this.props.craftableItem);
        this.applyStateToItem = this.applyStateToItem.bind(this);
    }

    generateStateObject(craftableItem) {
        let obj = {};
        return obj;
    }

    handleInput(event, key) {
        event.preventDefault();

        console.log(`${key}: ${event.target.value}`);

        let partialObject = {};
        partialObject[key] = event.target.value;
        this.setState(partialObject);
    }

    applyStateToItem(event) {
        event.preventDefault();

        for (let i = 0; i < this.stringKeys.length; ++i) {
            let targetValue = this.state[this.stringKeys[i].key];

            this.props.craftableItem[this.stringKeys[i].key] = this.stringKeys[
                i
            ].store(targetValue);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.craftableItem.Id !== prevProps.craftableItem.Id) {
            this.setState(this.generateStateObject(this.props.craftableItem));
        }
    }

    componentWillUnmount() {
        let partialObject = {};
        this.setState(partialObject);
    }

    render() {
        let craftableItem = this.props.craftableItem;

        return (
            <Container fluid>
                {/* <div>propObj :: {JSON.stringify(craftableItem)}</div> */}
                <StringInput object={craftableItem} objKey="Id" disabled />
                <StringInput object={craftableItem} objKey="Name" />
                <StringInput object={craftableItem} objKey="Type" />
                <SelectInput
                    object={craftableItem}
                    objKey="Crafter"
                    options={[
                        "Alchemist",
                        "Artificer",
                        "Blacksmith",
                        "Leatherworker",
                        "Tinker",
                        "Thaumaturge",
                    ]}
                />
                <SelectInput
                    object={craftableItem}
                    objKey="Rarity"
                    options={[
                        "",
                        "Common",
                        "Uncommon",
                        "Rare",
                        "Very Rare",
                        "Legendary",
                    ]}
                />
                <CheckboxInput
                    object={craftableItem}
                    objKey="RequiresAttunement"
                />
                <ArrayInput
                    object={craftableItem}
                    objKey="Description"
                    subType={StringInput}
                />
                <ArrayInput
                    object={craftableItem}
                    objKey="Materials"
                    subType={MaterialInput}
                />
            </Container>
        );
    }
}

function MaterialInput(props) {
    let [redraw, setRedraw] = useState(true);
    let propObj = props.object;
    let propKey = props.objKey;
    let propIdx = props.index;

    const onChangeFunc = (e) => {
        if (propIdx !== undefined) {
            propObj[propKey][propIdx] = e.target.value;
        } else {
            propObj[propKey] = e.target.value;
        }
        setRedraw(!redraw);
    };

    return (
        <>
            <StringInput
                object={propObj[propKey][propIdx]}
                objKey="ComponentId"
            />
            <StringInput object={propObj[propKey][propIdx]} objKey="Quantity" />
        </>
    );
}
