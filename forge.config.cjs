const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'src/assets/icons/icon'
  },
  icon: "src/assets/icons/icon",
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "JOI",
        setupIcon: 'src/assets/icons/icon.ico',
        noMsi: true,
        shortcutName: "JXC",
        createDesktopShortcut: true
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        name: "JOI",
        options: {
          icon: 'src/assets/icons/icon.png'
        }
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        name: "JOI",
        options: {
          icon: 'src/assets/icons/icon.png'
        }
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
