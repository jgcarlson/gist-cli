# GistCLI
### A CLI for [gist.github.com](https://gist.github.com/).

**IMPORTANT NOTE**: I recommend that people **DO NOT** use this project. It's convenient for me, but the access token is not stored securely.

## What?
Once you link up your Github account with an access token, you can save and find your gists via the command line.
For example, `gist create example.js "An example JS snippet." "const a = b + c;"`. Pretty self-explanatory.
You can also find gists. `gist find css` returns a gist that matches the query (if there's only one match) or a list of selectable gists descriptions (if there's more than one gist that matches the query).
Use `gist --help` to see all options.

## Why?
1. Because I like gists and CLIs.
2. Using the gist.github.com web interface is too slow.
3. Because I didn't really like any other gist CLIs that I found.

## Legal Stuff
[MIT](https://github.com/jgcarlson/gist-cli/blob/master/LICENSE) because why not.
