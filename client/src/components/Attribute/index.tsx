// React
import React, { useEffect, useState } from "react";

// Existing and custom components
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  FormControl,
  Input,
  Textarea,
} from "@chakra-ui/react";
import Icon from "@components/Icon";
import Values from "@components/Values";

// Existing and custom types
import { AttributeProps } from "@types";

// Utility functions and libraries
import { checkValues } from "src/functions";

const Attribute = (props: AttributeProps) => {
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [values, setValues] = useState(props.values);
  const [finished, setFinished] = useState(false);

  const isNameError = name === "";
  const isDescriptionError = description === "";
  const [validValues, setValidValues] = useState(false);

  const isAttributesError = isNameError || isDescriptionError || !validValues;

  useEffect(() => {
    setValidValues(checkValues(values));
  }, [values]);

  const attributeData: AttributeProps = {
    identifier: props.identifier,
    name: name,
    description: description,
    values: values,
  };

  return (
    <Card variant={"outline"} p={["1", "2"]}>
      <CardBody p={["1", "2"]}>
        <Flex
          direction={"row"}
          gap={"2"}
          justify={["center", "space-between"]}
        >
          <Flex direction={"column"} gap={"2"} grow={"1"}>
            <FormControl isRequired isInvalid={isNameError}>
              <Input
                placeholder={"Name"}
                value={name}
                disabled={finished}
                onChange={(event) => setName(event.target.value)}
              />
            </FormControl>

            <FormControl isRequired isInvalid={isDescriptionError}>
              <Textarea
                value={description}
                placeholder={"Description"}
                disabled={finished}
                onChange={(event) => setDescription(event.target.value)}
              />
            </FormControl>
          </Flex>

          <Flex grow={"1"}>
            <Values
              collection={values}
              viewOnly={finished}
              setValues={setValues}
            />
          </Flex>
        </Flex>
      </CardBody>

      <Divider />

      <CardFooter justify={"right"}>
        <Flex direction={"row"} gap={"2"}>
          <Button
            colorScheme={"red"}
            onClick={() => {
              if (props.onRemove) {
                props.onRemove(props.identifier);
              }
            }}
            rightIcon={<Icon name={"delete"} />}
          >
            Remove
          </Button>

          <Button
            rightIcon={<Icon name={"check"} />}
            colorScheme={"green"}
            onClick={() => {
              setFinished(true);
              if (props.onUpdate) {
                props.onUpdate(attributeData);
              }
            }}
            isDisabled={finished || isAttributesError}
          >
            Done
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default Attribute;
