"use strict";

var platform = require("os").platform;
var install_process = require("child_process");
var path = require('path');
var sudo = require('sudo-prompt');
var options = {
  name: 'Fuse Fonts Installer'
};

var errors = global.ErrorCodes;


class Installer {

  constructor(zxpPath) {
    
    this.zxpPath = zxpPath;

    var prefix = (platform() == "darwin") ? "--" : "/"
    this.installCommand = `${prefix}install`;
    this.uninstallCommand = `${prefix}uninstall`;
    this.target = this.targetPath();

    this.install = this.install.bind(this);
  }

  targetPath() {

    switch (platform()) {
      case "darwin":
        return "bin/OSX/Contents/MacOS/ExManCmd";
      case "win32":
        return "bin/WINDOWS/ExManCmd.exe";
      case "win64":
        return "bin/WINDOWS/ExManCmd.exe";
    }
    return null;
  }

  install() {
    const that = this;
    const successfulMessage = "Installation Successful";
    return new Promise(function (resolve, reject) {
      const command = [path.join(__dirname, that.target), that.installCommand, that.zxpPath].join(" ");
      
      sudo.exec(command, options, function(error, stdout, stderr) {
        
        console.log({stdout, stderr});
        if (error) {
          console.warn("error executing sudo");

          let message = error.message || "An unknown error occurred.";
          if (message.toLowerCase() === "user did not grant permission.") {
            message = message.replace("User", "You");
          }

          return reject(message);
        }

        if (stdout.includes(successfulMessage)) {
          return resolve();
        }

        reject(stderr || stdout);
      });

    });
  }

  uninstall() {
    throw new Error("Not Implemented");
  }

}

global.Installer = Installer;