# web-action

> not ready for prod

> reusable does not support private repo, this is why this is public

Helper repo to release js projects

This is build around setting main branch to only accept updated Pull Requests, and squash them. Where 1 pull request only have 1 fix or feat. It will never auto release anything, you create a PR to generate new release, or commit for temp `next` builds

> scripts assumes `main` branch is used on source/gitops

Using [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) npm package for releases with changelog


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

<br>
<br>
<br>


## generate_test

This triggers if push commits contains `GENERATE_TEST` on all branches execept main. 
It will bump patch number and add next plus action jobid. 
So version `1.1.0` will get turned into `web-action:1.1.1-next.3543330598`.

This also updates yaml test image version in gitops repo.


<br>
<br>
<br>

## generate_release

This triggers if push commits contains `GENERATE_RELEASE` on all branches execept main. You can force major and minor with `chore: GENERATE_RELEASE_MINOR` or `chore: GENERATE_RELEASE_MAJOR`

This also updates yaml test image version in gitops repo.


<br>
<br>
<br>



# To use in other repo

* add workflow you need, see docs in top of each one
* copy release.md
* add secrets to github
  * CONTAINER_USERNAME
  * CONTAINER_PASSWORD
  * SSH_PRIVATE_KEY_SOURCE (to you repo, with write privilige)
  * SSH_PRIVATE_KEY_GITOPS (to gitops repo, with write privilige)
  * update packagejson with property `"commit-and-tag-version": {` (see sample code under)
    * important to update urls...


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
    "commitUrlFormat": "https://github.com/web-action-tool/commits/{{hash}}",
    "compareUrlFormat": "https://github.com/web-action-tool/compare/{{previousTag}}...{{currentTag}}"
  }
}
```


# todo:

build with old script I used, built to solve a task there and then, not built for testing. So I could consider refactorig them a little so some of them are testable