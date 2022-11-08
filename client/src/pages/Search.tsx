// React and Grommet
import React, { useState } from "react";
import {
  Anchor,
  Box,
  Button,
  Form,
  Heading,
  PageHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
  TextInput,
} from "grommet/components";
import { Page, PageContent } from "grommet";
import { LinkNext, Search as SearchIcon } from "grommet-icons";

// Navigation
import { useNavigate } from "react-router-dom";

// Database and models
import { getData } from "src/lib/database/getData";
import { EntityModel } from "types";

// Custom components
import ErrorLayer from "../components/ErrorLayer";

const Search = () => {
  const [query, setQuery] = useState("");

  // Search status
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  // Store results as a set of IDs
  const [results, setResults] = useState([] as EntityModel[]);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error has occurred.");

  const runSearch = () => {
    // Update state
    setIsSearching(true);
    setHasSearched(true);

    const data = getData(`/search/${query}`);

    // Handle the response from the database
    data.then((value) => {
      setResults(value);
      setIsSearching(false);

      // Check the contents of the response
      if (value["error"] !== undefined) {
        setErrorMessage(value["error"]);
        setIsError(true);
      }
    });
  };

  return (
    <Page kind="wide" pad={{left: "small", right: "small"}}>
      <PageContent>
        <PageHeader
          title="Search"
          subtitle="Search across the entire database system."
          parent={<Anchor label="Home" href="/" />}
        />

        <Form onSubmit={() => runSearch()}>
          <Box direction="row" align="center" gap="small">
            <TextInput
              value={query}
              placeholder="Enter search query..."
              onChange={(event) => setQuery(event.target.value)}
            />

            <Button
              primary
              icon={<SearchIcon />}
              label="Search"
              disabled={query === ""}
              onClick={() => runSearch()}
            />
          </Box>
        </Form>

        <Heading level="3">Search Results{hasSearched && " (" + results.length + ")"}</Heading>

        <Box gap="small">
          {isSearching ? (
            <Box direction="row" align="center" justify="center" gap="small">
              <Spinner size="large" />
            </Box>
          ) : hasSearched ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell scope="col" border="bottom" align="center">
                    Identifier
                  </TableCell>
                  <TableCell scope="col" border="bottom" align="center">
                    Created
                  </TableCell>
                  <TableCell scope="col" border="bottom" align="center">
                    Owner
                  </TableCell>
                  <TableCell scope="col" border="bottom" align="center"></TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {results.length > 0 && (
                  results.map((result) => {
                    return (
                      <TableRow key={result._id}>
                        <TableCell scope="row" border="right" align="center">
                          <strong>{result.name}</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>
                            {new Date(result.created).toDateString()}
                          </strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>{result.owner}</strong>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            color="accent-4"
                            label="View"
                            icon={<LinkNext />}
                            onClick={() => navigate(`/entities/${result._id}`)}
                            primary
                            reverse
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          ) : (
            <Text>Search results will appear here.</Text>
          )}
        </Box>

        {/* Error component */}
        {isError && <ErrorLayer message={errorMessage} />}
      </PageContent>
    </Page>
  );
};

export default Search;
