# Image Build Autoupdater

A script to update build repos.

### Usage

Set up a repo to use CI to build and release images. Set it up in such a way that there is a single file, preferably named `VERSION` (this is configurable) that contains the git tag or revision of the version that will be built.

In the repo, create a file called `ibau_config.json` and put in the following contents:
```json
{
  "upstreamRepoUrl": "<url of upstream repo>",
  "pullRequest": true,
  "pullRequestNotify": "@gary-kim",
  "useHashes": false,
  "allBranches": false,
  "suppressScriptLink": false,
  "commitMessageBody": "Signed-off-by: Gary Kim Bot <bot@garykim.dev>"
}
```

For login credentials, provide `GIT_USERNAME` and `GIT_PASSWORD` environment variables. 

You must also set the `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME`, and `GIT_COMMITTER_EMAIL` for commit author/committer info.

Then run with `npm start -- <url of build repo>`.

Take a look at `npm start -- --help` for more info.

There is also a work in progress Go version in the `go` branch.

### LICENSE

Copyright &copy; 2020 Gary Kim &lt;<gary@garykim.dev>&gt;

Licensed under [AGPL-3.0-or-later](LICENSE)

