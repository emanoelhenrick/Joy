const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'src/assets/icons/icon',
    executableName: "joy-client",
  },
  icon: "src/assets/icons/icon",
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      executableName: "joy-client",
      config: {
        name: "Joy",
        setupIcon: 'src/assets/icons/icon.ico',
        noMsi: true,
        shortcutName: "JXC",
        createDesktopShortcut: true
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      executableName: "joy-client",
      config: {
        name: "Joy",
        options: {
          icon: 'src/assets/icons/icon.png'
        }
      },
    },
    {
      name: '@electron-forge/maker-deb',
      executableName: "joy-client",
      config: {
        name: "Joy",
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
