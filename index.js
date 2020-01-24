const { execSync } = require('child_process');
const fs = require('fs');
const temp = require('temp').track();
const path = require('path');
const commander = require('commander');
const packagejson = require('./package.json');

const program = new commander.Command();

program.version(packagejson.version);

program.name(packagejson.name);

program
    .command('update <repoUrl>')
    .description('update the repo at this address')
    .option('--version-file <path>', 'file to look in for current version', 'VERSION')
    .option('--config-file <path>', 'file to look in for config', 'ibau_config.json')
    .action(update);

program.parse(process.argv)

var repoCounter = 0;

function update(repoUrl, cmd) {
    let repo = getRepo(repoUrl);
    const versionFile = path.join(repo, cmd.versionFile);
    let repoConfig = JSON.parse(fs.readFileSync(path.join(repo, cmd.configFile)));
    let currentVersion = fs.readFileSync(versionFile).toString().trim();
    let toUpdateTo = latestVersion(repoConfig.upstreamRepoUrl);
    console.log(`Found ${currentVersion} in build repo and ${toUpdateTo} in upstream repo`);
    if (currentVersion === toUpdateTo) {
        return;
    }
    fs.writeFileSync(versionFile, toUpdateTo);
    execSync(`git commit -am "auto: Update to ${toUpdateTo}"`, {cwd: repo});
    execSync(`git push`, {cwd: repo});
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
