name: update v3 branch on next changes

on:
push:
branches: - next

jobs:
update-v3:
runs-on: ubuntu-latest
steps: - uses: actions/checkout@v4
with:
ref: v3
fetch-depth: 0

      - name: set user, merge origin/next into v3
        run: |
          git config user.name "carbon-bot"
          git config user.email "carbon@us.ibm.com"
          git merge origin/next

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v4
        with:
          branch: v3-upgrade
          title: '[v3] Automated merge next into v3-upgrade'
          body: |
            ### Automatic merge of next into v3-upgrade
            This pr is opened automatically by github actions when there are no merge conflicts
            between `next` and `v3`. If there are merge conflicts, this action will fail to automatically
            create this PR and the conflicts will need to be fixed and merged manually.
