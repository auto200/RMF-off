const shell = require("shelljs");

shell.exec("npm run build:client");
shell.rm("-rf", "build");
shell.mkdir("-p", "build");
shell.cp("./server/app.js", "./build");
shell.cp("./server/package.json", "./build");
shell.cp("./server/package-lock.json", "./build");
shell.cp("-R", "./client/build", "./build/public");
