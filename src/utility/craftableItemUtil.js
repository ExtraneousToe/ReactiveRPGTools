import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import {
  StringInput,
  CheckboxInput,
  SelectInput,
  ArrayInput,
  RadioButtonInput,
} from "./inputUtil";
import Storage from "./StorageUtil";
import { ModularDescription } from "./descriptionUtil";

export function getIdFromItemName(name) {
  return name.toLowerCase().replace(/\s+/g, "_");
}

export function getIdFromItem(item) {
  if (item.id !== undefined) return item.id;
  else return getIdFromItemName(item.name);
}

export function CraftableItemDisplay(props) {
  let craftableItem = props.craftableItem;

  let materialOutput = craftableItem.materials.map((mat, idx) => {
    let matItem = Storage.harvestableItemDict[mat.componentId];

    return (
      <span key={idx}>
        {matItem ? matItem.name : mat.componentId} ({mat.quantity})
      </span>
    );
  });
  let finalMaterialOutput = [];
  for (let i = 0; i < materialOutput.length; ++i) {
    if (finalMaterialOutput.length !== 0) {
      finalMaterialOutput.push(" " + craftableItem.materialGrouping + " ");
    }
    finalMaterialOutput.push(materialOutput[i]);
  }

  return (
    <>
      <Row>
        <Col className="font-weight-bold">{craftableItem.name}</Col>
      </Row>
      <Row>
        <Col>
          <i>
            {craftableItem.type},{" "}
            {(craftableItem.rarity !== null
              ? craftableItem.rarity
              : ""
            ).toLowerCase()}{" "}
            {craftableItem.requiresAttunement && "(requires attunement)"}
          </i>
        </Col>
      </Row>
      <Row>
        <Col>
          <i>
            Crafted by: {finalMaterialOutput} ({craftableItem.crafter})
          </i>
        </Col>
      </Row>
      &nbsp;
      <Row>
        <Col className="col-3 font-weight-bold">Description:</Col>
      </Row>
      <Row>
        <Col>
          {craftableItem.description.length > 0 &&
            craftableItem.description.map((para, idx) => {
              return <ModularDescription key={idx} description={para} />;
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
        <Row>
          <Col>
            <CheckboxInput object={craftableItem} objKey="RequiresAttunement" />
          </Col>
          <Col>
            <StringInput
              object={craftableItem}
              objKey="AttunementNote"
              hideLabel={true}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <RadioButtonInput // SelectInput
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
          </Col>
          <Col>
            <RadioButtonInput //SelectInput
              object={craftableItem}
              objKey="Rarity"
              options={[
                "Mundane",
                "Common",
                "Uncommon",
                "Rare",
                "Very Rare",
                "Legendary",
                "Mixed",
              ]}
            />
          </Col>
        </Row>
        <ArrayInput
          object={craftableItem}
          objKey="Description"
          subType={StringInput}
        />
        <SelectInput
          object={craftableItem}
          objKey="MaterialGrouping"
          options={["OR", "AND"]}
        />
        <ArrayInput
          object={craftableItem}
          objKey="Materials"
          subType={MaterialInput}
          defaultInsert={{ ComponentId: "", Quantity: "" }}
        />
      </Container>
    );
  }
}

function MaterialInput(props) {
  //   let [redraw, setRedraw] = useState(true);
  let propObj = props.object;
  let propKey = props.objKey;
  let propIdx = props.index;

  // const onChangeFunc = (e) => {
  //     if (propIdx !== undefined) {
  //         propObj[propKey][propIdx] = e.target.value;
  //     } else {
  //         propObj[propKey] = e.target.value;
  //     }
  //     setRedraw(!redraw);
  // };

  return (
    <>
      <StringInput object={propObj[propKey][propIdx]} objKey="ComponentId" />
      <StringInput object={propObj[propKey][propIdx]} objKey="Quantity" />
    </>
  );
}
