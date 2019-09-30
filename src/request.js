import graphql from "@octokit/graphql";

const request = (query, params = {}) => {
  return graphql(query, {
    ...params,
    headers: {
      authorization: `Bearer ${process.env.PRIVATE_ACCESS_TOKEN}`
    }
  });
};

export default request;
