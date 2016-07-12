---
title: Documentation
keywords: documentation
last_updated: July 18, 2016
tags: [documentations]
sidebar: mydoc_sidebar
permalink: mydoc_documentation.html
folder: mydoc
---

## About the Documentation

We use Jekyll as our documentation as it provides us greater flexibility. 
Jekyll gives you the option to write your documentation in either 
Markdown or HTML.

We are fortunate to stumble upon Tom Johnson's theme. Please feel free to check out [his blog's about page](http://idratherbewriting.com/aboutme/) to learn more about him. 

## Layout of the Documentation

Please read [Jekyll Documentation Theme](http://idratherbewriting.com/documentation-theme-jekyll/index.html) 
for a more detailed insight to the documentation layout.

### Main Documentation

The main documentation can be found in `<gestalt directory>/docs/pages/mydoc`. 

Adding or updating a main documentation page means you have to make updates to
the side menu at `<gestalt directory>/docs/_data/sidebars/mydoc_sidebar.yml`.


### Tags

You can add new tags in the main documentation by:

1. Adding the tag in `<gestalt directory>/docs/_data/tags.yml`.
2. Creating a tag webpage in `<gestalt directory>/pages/tags`.

### Updates

You can notify updates by adding a file in `<gestalt directory>/docs/_posts.'
The file has to be in the format of yyyy-mm-dd-name_of_file.md.

### Reading Groups

The reading group documentation can be found in `<gestalt directory>/docs/pages/readings`.

Adding or updating a reading group documentation page means you have to make updates to
the side menu at `<gestalt directory>/docs/_data/sidebars/readings_sidebar.yml`.

## Formatting the Documentation

Please read [Jekyll Documentation Theme](http://idratherbewriting.com/documentation-theme-jekyll/mydoc_adding_tooltips.html) as it has great insight to formatting the documentation.

## Running the Documentation Locally

Once you have cloned the Gestalt project locally to your computer, 
you can run the Gestalt documentation locally as well. We have 
written a script to expedite the process. You can either run the 
script `<gestalt directory>/docs/scripts/localrun.sh` or you can 
run the instructions manually as follows:

```
bundle exec jekyll build --trace
bundle exec jekyll serve --baseurl '' --watch --incremental
```

## Submitting the Changes to GitHub

After you made changes to the documentation, you can submit them
to GitHub by running our script 
`<gestalt directory>/docs/scripts/create-ghpages.sh` or you can
run it manually as follows:

```
bundle exec rake publish
```

The script will create a local branch called gh-pages. You still
need to submit those changes to Gestalt by pushing the changes to
your remote fork's branch and creating a pull request to Gestalt.
Please submit gh-pages as well as the branch where you have
made updates to the docs directory.

{% include links.html %}
