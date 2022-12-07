// React
import React, { useEffect, useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Table, TableContainer, Tag, TagCloseButton, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { AddIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";

// Navigation
import { useParams, useNavigate } from "react-router-dom";

// Database and models
import { getData, postData } from "src/database/functions";
import { CollectionModel, EntityModel } from "types";

// Custom components
import Linky from "src/components/Linky";
import { Loading } from "src/components/Loading";
import _ from "underscore";

export const Collection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoaded, setIsLoaded] = useState(false);

  const [collectionData, setCollectionData] = useState({} as CollectionModel);
  const [allEntities, setAllEntities] = useState([] as { name: string; id: string }[]);
  const [selectedEntities, setSelectedEntities] = useState([] as string[]);

  useEffect(() => {
    // Populate Collection data
    const response = getData(`/collections/${id}`);

    // Handle the response from the database
    response.then((value) => {
      setCollectionData(value);

      // Check the contents of the response
      if (value["error"] !== undefined) {
        toast({
          title: "Database Error",
          description: value["error"],
          status: "error",
          duration: 4000,
          position: "bottom-right",
          isClosable: true,
        });
      }

      setIsLoaded(true);
    }).then(() => {
      // Populate Entity data
      const entities = getData(`/entities`);

      // Handle the response from the database
      entities.then((entity) => {
        setAllEntities(entity.map((e: EntityModel) => {
          return { name: e.name, id: e._id };
        }));

        // Check the contents of the response
        if (entity["error"] !== undefined) {
          toast({
            title: "Database Error",
            description: entity["error"],
            status: "error",
            duration: 4000,
            position: "bottom-right",
            isClosable: true,
          });
        }

        setIsLoaded(true);
      });
    });

    return;
  }, [id, isLoaded]);

  /**
   * Callback function to add Entities to a Collection
   * @param {{ entities: string[], collection: string }} data List of Entities and a Collection to add the Entities to
   */
  const onAdd = (data: { entities: string[], collection: string }): void => {
    postData(`/collections/add`, data).then(() => {
      navigate(`/collections/${id}`);
    });
  };

  /**
   * Callback function to remove the Entity from the Collection, and refresh the page
   * @param {{ entities: string, collection: string }} data ID of the Entity and Collection to remove the Entity from
   */
  const onRemove = (data: { entity: string, collection: string }): void => {
    postData(`/collections/remove`, data).then(() => {
      navigate(`/collections/${id}`);
    });
  };

  return (
    isLoaded ? (
      <Box m={"2"}>
        <Flex p={"2"} pt={"8"} pb={"8"} direction={"row"} justify={"space-between"} align={"center"} wrap={"wrap"}>
          <Heading size={"2xl"}>Collection:{" "}{collectionData.name}</Heading>
        </Flex>

        <Flex direction={"column"} p={"2"} gap={"2"}>
          {/* Metadata table */}
          <Heading m={"0"}>
            Metadata
          </Heading>

          <TableContainer background={"gray.50"} rounded={"2xl"} p={"4"}>
            <Table mt={"sm"} colorScheme={"gray"}>
              <Thead>
                <Tr>
                  <Th>Field</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Description</Td>
                  <Td><Text>{collectionData.description}</Text></Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>

          {/* List of Entities in the Collection */}
          <Flex direction={"row"} justify={"space-between"} m={"2"}>
            <Heading m={"0"} alignSelf={"center"}>Entities</Heading>
            <Button leftIcon={<AddIcon />} onClick={onOpen} colorScheme={"green"}>
              Add
            </Button>
          </Flex>

          {collectionData.entities.length > 0 && (
            <TableContainer background={"gray.50"} rounded={"2xl"} p={"4"}>
              <Table variant={"simple"} colorScheme={"gray"}>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {collectionData.entities.map((entity) => {
                    return (
                      <Tr key={entity}>
                        <Th>
                          <Linky id={entity} type={"entities"} />
                        </Th>
                        <Th>
                          <Flex justify={"right"} gap={"6"}>
                            <Button
                              key={`view-collection-${entity}`}
                              color="grey.400"
                              rightIcon={<ChevronRightIcon />}
                              onClick={() => navigate(`/entities/${entity}`)}
                            >
                              View
                            </Button>
                            <Button
                              key={`remove-${entity}`}
                              rightIcon={<CloseIcon />}
                              colorScheme={"red"}
                              onClick={() => {
                                if (id) {
                                  // Remove the entity from the collection
                                  onRemove({
                                    entity: entity,
                                    collection: id,
                                  });

                                  // Force the page to reload by setting the isLoaded state
                                  setIsLoaded(false);
                                }
                              }}
                            >
                              Remove
                            </Button>
                          </Flex>
                        </Th>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            {/* Heading and close button */}
            <ModalHeader>Add Entities</ModalHeader>
            <ModalCloseButton />

            {/* Select component for Entities */}
            <Flex direction={"column"} p={"2"} gap={"2"}>
              <FormControl>
                <FormLabel>Add Entities</FormLabel>
                <Select
                  title="Select Entity"
                  placeholder={"Select Entity"}
                  onChange={(event) => {
                    setSelectedEntities([...selectedEntities, event.target.value.toString()]);
                  }}
                >
                  {isLoaded &&
                    allEntities.map((entity) => {
                      return (
                        <option key={entity.id} value={entity.id}>{entity.name}</option>
                      );
                    })
                  };
                </Select>
              </FormControl>

              <Flex direction={"row"} p={"2"} gap={"2"}>
                {selectedEntities.map((entity) => {
                  return (
                    <Tag>
                      <Linky id={entity} type={"entities"} />
                      <TagCloseButton onClick={() => {
                        setSelectedEntities(selectedEntities.filter((selected) => {
                          return !_.isEqual(entity, selected);
                        }));
                      }} />
                    </Tag>
                  );
                })}
              </Flex>
            </Flex>

            {/* "Done" button */}
            <Flex direction={"row"} p={"md"} justify={"center"}>
              <Button
                colorScheme={"green"}
                onClick={() => {
                  if (id) {
                    // Add the Entities to the Collection
                    onAdd({ entities: selectedEntities, collection: id });
                    setSelectedEntities([]);
                    onClose();

                    // Force the page to reload by setting the isLoaded state
                    setIsLoaded(false);
                  }
                }}
              >
                Done
              </Button>
            </Flex>
          </ModalContent>
        </Modal>
      </Box>
    ) : (
      <Loading />
    )
  );
};

export default Collection;
