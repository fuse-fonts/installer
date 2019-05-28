"use strict";

const { shell, remote } = require('electron')

/** View
 * Controls our visual state
 * Note all top level scripts are added to the global scope
 */
class View {
  
  constructor(settings) {

    this.settings = settings;
    this.zxpPath = settings.zxpPath;

    this.installer = new Installer(settings);

    // ui
    this.$appTitle = document.querySelector(".title");
    this.$appVersion = document.querySelector(".version");

    this.$progressBar = document.querySelector(".progress-bar");
    this.$progressTrack = document.querySelector(".progress-track");

    this.$installBtn = document.querySelector(".install");
    this.$uninstallBtn = document.querySelector(".uninstall");
    this.$exitBtns = document.querySelectorAll(".exit");
    // this.$cancelBtn = document.querySelector(".cancel");

    this.$appTitle.innerText = settings.productName;
    this.$appVersion.innerText = `v${settings.version || "1.0"}`;

    // update places in the app where we expect the name of our extension
    this.$appName = Array.prototype.forEach.call(document.querySelectorAll(".app-name"), (function(el){
      el.innerText = settings.productName;
    }));

    // event listeners
    this.$installBtn.addEventListener("click", this.installClicked.bind(this));
    this.$uninstallBtn.addEventListener("click", this.uninstallClicked.bind(this));
    
    // add event lsiteners to all .exit elements
    const exitApp = this.cancelClicked.bind(this);
    Array.prototype.forEach.call(this.$exitBtns, function(node){
      node.addEventListener("click", exitApp);
      node.attributes.removeNamedItem("disabled");
    });

    // remove disabled from the first two options
    this.$installBtn.attributes.removeNamedItem("disabled");
    this.$uninstallBtn.attributes.removeNamedItem("disabled");


    // support url of errors view
    document.querySelector(".support-url").addEventListener("click", this.supportURLClicked.bind(this));

    // learn more button
    document.querySelector(".learn-more").addEventListener("click", this.learnMoreClicked.bind(this))


    this.$carousel = document.querySelector(".carousel");

    this.views = {
      $loading:     document.querySelector(".view.view--loading"),
      $install:     document.querySelector(".view.view--install"),
      $uninstall:   document.querySelector(".view.view--uninstall"),
      $working:  document.querySelector(".view.view--working"),
      $error:       document.querySelector(".view.view--errors"),
      $complete:    document.querySelector(".view.view--complete")
    };

    this.activeClassName = "view--active";
    this.$activeView = document.querySelector(`.${this.activeClassName}`);
  }

  changeView($ref) {
    this.$activeView.classList.remove(this.activeClassName);
    $ref.classList.add(this.activeClassName);
    this.$activeView = $ref;
  }

  /** Checks if the extension is installed or not. 
   * if it is, it will display the uninstall view, otherwise it will display the install view
   */
  prepareInitialView() {
    this.checkIfExtensionIsInstalled()
      .then(status => {
        if (status.extensionInstalled) {
          this.changeView(this.views.$uninstall);
        }
        else {
          this.changeView(this.views.$install);
        }
      })
  }

  /**
   * Begins installing the extension by using the installer class
   */
  installExtension() {
    return this.installer.install()
      .then(message => this.changeView(this.views.$complete), this.failed.bind(this));
  }

  uninstallExtension() {
    return this.installer.uninstall()
      .then(() => this.changeView(this.views.$complete), this.failed.bind(this))
  }

  /** 
   * Checks if the extension is installed
   */
  checkIfExtensionIsInstalled() {
    return this.installer.checkStatus();
  }

  failed(error) {
    
    const $errorsView = this.views.$error;

    if (this.settings.learnMoreURL) {
      this.$carousel.style.display = "none";
    }

    this.changeView($errorsView);

    // update the text with the error message
    $errorsView.querySelector(".message").innerText = error;


    console.warn(error);
    if (this.settings.supportURL) {
      $errorsView.querySelector(".support").style.display = null;
    }
  }

  closeApp() {
    var window = remote.getCurrentWindow();
    window.close();
  }

  cancelClicked() {
    this.closeApp();
  }

  supportURLClicked() {
    shell.openExternal(this.settings.supportURL);
  }

  learnMoreClicked() {
    shell.openExternal(this.settings.learnMoreURL);
  }

  uninstallClicked() {
    this.views.$working.querySelector("h1").innerText = "Uninstalling...";
    this.changeView(this.views.$working);
    this.uninstallExtension();
  }

  installClicked() {
    this.views.$working.querySelector("h1").innerText = "Installing...";
    this.changeView(this.views.$working);
    if (this.settings.learnMoreURL) {
      this.$carousel.style.display = null;
    }

    this.installExtension();
  }

}