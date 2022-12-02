## helper to generate release

By making edits on this you can create PR on github.

And by adding "GENERATE_RELEASE" in title, github action will make new release, like this:
* `chore: GENERATE_RELEASE`

To force MINOR or MAJOR, add it to the end like this 
* `chore: GENERATE_RELEASE_MINOR`
* `chore: GENERATE_RELEASE_MAJOR`

For new test build use helper script on you branch or commit empty commit with `chore: GENERATE_TEST`
* `npm run generate_test` or `git commit --allow-empty -m "chore: GENERATE_TEST" && git push`


* DD.MM.YYYY - WHY YOU DO THE RELEASE  (just clear it if it gets to long)
