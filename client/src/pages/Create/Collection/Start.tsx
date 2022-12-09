// React and Grommet
import React, { useState } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text, Textarea } from "@chakra-ui/react";
import { CheckIcon, CloseIcon, InfoOutlineIcon } from "@chakra-ui/icons";

// Navigation
import { useLocation, useNavigate } from "react-router-dom";

// Database and models
import { postData } from "src/database/functions";
import { CollectionStruct, Create } from "types";

// Utility functions
import { pseudoId } from "src/database/functions";

export const Start = ({}) => {
  const navigate = useNavigate();

  // Extract prior state and apply
  const { state } = useLocation();

  const initialName =
    state === null ? pseudoId() : (state as Create.Collection.Start).name;
  const initialCreated =
    state === null
      ? new Date()
      : (state as Create.Collection.Start).created;
  const initialOwner =
    state === null ? "" : (state as Create.Collection.Start).owner;
  const initialDescription =
    state === null ? "" : (state as Create.Collection.Start).description;

  const [name, setName] = useState(initialName);
  const [created, setCreated] = useState(initialCreated);
  const [owner, setOwner] = useState(initialOwner);
  const [description, setDescription] = useState(initialDescription);

  const collectionData: CollectionStruct = {
    name: name,
    description: description,
    owner: owner,
    created: created,
    entities: [],
  };

  return (
    <Box m={"2"}>
      <Flex direction={"column"} p={"2"} pt={"8"} pb={"8"}>
        <Flex direction={"row"}>
          <Heading size={"2xl"}>Create Collection</Heading>
        </Flex>
      </Flex>

      <Flex p={"2"} pb={"6"} direction={"row"} wrap={"wrap"} justify={"space-between"} gap={"6"}>
        <Flex direction={"column"} gap={"2"} grow={"1"} maxW={"md"} p={"2"} rounded={"2xl"}>
          <Heading size={"xl"} margin={"xs"}>
            Details
          </Heading>
          <Text>
            Specify some basic details about this Collection.
          </Text>
          <Flex direction="row" gap={"4"}>
            <Flex direction="column" justify="between" gap={"4"}>
              <FormControl isRequired>
                <FormLabel htmlFor="name" fontWeight={'normal'}>
                  Collection Name
                </FormLabel>
                <Input
                  id="name"
                  name="name"
                  borderColor={"blackAlpha.300"}
                  focusBorderColor={"black"}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel htmlFor="owner" fontWeight={'normal'}>
                  Collection Owner
                </FormLabel>
                <Input
                  id="owner"
                  name="owner"
                  borderColor={"blackAlpha.300"}
                  focusBorderColor={"black"}
                  value={owner}
                  onChange={(event) => setOwner(event.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="date" fontWeight={'normal'}>
                  Creation Date
                </FormLabel>
                
                <SingleDatepicker
                  id="owner"
                  name="owner"
                  propsConfigs={{
                    dateNavBtnProps: {
                      colorScheme: "gray"
                    },
                    dayOfMonthBtnProps: {
                      defaultBtnProps: {
                        borderColor: "blackAlpha.300",
                        _hover: {
                          background: "black",
                          color: "white",
                        }
                      },
                      selectedBtnProps: {
                        background: "black",
                        color: "white",
                      },
                      todayBtnProps: {
                        borderColor: "blackAlpha.300",
                        background: "gray.50",
                        color: "black",
                      }
                    },
                  }}
                  date={created}
                  onDateChange={setCreated}
                />
              </FormControl>
            </Flex>

            <Flex direction="column">
              <FormControl isRequired>
                <FormLabel htmlFor="description" fontWeight={'normal'}>
                  Description
                </FormLabel>
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </FormControl>
            </Flex>
          </Flex>
        </Flex>

        <Flex direction={"column"} gap={"2"} p={"4"} rounded={"2xl"} background={"whitesmoke"}>
          <Flex align={"center"} gap={"2"}><InfoOutlineIcon boxSize={"8"} /><Heading>Collections</Heading></Flex>
          <Text>Collections can be used to organize Entities. Any type of Entity can be included in a Collection.</Text>
          <Text>Entities can be added and removed from a Collection after it has been created.</Text>
        </Flex>
      </Flex>

      <Flex p={"2"} direction={"row"} w={"full"} flexWrap={"wrap"} gap={"6"} justify={"space-between"}>
        <Button colorScheme={"red"} rightIcon={<CloseIcon />} variant={"outline"} onClick={() => navigate("/")}>
          Cancel
        </Button>

        <Button
          colorScheme={"green"}
          rightIcon={<CheckIcon />}
          onClick={() => {
            // Push the data
            postData(`/collections/create`, collectionData).then(() =>
              navigate("/collections")
            );
          }}
        >
          Finish
        </Button>
      </Flex>
    </Box>
  );
};

export default Start;
