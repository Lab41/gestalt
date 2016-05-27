We use [Yeoman](http://yeoman.io/ "Yeoman.io") to scaffold modern web applications. 
Using Yeoman, we will create a set of custom generators built for the 
[Lab41 Gestalt Challenge](http://www.lab41.org/work/ "Lab41 Work").

# Install dependencies
We have written a script called install-dependencies.sh to install dependencies on 
your behalf. You have to specify the operating system where you will run the script. 
The example below is for Mac OS.  Please replace "mac" to "windows" for Windows or 
"ubuntu" for Ubuntu. 

Currently we have only implmented the script for Mac OS.

```
git clone https://github.com/Lab41/gestalt.git
./gestalt/scripts/mac/install-dependencies.sh
```

# Install gestalt generators
```
cd gestalt/scaffolds/generator-gestalt

/* this makes the generator globally available */
sudo npm link
```
