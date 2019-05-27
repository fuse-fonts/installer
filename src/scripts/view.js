"use strict";

const { shell, remote } = require('electron')

/** View
 * Controls our visual state
 * Note all top level scripts are added to the global scope
 */
class View {
  
  constructor(settings) {

    this.settings = settings;
    this.zxpPath = __dirname + settings.zxpPath;

    this.installer = new Installer(this.zxpPath);

    // ui
    this.$appTitle = document.querySelector(".title");
    this.$appVersion = document.querySelector(".version");

    this.$progressBar = document.querySelector(".progress-bar");
    this.$progressTrack = document.querySelector(".progress-track");

    this.$installBtn = document.querySelector(".install");
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
    
    // add event lsiteners to all .exit elements
    const exitApp = this.cancelClicked.bind(this);
    Array.prototype.forEach.call(this.$exitBtns, function(node){
      node.addEventListener("click", exitApp);
      node.attributes.removeNamedItem("disabled");
    });

    // remove disabled from the first two options
    this.$installBtn.attributes.removeNamedItem("disabled");


    // support url of errors view
    document.querySelector(".support-url").addEventListener("click", this.supportURLClicked.bind(this));

    // learn more button
    document.querySelector(".learn-more").addEventListener("click", this.learnMoreClicked.bind(this))


    this.$carousel = document.querySelector(".carousel");

    this.views = {
      $actions:     document.querySelector(".view.view--actions"),
      $installing:  document.querySelector(".view.view--installing"),
      $error:       document.querySelector(".view.view--errors"),
      $complete:    document.querySelector(".view.view--complete")
    };

    this.activeClassName = "view--active";
    this.$activeView = document.querySelector(`.${this.activeClassName}`);
    console.log(this);
  }

  changeView($ref) {
    this.$activeView.classList.remove(this.activeClassName);
    $ref.classList.add(this.activeClassName);
    this.$activeView = $ref;
  }

  /**
   * Begins installing the extension
   */
  installExtension() {

    const that = this;
    const promise = this.installer.install();

    promise.then(that.postInstall.bind(this), that.failed.bind(this));

    return promise;
  }

  uninstallExtension() {
    throw new Error("Not Implemented");
  }

  postInstall() {
    console.log("success");
    this.changeView(this.views.$complete);
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

  installClicked() {

    this.changeView(this.views.$installing);
    if (this.settings.learnMoreURL) {
      this.$carousel.style.display = null;
    }

    this.installExtension();
  }

}