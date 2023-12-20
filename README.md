# WILL BE REPLACED BY NEW

New toolbox repoository is here: https://github.com/AibelDevs/action-toolbox 

When all repositories have been moved to new toolbox this repo be set to readonly/made private




---

<br>
<br>
<br>

<br>
<br>
<br>

<br>
<br>
<br>



# web-action

Helper repo to release js projects & update test image in yaml.

Reusable actions does not support private repo yet, so this is the reason this is public

Project is build around setting main branch to only accept updated Pull Requests, and squash them. 
Where 1 pull request only have 1 fix or feat. It will never auto release anything, you create a PR to generate new release, or commit for temp `next` builds.

This is using [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) npm package for releases with changelog


<br>
<br>
<br>



## test_and_lint

On pull request to main this tries to run there if they exist:
* `npm run test`
* `npm run typecheck`
* `npm run eslint`
* and lint titles on pr, where it expects to find 
  * `fix: ...`
  * `feat: ...`
  * `fix!: ...`
  * `feat!: ...`

 > `!` if breaking fix/feature, need to be version  1 or higher for this to work. Also notice all have 1 space after `:`


[sample from e2e testing](https://github.com/Aibel365/web-e2e-test-action-toolbox/blob/main/.github/workflows/test_and_lint.yaml)
```yaml
name: TEST & LINT

on:
  pull_request:
    types: [opened, synchronize, edited]
    branches:
      - "main"

jobs:
  build:
    uses: Aibel365/web-action-toolbox/.github/workflows/test_and_lint.yaml@v1.0.0 # ⚠️ CHECK VERSION
    with:
      TOOLS_REPO: Aibel365/web-action-toolbox
      TOOLS_TAG: v1.0.0 # ⚠️ CHECK VERSION

```



<br>
<br>
<br>


## generate_test

This triggers if push commits contains `GENERATE_TEST` on all branches execept main. 
It will bump patch number and add next plus action jobid. 
So version `1.1.0` will get turned into `web-action:1.1.1-next.3543330598`.

This also updates yaml test image version in gitops repo.

[sample from e2e testing](https://github.com/Aibel365/web-e2e-test-action-toolbox/blob/main/.github/workflows/generate_test.yaml)
```yaml
name: GENERATE_TEST

on:
  push:
    branches:
      - '**'
      - "!main"

jobs:
  build:
    uses: Aibel365/web-action-toolbox/.github/workflows/generate_test.yaml@v1.0.0 # ⚠️ CHECK VERSION
    with:
      TOOLS_REPO: Aibel365/web-action-toolbox
      TOOLS_TAG: v1.0.0 # ⚠️ CHECK VERSION
      
      YAML_REPO: "Aibel365/web-e2e-test-action-toolbox-gitops"
      YAML_FILE_PATH: cluster_test/test.yaml
      YAML_OBJ_PATH_COMBINED: "1.spec.template.spec.containers.0.image"
      # or
      #YAML_OBJ_PATH_NAMEONLY: "1.spec.template.spec.containers.0.newName"
      #YAML_OBJ_PATH_VERSIONONLY: "1.spec.template.spec.containers.0.newTag"

      ACR_NAME: "[⚠️REPLACE_ME].azurecr.io"
      ACR_IMAGE_NAME: "[⚠️REPLACE_ME].azurecr.io/team-incubator/web-e2e-test-action-toolbox"
    secrets:
      SSH_PRIVATE_KEY_SOURCE: ${{ secrets.SSH_PRIVATE_KEY_SOURCE }}
      SSH_PRIVATE_KEY_GITOPS: ${{ secrets.SSH_PRIVATE_KEY_GITOPS }}
      
      CONTAINER_USERNAME: ${{ secrets.CONTAINER_USERNAME }}
      CONTAINER_PASSWORD: ${{ secrets.CONTAINER_PASSWORD }}

```

<br>
<br>
<br>

## generate_release

This triggers if push commits contains `GENERATE_RELEASE` on all branches execept main. You can force major and minor with `chore: GENERATE_RELEASE_MINOR` or `chore: GENERATE_RELEASE_MAJOR`

This also updates yaml test image version in gitops repo.

[sample from e2e testing](https://github.com/Aibel365/web-e2e-test-action-toolbox/blob/main/.github/workflows/generate_release.yaml)

```yaml
name: GENERATE_RELEASE

on:
  push:
    branches:
      - main

jobs:
  build:
    uses: Aibel365/web-action-toolbox/.github/workflows/generate_release.yaml@v1.0.0 # ⚠️ CHECK VERSION
    with:
      TOOLS_REPO: Aibel365/web-action-toolbox
      TOOLS_TAG: v1.0.0 # ⚠️ CHECK VERSION

      YAML_REPO: "Aibel365/web-e2e-test-action-toolbox-gitops"
      YAML_FILE_PATH: cluster_test/test.yaml
      YAML_OBJ_PATH_COMBINED: "1.spec.template.spec.containers.0.image"
      # or
      #YAML_OBJ_PATH_NAMEONLY: "1.spec.template.spec.containers.0.newName"
      #YAML_OBJ_PATH_VERSIONONLY: "1.spec.template.spec.containers.0.newTag"

      ACR_NAME: "[⚠️REPLACE_ME].azurecr.io"
      ACR_IMAGE_NAME: "[⚠️REPLACE_ME].azurecr.io/team-incubator/web-e2e-test-action-toolbox"
    secrets:
      SSH_PRIVATE_KEY_SOURCE: ${{ secrets.SSH_PRIVATE_KEY_SOURCE }}
      SSH_PRIVATE_KEY_GITOPS: ${{ secrets.SSH_PRIVATE_KEY_GITOPS }}

      CONTAINER_USERNAME: ${{ secrets.CONTAINER_USERNAME }}
      CONTAINER_PASSWORD: ${{ secrets.CONTAINER_PASSWORD }}
```


<br>
<br>
<br>



# To use in other repo

* add workflow you need, see docs in top of each one/this readme
* copy release.md
* add secrets to github
  * CONTAINER_USERNAME
  * CONTAINER_PASSWORD
  * SSH_PRIVATE_KEY_SOURCE (to you repo, with write privilige)
  * SSH_PRIVATE_KEY_GITOPS (to gitops repo, with write privilige)
  * update packagejson with property `"commit-and-tag-version": {` (see sample code under)
    * important to update urls...

> scripts assumes `main` branch is used on source/gitops

To generate key use console and write:
* `ssh-keygen -t ed25519 -C "firstname.lastname@aibel.com"`
  * give filename source/gitops etc
  * do not add password
  * pub content goes under deplay keys on github with write access
  * the file content without `pub` goes under you secret


Sample of what you packagejson needs for `commit-and-tag-version`

```json
{
  "name": "actiontest",
  "version": "0.0.1",
  "commit-and-tag-version": {
    "types": [
      {
        "type": "feat",
        "section": "Features"
      },
      {
        "type": "fix",
        "section": "Bug Fixes"
      },
      {
        "type": "chore",
        "hidden": true
      },
      {
        "type": "docs",
        "hidden": true
      },
      {
        "type": "style",
        "hidden": true
      },
      {
        "type": "refactor",
        "hidden": true
      },
      {
        "type": "perf",
        "hidden": true
      },
      {
        "type": "test",
        "hidden": true
      }
    ],
    "bumpFiles": [
      {
        "filename": "package.json",
        "type": "json"
      },
      {
        "filename": "package-lock.json",
        "type": "json"
      }
    ],
    "commitUrlFormat": "https://github.com/web-action-toolbox/commits/{{hash}}",
    "compareUrlFormat": "https://github.com/web-action-toolbox/compare/{{previousTag}}...{{currentTag}}"
  }
}
```


# todo:

Build with old script I used, built to solve a task there and then, not built for unit testing. 
Only run e2e with own test repo with its own gitops repo its dummy updating.

I need to consider making some unit tests later if I refactor scripts

