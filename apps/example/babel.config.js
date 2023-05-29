module.exports = function (api) {
  api.cache(true);
  const presets = ["babel-preset-expo"];
  const plugins = [
    [
      "module-resolver",
      {
        root: ["./src/**", "./modules/**"],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".android.js", ".android.tsx", ".ios.js", ".ios.tsx"],
      },
    ],
    "react-native-reanimated/plugin",
  ];

  return {
    presets,
    plugins,
  };
};
