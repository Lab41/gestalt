# Gestalt
This challenge will employ various data visualization tools and user experience frameworks to construct cohesive data stories focused on communicating ripple-effect scenarios.

## Documentation

Please check out our documentation at https://lab41.github.io/gestalt.

You can also run it locally on your computer. We use MkDocs for our documentation, so to run it, you can follow the instructions below: 
  1. Download our GitHub repo: `git clone https://github.com/Lab41/gestalt.git`
  2. Go to our docs directory: `cd gestalt/docs`
  3. Install MkDocs: `scripts/setup_mkdocs.sh` or `pip install mkdocs`
  4. Serve the documents up locally: `scripts/run_mkdocs.sh` or `mkdocs serve --dev-addr=127.0.0.1:8080`. 
     Please be aware that the scaffolded apps already use 127.0.0.1:8000.
  5. Submit your change to the GitHub repo: `scripts/github_mkdocs.sh` or `mkdocs gh-deploy --clean`
  6. Please do not forget to push the changes from your local branch gh-pages to Lab41's remote branch gh-pages.

## Quickstart

We currently have implemented only the tablet prototype. 

```
cd gestalt/prototypes/tablet
node app.js
```
