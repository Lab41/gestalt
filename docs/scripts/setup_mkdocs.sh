#!/bin/bash

# Tested on Mac 
# Assume you have brew installed

# install python and pip
is_python_installed=`python -c 'import sys; print sys.version_info'`
if $is_python_installed -eq 0; then 
    brew install python
fi

# install mkdocs
pip install mkdocs
