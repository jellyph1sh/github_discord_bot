import { Octokit } from "octokit";
import fs from 'fs';
import config from "./config_test.json" assert {type: 'json'};
import embed from './embed.js';

const octokit = new Octokit({ 
  auth: config.githubAPIToken,
});

const callGithubAPI = async (query, args) => {
    return await octokit.request(query, args);
}

const getBranches = async () => {
    const branchesData = await callGithubAPI('GET /repos/{owner}/{repo}/branches', {
        owner: "jellyph1sh",
        repo: "github_discord_bot"
    });

    return branchesData.data;
}

const sendGithubLog = (channel, commitData) => {
    channel.send({ embeds: [embed(`New Commit on ${commitData.branch}`, '#d3d3d3', commitData.message, commitData.author)] });
};

const GetDataByBranch = async (channel) => {
    const branches = await getBranches();
    
    let dbData = JSON.parse(fs.readFileSync('./database.json'));
    branches.forEach(async branch => {
        const commitData = await getLastCommitData(branch);
        if (commitData.id === dbData[branch.name]) return '';
        dbData[branch.name] = commitData.id;
        saveConfigFile(dbData);
        sendGithubLog(channel, commitData);
    });
}

const getLastCommitData = async (branchData) => {
    const commitData = await callGithubAPI('GET {url}', {url: branchData.commit.url});
    return {branch: branchData.name, id: commitData.data.node_id, message: commitData.data.commit.message, author: commitData.data.commit.author.name};
}

const saveConfigFile = (dbData) => {
    fs.writeFile('./database.json', JSON.stringify(dbData), (err) => {if (err) throw err});
}

export default GetDataByBranch;