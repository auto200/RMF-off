const shell = require("shelljs");

shell.exec("npm run build:client");
shell.exec("npm run build:server");
shell.rm("-rf", "build");
shell.mkdir("-p", "build");
shell.cp("-R", "./server/build/*", "./build");
shell.cp("./server/package.json", "./build");
shell.cp("-R", "./client/build", "./build/public");
