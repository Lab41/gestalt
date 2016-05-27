#!/bin/bash

# serve documentation in http://127.0.0.1:8080 instead of port 8000
# port 8000 is used by the scaffold
# must be run where mkdocs.yml resides
mkdocs serve --dev-addr=127.0.0.1:8080
