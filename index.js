const { execSync } = require('child_process');
const fs = require('fs');
const temp = require('temp').track();
const path = require('path');
const commander = require('commander');
const packagejson = require('./package.json');
const GitHub = require('github-api');

const program = new commander.Command();

program.version(packagejson.version);

program.name(packagejson.name);

program
    .command('update <repoUrl>')
    .description('update the repo at this address')
    .option('--version-file <path>', 'file to look in for current version', 'VERSION')
    .option('--config-file <path>', 'file to look in for config', 'ibau_config.json')
    .option('--pull-request', 'Make a pull request with the change. The username/reponame will be determined from the clone URL. (Only for GitHub repos)')
    .option('--pull-request-notify <user>', 'User to CC in change PRs. Ignored unless --pull-request is also provided. (Example: @gary-kim)')
    .action(update);

program.parse(process.argv);

var repoCounter = 0;

function update(repoUrl, cmd) {
    let repo = getRepo(repoUrl);
    const versionFile = path.join(repo, cmd.versionFile);
    let repoConfig = JSON.parse(fs.readFileSync(path.join(repo, cmd.configFile)));
    let currentVersion = fs.readFileSync(versionFile).toString().trim();
    let toUpdateTo = latestVersion(repoConfig.upstreamRepoUrl);
    console.log(`Found ${currentVersion} in build repo and ${toUpdateTo} in upstream repo`);
    if (currentVersion === toUpdateTo) {
        console.log(`No update required, exiting`);
        return;
    }
    let newBranch = "master";
    if (cmd.pullRequest) {
        newBranch = `bot/auto-update/${currentVersion}-${toUpdateTo}`;
        if (execSync(`git branch --list ${newBranch}`, {cwd: repo}).includes(newBranch)) {
            console.log(`Found an already existing branch with this update, exiting`);
            return;
        }
        execSync(`git checkout -b ${newBranch}`, {cwd: repo});
    }
    console.log(`Making a commit to update to ${toUpdateTo}`);
    fs.writeFileSync(versionFile, toUpdateTo);
    execSync(`git commit -am "auto: Update to ${toUpdateTo}"`, {cwd: repo});
    execSync(`git push origin ${newBranch}`, {cwd: repo});
    if (cmd.pullRequest) {
        let gh = new GitHub({
            username: process.env.GIT_USERNAME,
            password: process.env.GIT_PASSWORD
        });
        let cloneUrlParts = repoUrl.replace(/.git$/, "").split("/");
        const repoUser = cloneUrlParts[cloneUrlParts.length - 2];
        const repoName = cloneUrlParts[cloneUrlParts.length - 1];
        let ghRepo = gh.getRepo(repoUser, repoName);
        let prOptions = {
            title: `Update version to ${toUpdateTo}`,
            head: newBranch,
            base: `master`,
            body: `Update version to ${toUpdateTo}`,
            maintainer_can_modify: true
        };
        if (cmd.pullRequestNotify) {
            prOptions.body += '\n\nCC ' + cmd.pullRequestNotify;
        }
        ghRepo.createPullRequest(prOptions);
    }
}

function getRepo(repoUrl) {
    let dir = temp.mkdirSync(repoCounter++);
    execSync(`git -c "credential.helper=/bin/bash ${path.join(__dirname, "gitcredentials.sh")}" clone --recursive ${repoUrl} ./`, {cwd: dir});
    execSync(`git config credential.helper '/bin/bash ${path.join(__dirname, "gitcredentials.sh")}'`, {cwd: dir})
    return dir;
}

function latestVersion(repoUrl) {
    let dir = getRepo(repoUrl);
    return execSync(`git describe --tags --abbrev=0`, {cwd: dir}).toString().trim();
}
