const {
    AndroidConfig,
    createRunOncePlugin,
    withAndroidStyles,
    ConfigPlugin,
    withPlugins,
    withStringsXml,
  } = require("@expo/config-plugins");
  
  const pkg = require("expo-transparent-navigation/package.json");
  
  function setForceDarkModeToFalse(
    styles,
    value
  ) {
    styles = AndroidConfig.Styles.assignStylesValue(styles, {
      add: true,
      parent: AndroidConfig.Styles.getAppThemeLightNoActionBarGroup(),
      name: `android:statusBarColor`,
      value: "@android:color/transparent",
    });
  
    styles = AndroidConfig.Styles.assignStylesValue(styles, {
      add: true,
      parent: AndroidConfig.Styles.getAppThemeLightNoActionBarGroup(),
      name: `android:navigationBarColor`,
      value: "@android:color/transparent",
    });
  
    styles = AndroidConfig.Styles.assignStylesValue(styles, {
      add: true,
      parent: AndroidConfig.Styles.getAppThemeLightNoActionBarGroup(),
      name: `android:windowLightStatusBar`,
      value: value === "light-content" ? "false" : "true",
    });
  
    styles = AndroidConfig.Styles.assignStylesValue(styles, {
      add: true,
      parent: AndroidConfig.Styles.getAppThemeLightNoActionBarGroup(),
      name: `android:windowLightNavigationBar`,
      value: value === "light-content" ? "false" : "false",
    });
  
    return styles;
  }
  
  const withTransparentStyles = (config, value) => {
    return withAndroidStyles(config, async (con) => {
      con.modResults = setForceDarkModeToFalse(con.modResults, value);
      return con;
    });
  };
  
  function setStrings(strings, value) {
    // Helper to add string.xml JSON items or overwrite existing items with the same name.
    return AndroidConfig.Strings.setStringItem(
      [
        // XML represented as JSON
        // <string name="expo_custom_value" translatable="false">value</string>
        { $: { name: "navigation_bar_style", translatable: "false" }, _: value },
      ],
      strings
    );
  }
  
  const withCustom = (config, value) => {
    return withStringsXml(config, (config) => {
      config.modResults = setStrings(config.modResults, value);
      return config;
    });
  };
  
  const withNavigationBar = (config, value) => {
    return withPlugins(config, [
      [withTransparentStyles, value],
      [withCustom, value],
    ]);
  };
  
  export default createRunOncePlugin(withNavigationBar, pkg.name, pkg.version);
  