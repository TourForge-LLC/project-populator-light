const { graphql } = require("@octokit/graphql");
require("dotenv").config();

const token = process.env.GH_TOKEN;
const org = "tourforge-executives";

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

async function bootstrap() {
  try {
    const { organization } = await graphqlWithAuth(
      `query($login: String!) {
        organization(login: $login) {
          id
        }
      }`,
      { login: org }
    );

    const orgId = organization.id;

    const result = await graphqlWithAuth(
      `mutation($orgId: ID!) {
        createProjectV2(input: {
          ownerId: $orgId,
          title: "Project Populator Board"
        }) {
          projectV2 {
            id
          }
        }
      }`,
      { orgId }
    );

    console.log("Created project board with ID:", result.createProjectV2.projectV2.id);
  } catch (error) {
    console.error("Error creating project board:", error.message);
  }
}

bootstrap();
