require('dotenv').config();
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

async function createProjectBoard() {
  try {
    const org = process.env.ORG;
    const projectName = process.env.PROJECT_NAME;

    const { data: project } = await octokit.rest.projects.createForOrg({
      org,
      name: projectName,
      body: "Auto-created by Alden AI to manage all modules."
    });

    const projectId = project.id;

    const columns = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];
    for (const name of columns) {
      await octokit.rest.projects.createColumn({
        project_id: projectId,
        name
      });
    }

    console.log(`Project "${projectName}" created with columns.`);
  } catch (err) {
    console.error('Error creating project:', err.message);
  }
}
createProjectBoard();
