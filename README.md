# installer

Electron App for installing and uninstalling fuse-fonts, or any .zxp.
You'd need to fork this to use it for another installer.

## Usage to install an Adobe Plugin

First: You'll need a .zxp file in order to use the installer. A .zxp file is not included within this repository

1. Clone/Fork this repository
2. Run `npm install` within the repository folder to install dependencies
3. Place the zxp file within `src/bin`.
4. Then, review `src/settings.json`'s and update the [`"zxpPath"` line](https://github.com/fuse-fonts/installer/blob/master/src/settings.json#L12) to match your zxp file.
5. You can then use the `npm run` scripts to test and package the installer.
  - Use `npm run dev` to test the installer/
  - Use `npm run package` to package the installer into the executable of your current platform.

