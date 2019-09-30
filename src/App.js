import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import github from "./github.png";
import search from "./search.png";
import request from "./request";

const GlobalStyle = createGlobalStyle`
  ${reset}
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  a {
    color: initial;
    text-decoration: none;
  }
  body {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-family: "Avenir Next", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background-color: #282c34;
  }
`;

function App() {
  const [keyword, setKeyword] = useState("");
  const [repositories, setRepositories] = useState([]);
  return (
    <div>
      <GlobalStyle />
      <Container>
        <Logo src={github} alt="logo" />
        <SearchForm
          onSubmit={async e => {
            e.preventDefault();
            const {
              search: { nodes: repositoriesData }
            } = await request(
              `
              query($keyword: String!) {
                search(query: $keyword, type: REPOSITORY, first: 10) {
                  nodes {
                    ... on Repository {
                      name
                      description
                      url
                      id
                    }
                  }
                }
              }            
            `,
              {
                keyword
              }
            );
            setRepositories(repositoriesData);
          }}
        >
          <SearchInput
            type="keyword"
            value={keyword}
            onChange={e => {
              setKeyword(e.currentTarget.value);
            }}
          />
          <SearchButton type="button">
            <SearchIcon src={search} alt="logo" />
          </SearchButton>
        </SearchForm>
        {repositories.length && (
          <RepositoryList>
            {repositories.map(repository => (
              <RepositoryListItem key={repository.id}>
                <Repository>
                  <RepositoryLink href={repository.url} target="_blank">
                    <RepositoryName>{repository.name}</RepositoryName>
                    <RepositoryDescription>
                      {repository.description}
                    </RepositoryDescription>
                  </RepositoryLink>
                </Repository>
              </RepositoryListItem>
            ))}
          </RepositoryList>
        )}
      </Container>
    </div>
  );
}

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 468px;
`;
const Logo = styled.img`
  display: block;
  margin: 0 auto 40px;
  width: 96px;
`;
const SearchForm = styled.form`
  display: flex;
`;
const SearchInput = styled.input`
  padding: 0 10px;
  height: 40px;
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  border: none;
  background-color: white;
  -webkit-appearance: none;
`;
const SearchButton = styled.button`
  padding: 0;
  width: 40px;
  height: 40px;
  border: none;
  border-left: 1px #282c34 solid;
  cursor: pointer;
  background-color: white;
  -webkit-appearance: none;
`;
const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const RepositoryList = styled.ul``;
const RepositoryListItem = styled.li`
  padding: 20px 0;
  &:not(:first-child) {
    border-top: 1px #fff dashed;
  }
`;
const Repository = styled.div``;
const RepositoryLink = styled.a``;
const RepositoryName = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: white;
`;
const RepositoryDescription = styled.p`
  margin-top: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  line-height: 1.5;
`;

export default App;
