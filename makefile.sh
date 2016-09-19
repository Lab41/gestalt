#!/bin/bash
# build for Mac OS X

# -----------------------------------------------------------------------------
#   How to run makefile.sh
# -----------------------------------------------------------------------------

# 1. For first time user, do the entire build.
# >> source makefile.sh && build_all
# 
# 2. After running the entire build, run the tablet prototype.
# >> source makefile.sh && run_tablet
# 
# 3. After running the entire build, run the desktop prototype.
# >> source makefile.sh && run_desktop
# 
# 4. To clean cache, run
# >> source makefile.sh && clean
#
# Additional run commands:
# 1. Activate virtual environment gestalt_virtualenv
# >> activate
# 2. Deactivate virtual environment gestalt_virtualenv
# >> deactivate
# 3. Access local database 
# >> source makefile.sh && run_postgres

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
    echo 'export PIP_REQUIRE_VIRTUALENV=false' | tee -a ~/.bash_profile
    source ~/.bash_profile
}

function install_homebrew {
    which -s brew
    if [[ $? != 0 ]]; then
        echo ">> Install homebrew"
        ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
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

    echo ">> Install openssl"
    brew install openssl
    ln -s /usr/local/opt/openssl/lib/libssl.1.0.0.dylib /usr/local/lib
    ln -s /usr/local/opt/openssl/lib/libcrypto.1.0.0.dylib /usr/local/lib

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

# There are two ways to start postgresql as a service: homebrew and manually.
function start_service_postgres_with_homebrew {
    echo ">> Note: cannot run inside tmux"
    echo ">> Install homebrew's services"
    brew tap homebrew/services

    echo ">> Start postgreSQL as a background service"
    brew services start postgresql

    # stop: brew services stop postgresql
    # restart: brew services restart postgresql
}

function start_service_postgres {
    echo ">> Note: cannot run inside tmux"
    echo ">> Configure postgreSQL to start automatically"
    echo ">> 1. Create a LaunchAgents directory"
    mkdir -p ~/Library/LaunchAgents
    echo ">> 2. Create a symbolic link to postgreSQL's property list files"
    ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
    echo ">> 3. Load the plist into the launch control service"
    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
}

function initialize_postgres_db {
    echo ">> Initialize postgreSQL database at ${1}"
    postgres -D ${1}
}

function install_postgresql {
    postgres --version
    if [[ $? != 0 ]]; then
        echo ">> Install postgreSQL locally"
        brew install postgres
        start_service_postgres_with_homebrew
        initialize_postgres_db '/usr/local/var/postgres'
    else
        echo ">> Upgrade postgreSQL"
        brew upgrade postgres
    fi

    echo ">> Create default database called gestalt"
    createdb gestalt

    echo ">> Create default user with superuser privileges"
    echo ">> user: gestalt_user"
    echo ">> password: umami"
    psql -d gestalt -c "CREATE USER gestalt_user WITH SUPERUSER LOGIN PASSWORD 'umami';"

    echo ">> Install admin pack in case you wanted to use PgAdmin's UI"
    psql -d gestalt -c 'CREATE EXTENSION "adminpack";'
}

function populate_gestalt_db {
    if psql -lqt | cut -d \| -f 1 | grep -qw gestalt; then
        echo ">> Populate gestalt database"
        # temporary hack
        psql -d gestalt -U gestalt_user -f ./database/create_all.sql
        psql -d gestalt -U gestalt_user -f ~/gestalt_econ_data.sql
        #psql -d gestalt -U gestalt_user -f ./database/create_persona.sql
        #psql -d gestalt -U gestalt_user -f ./database/create_workspace.sql
        #psql -d gestalt -U gestalt_user -f ./database/create_panel.sql
        #psql -d gestalt -U gestalt_user -f ./database/create_story.sql
        #psql -d gestalt -U gestalt_user -f ./database/create_vis.sql
        #psql -d gestalt -U gestalt_user -f ./database/create_connectivity.sql
        #psql -d gestalt -U gestalt_user -f ./database/create_tag.sql
        #psql -d gestalt -U gestalt_user -f ./database/create_econ_data.sql
    else
        echo ">> Gestalt database does not exist. \
                 Please run 'createdb gestalt' or install_postgres first. EXITING!"
        exit 1
    fi
}

function run_postgres {
    # assuming you have run install_postgresql first
    psql -d gestalt -h 0.0.0.0
}

function set_env_var_postgres {
    if [ ${1} == "remote" ]; then
        # remote
        echo "What is the remote database's..."
        read -p 'name (i.e. postgres)? ' db_name
        read -p 'user (i.e. johndoe)? ' db_user
        read -p 'host (i.e. 0.0.0.0)? ' db_host
        read -p 'password? ' db_password
        read -p 'post (i.e. 5432)? ' db_port
    else
        # local
        db_name='gestalt'
        db_user='gestalt_user'
        db_host='0.0.0.0'
        db_password='umami'
        db_port='5432'
    fi

    echo ">> Set the postgresql environment variable in bash_profile"
    echo "export DATABASE_NAME=${db_name}" | tee -a ~/.bash_profile
    echo "export DATABASE_USER=${db_user}" | tee -a ~/.bash_profile
    echo "export DATABASE_HOST=${db_host}" | tee -a ~/.bash_profile
    echo "export DATABASE_PASSWORD=${db_password}" | tee -a ~/.bash_profile
    echo "export DATABASE_PORT=${db_port}" | tee -a ~/.bash_profile
    echo 'export DATABASE_URL=$DATABASE_NAME,$DATABASE_USER,$DATABASE_HOST,$DATABASE_PASSWORD,$DATABASE_PORT' | tee -a ~/.bash_profile
    source ~/.bash_profile

}

function setup_local_postgres {
    install_postgresql
    populate_gestalt_db
    set_env_var_postgres "local"
}

function setup_remote_postgres {
    set_env_var_postgres "remote"
}

function setup_db {
    while true; do
        read -p "Are you using local database? Yes for local. No for server. Default is local." yn
        case $yn in
            [Yy]* ) echo ">> Use local postgreSQL."; setup_local_postgres; break;;
            [Nn]* ) echo ">> Use remote postgreSQL."; setup_remote_postgres; break;;
            * ) echo ">> Default to use local postgreSQL."; setup_local_postgres; break;;
        esac
    done
}

# -----------------------------------------------------------------------------
#   Start le installation!
# -----------------------------------------------------------------------------

# Run: source makefile.sh && build_all
function build_all {
    setup_bash_profile
    install_homebrew
    install_virtualenv
    activate_virtualenv
    install_global_dependencies
    install_tablet_dependencies
    install_desktop_dependencies
    setup_db

    # return to base directory
    cd ${BASE_DIR}
}

# Run: source makefile.sh && run_tablet
function run_tablet {
    is_envvar_set DATABASE_URL
    activate_virtualenv
    echo ">> Start tablet prototype"
    echo ">> Please browse to http://0.0.0.0:8000"
    cd ${TABLET_DIR} && node app.js

    # return to base directory
    cd ${BASE_DIR}
}

# Run: source makefile.sh && run_desktop
function run_desktop {
    is_envvar_set DATABASE_URL
    activate_virtualenv
    echo ">> Start desktop prototype"
    echo ">> Please browse to http://0.0.0.0:8000"
    cd ${DESKTOP_DIR} && python ${DESKTOP_DIR}/app.py

    # return to base directory
    cd ${BASE_DIR}
}

# Run: source makefile.sh && clean
function clean {
    activate_virtualenv
    npm cache clean
}
