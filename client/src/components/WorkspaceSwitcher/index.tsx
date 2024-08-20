import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Icon from "@components/Icon";

// GraphQL resources
import { gql, useLazyQuery, useQuery } from "@apollo/client";

// Custom types
import { IAuth, WorkspaceModel } from "@types";

// Routing and navigation
import { useNavigate } from "react-router-dom";

// Utility functions and libraries
import { useToken } from "src/authentication/useToken";
import _ from "lodash";

const WorkspaceSwitcher = () => {
  const navigate = useNavigate();

  const toast = useToast();
  const [workspaces, setWorkspaces] = useState([] as WorkspaceModel[]);

  // Access token to set the active Workspace
  const [token, setToken] = useToken();
  const [workspaceIdentifier, setWorkspaceIdentifier] = useState(
    token.workspace,
  );
  const [workspace, setWorkspace] = useState({} as WorkspaceModel);

  const [isOpen, setIsOpen] = useState(false);
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  // Query to retrieve Workspaces
  const GET_WORKSPACES = gql`
    query GetWorkspaces {
      workspaces {
        _id
        owner
        name
        description
      }
    }
  `;
  const { loading, error, data, refetch } = useQuery<{
    workspaces: WorkspaceModel[];
  }>(GET_WORKSPACES);

  // Query to get a Workspace
  const GET_WORKSPACE = gql`
    query GetWorkspace($_id: String) {
      workspace(_id: $_id) {
        _id
        owner
        name
      }
    }
  `;
  const [getWorkspace, { loading: _workspaceLoading, error: workspaceError }] =
    useLazyQuery<{ workspace: WorkspaceModel }>(GET_WORKSPACE);

  // Manage data once retrieved
  useEffect(() => {
    if (data?.workspaces) {
      // Unpack all the Entity data
      setWorkspaces(data.workspaces);
    }

    if (error) {
      toast({
        title: "Error",
        description: "Unable to retrieve Workspaces",
        status: "error",
        duration: 2000,
        position: "bottom-right",
        isClosable: true,
      });
    }
  }, [loading]);

  // Check to see if data currently exists and refetch if so
  useEffect(() => {
    if (data && refetch) {
      refetch();
    }
  }, []);

  useEffect(() => {
    console.info("workspaceIdnetifier:", workspaceIdentifier);
    const updateWorkspace = async () => {
      // When the `workspaceIdentifier` value changes, retrieve updated model
      const result = await getWorkspace({
        variables: {
          _id: workspaceIdentifier,
        },
      });

      if (result.data?.workspace) {
        setWorkspace(result.data.workspace);

        // Clone the existing token and update with selected Workspace ID
        const updatedToken: IAuth = _.cloneDeep(token);
        updatedToken.workspace = workspaceIdentifier;
        setToken(updatedToken);
      }

      if (workspaceError) {
        toast({
          title: "Error",
          description: "Unable to retrieve Workspaces",
          status: "error",
          duration: 2000,
          position: "bottom-right",
          isClosable: true,
        });
      }
    };

    if (workspaceIdentifier !== "") {
      updateWorkspace();
    } else {
      onCreateOpen();
    }
  }, [workspaceIdentifier]);

  const performLogout = () => {
    // Invalidate the token and refresh the page
    setToken({
      name: token.name,
      orcid: token.orcid,
      token: "",
      workspace: "",
    });
    navigate(0);
  };

  return (
    <Flex>
      <Menu isOpen={isOpen}>
        <MenuButton
          h={"100%"}
          w={"100%"}
          rounded={"md"}
          border={"1px"}
          borderColor={"gray.200"}
          bg={"white"}
          _hover={{ bg: "gray.300" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Flex
            direction={"row"}
            align={"center"}
            gap={"2"}
            p={"2"}
            ml={"2"}
            mr={"2"}
          >
            <Text
              fontSize={"sm"}
              fontWeight={"semibold"}
              w={"100%"}
              align={"center"}
            >
              {_.truncate(workspace.name, { length: 15 })}
            </Text>
            <Icon name={isOpen ? "c_up" : "c_down"} />
          </Flex>
        </MenuButton>

        <MenuList bg={"white"}>
          <MenuGroup>
            {/* Create a list of all Workspaces the user has access to */}
            {workspaces.map((workspace) => {
              return (
                <MenuItem
                  key={workspace._id}
                  onClick={() => setWorkspaceIdentifier(workspace._id)}
                >
                  <Text fontSize={"sm"} fontWeight={"semibold"}>
                    {workspace.name}
                  </Text>
                </MenuItem>
              );
            })}
          </MenuGroup>

          <MenuDivider />

          <MenuGroup>
            {/* Option to create a new Workspace */}
            <Flex
              direction={"row"}
              align={"center"}
              justify={"center"}
              gap={"2"}
              ml={"2"}
            >
              <Button
                size={"sm"}
                colorScheme={"green"}
                onClick={() => onCreateOpen()}
                leftIcon={<Icon size={"sm"} name={"add"} />}
              >
                Create a Workspace
              </Button>
            </Flex>
          </MenuGroup>
        </MenuList>
      </Menu>

      <Modal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        size={"full"}
        closeOnEsc={workspaceIdentifier !== ""}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={"2"}>
            <Flex align={"center"} gap={"2"} w={"100%"}>
              <Icon name={"workspace"} size={"md"} />
              <Heading size={"md"}>Create Workspace</Heading>
              <Spacer />
            </Flex>
          </ModalHeader>
          <ModalBody p={"2"}>
            <Flex gap={"2"} direction={"column"}>
              {workspaceIdentifier === "" && (
                <Text
                  fontSize={"sm"}
                  fontWeight={"semibold"}
                  color={"gray.400"}
                >
                  Before you can get started using Storacuity, you must be
                  invited as Collaborator on an existing Workspace or create a
                  new Workspace below.
                </Text>
              )}
              <Flex direction={"row"} gap={"2"}>
                <Flex gap={"2"}>
                  <FormControl>
                    <FormLabel>
                      <Text fontSize={"sm"}>Name</Text>
                    </FormLabel>
                    <Input size={"sm"} rounded={"md"} placeholder={"Name"} />
                  </FormControl>
                </Flex>
                <Flex gap={"2"}>
                  <FormControl>
                    <FormLabel>
                      <Text fontSize={"sm"}>Description</Text>
                    </FormLabel>
                    <Textarea
                      size={"sm"}
                      rounded={"md"}
                      placeholder={"Description"}
                    />
                  </FormControl>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter p={"2"}>
            {workspaceIdentifier === "" && (
              <Button size={"sm"} onClick={() => performLogout()}>
                Logout
              </Button>
            )}
            {workspaceIdentifier !== "" && (
              <Button
                size={"sm"}
                colorScheme={"red"}
                onClick={() => onCreateClose()}
              >
                Cancel
              </Button>
            )}
            <Spacer />
            <Button size={"sm"} colorScheme={"green"}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default WorkspaceSwitcher;
