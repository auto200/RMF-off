const shell = require("shelljs");

shell.exec("npm install --only=prod");
shell.exec("mkdir tmp");
shell.exec("touch tmp/restart.txt");
