#!/bin/bash
# build for Mac OS X

# -----------------------------------------------------------------------------
#   How to run makefile.sh
# -----------------------------------------------------------------------------

# 1. For first time user, do the entire build.
# >> source makefile.sh && build_all
# 
# 2. After running the entire build, run the tablet prototype with local postgresql.
# >> source makefile.sh && run_local_tablet
# 
# 3. After running the entire build, run the desktop prototype with local postgresql.
# >> source makefile.sh && run_local_desktop
# 
# 4. After running the entire build, run the tablet prototype with postgresql 
# located in the server. Remember to set the environment variable DATABASE_URL.
# >> export DATABASE_URL=$DATABASE_NAME,$DATABASE_USER,$DATABASE_HOST,$DATABASE_PASSWORD,$DATABASE_PORT
# >> source makefile.sh && run_tablet
# 
# 5. After running the entire build, run the desktop prototype with postgresql
# located in the server. Remember to set the environment variable DATABASE_URL.
# >> export DATABASE_URL=$DATABASE_NAME,$DATABASE_USER,$DATABASE_HOST,$DATABASE_PASSWORD,$DATABASE_PORT
# >> source makefile.sh && run_desktop
# 
# 6. To clean cache, run
# >> source makefile.sh && clean
#
# Additional run commands:
# 1. Activate virtual environment gestalt_virtualenv
# >> activate
# 2. Deactivate virtual environment gestalt_virtualenv
# >> deactivate

# -----------------------------------------------------------------------------
#   Directories
# -----------------------------------------------------------------------------

# assuming that makefile.sh is run where it is located
BASE_DIR="$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)"
TABLET_DIR=${BASE_DIR}/prototypes/tablet
DESKTOP_DIR=${BASE_DIR}/prototypes/desktop

# -----------------------------------------------------------------------------
#   Functions
# -----------------------------------------------------------------------------

function setup_bash_profile {
    echo ">> Update bash_profile"
    # ensure user-installed binaries take precedence
    echo 'export PATH=/usr/local/bin:$PATH' | tee -a ~/.bash_profile
    # pip should only run if there is a virtualenv currently activated
    echo 'export PIP_REQUIRE_VIRTUALENV=true' | tee -a ~/.bash_profile
    source ~/.bash_profile
}

function install_homebrew {
    which -s brew
    if [[ $? != 0 ]]; then
        echo ">> Install homebrew"
		sudo ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	else
		echo ">> Update homebrew"
		brew update
    fi
}

function install_python {
    which -s python
    if [[ $? != 0 ]]; then
        echo ">> Install python 2.x"
        brew install python
        echo ">> Install python 3.x"
        brew install python3
    fi
}

function install_virtualenv {
    echo ">> Install virtualenv"
    pip install virtualenv 

    echo ">> Create a python 2.x virtualenv for gestalt called gestalt_virtualenv"
    virtualenv gestalt_virtualenv --distribute

    # you do not need virtualenvwrapper if you create a virtualenv within the project
}

alias activate="source gestalt_virtualenv/bin/activate"

function activate_virtualenv {
    echo ">> Activate virtual environment gestalt_virtualenv"
    activate
}

function install_global_dependencies {

    # node installed here because every module requires npm
    node --version 
    if [[ $? != 0 ]]; then 
        echo ">> Install node (and npm)" # as tablet prototype's back-end
        brew install node
    else
        echo ">> Upgrade node"
        brew upgrade node
    fi

    echo ">> Upgrade npm" 
    npm install --global npm --save 

    echo ">> Install psycopg2"
    pip install psycopg2

    echo ">> Install errno"
    npm install --global errno

    echo ">> Install grunt" 
    echo ">> Install karma and grunt-karma for testing"
    # grunt and karma must be installed at the same time as grunt-karma or receive a warning
    npm install --global grunt karma grunt-karma --save-dev
    npm install --global grunt-cli --save-dev
    npm install --global grunt-contrib-imagemin --save-dev

    echo ">> Install yeoman" # used in scaffolding
    echo ">> Ignore warning because the latest npm is already installed"
    npm install --global npm --save-dev
    npm install --global yo --save-dev

    echo ">> Install bower" # used in scaffolding
    npm install --global bower --save-dev
}

function install_tablet_dependencies {
    
    echo ">> Install AngularJS 1.0" # as tablet prototype's front-end
    cd ${TABLET_DIR} && npm install angular --save 

    echo ">> Install pg, postgreSQL client for node" 
    cd ${TABLET_DIR} && npm install pg --save

    echo ">> Install express" 
    cd ${TABLET_DIR} && npm install express --save

    echo ">> Install body-parser" 
    cd ${TABLET_DIR} && npm install body-parser --save
}

function install_desktop_dependencies {

    echo ">> Install web.py" # as desktop prototype's back-end
    easy_install web.py

    echo ">> Install AngularJS 1.0" # as desktop prototype's front-end
    cd ${DESKTOP_DIR} && npm install angular --save 
}

function is_envvar_set {
    echo ">> Verify ${1} is set"
    if [[ -n ${!1} ]]; then
        echo ">> ${1} is set"
    else
        echo ">> ${1} is NOT set...EXITING!"
        exit 1
    fi
}

# -----------------------------------------------------------------------------
#   Start le installation!
# -----------------------------------------------------------------------------

# Run: source makefile.sh && build_all
function build_all {
    setup_bash_profile
    install_homebrew
    install_virtualen
    activate_virtualenv
    install_global_dependencies
    install_tablet_dependencies
    install_desktop_dependencies

    # return to base directory
    cd ${BASE_DIR}
}

# Run: source makefile.sh && run_tablet
function run_tablet {
    is_envvar_set DATABASE_URL
    activate_virtualenv
    echo ">> Start tablet prototype"
    echo ">> Please browse to http://127.0.0.1:8001"
    cd ${TABLET_DIR} && node app.js

    # return to base directory
    cd ${BASE_DIR}

}

# Run: source makefile.sh && run_desktop
function run_desktop {
    is_envvar_set DATABASE_URL
    activate_virtualenv
    echo ">> Start desktop prototype"
    echo ">> Please browse to http://127.0.0.1:8000"
    cd ${DESKTOP_DIR} && python ${DESKTOP_DIR}/app.py

    # return to base directory
    cd ${BASE_DIR}
}

# Run: source makefile.sh && clean
function clean {
    activate_virtualenv
    npm cache clean
}
