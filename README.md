# installer

Electron App for installing and uninstalling fuse-fonts, or any .zxp.
You'd need to fork this to use it for another installer.

## Usage to install an Adobe Plugin

1. To start, you'll need a .zxp file. Place the zxp file within `src/bin`.
  - A .zxp file is not included with this repository
2. Then, review `src/settings.json`'s and update the [`"zxpPath"` line](https://github.com/fuse-fonts/installer/blob/master/src/settings.json#L12) to match your zxp file.
3. You can then use the `npm run` scripts to test and package the installer.
  - Use `npm run dev` to test the installer/
  - Use `npm run package` to package the installer into the executable of your current platform.

