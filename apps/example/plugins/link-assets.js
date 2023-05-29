const {
  IOSConfig,
  withDangerousMod,
  withInfoPlist,
  withXcodeProject,
  AndroidConfig,
  withMainApplication,
} = require("@expo/config-plugins");
const chalk = require("chalk");
const fs = require("fs");
const mime = require("mime");
const opentype = require("opentype.js");
const path = require("path");
const prettier = require("prettier");

const addImport = (stringContents) => {
  const importRegex = /^import [a-zA-Z.]+;/m;
  const addedImport = "import com.facebook.react.views.text.ReactFontManager;";

  const match = stringContents.match(importRegex);
  if (!match || match.index === undefined) {
    throw new Error('Unable to match "import" in MainActivity');
  }
  const indexOfFirstImport = match.index;

  stringContents = [
    stringContents.slice(0, indexOfFirstImport),
    addedImport,
    stringContents.slice(indexOfFirstImport),
  ].join("\n");

  return stringContents;
};

const addToOnCreate = (stringContents, addedLines) => {
  const onCreateRegex = /(void onCreate\(.*\)(.|\n)*super.onCreate\(.*\);\s*\n)/;

  const match = stringContents.match(onCreateRegex);
  if (!match || match.index === undefined) {
    throw new Error('Unable to match "void onCreate" in MainActivity');
  }

  const fullMatch = match[1];
  const indexOfMatch = match.index;
  const indexAfterMatch = indexOfMatch + fullMatch.length;

  stringContents = [
    stringContents.slice(0, indexAfterMatch),
    addedLines.map((line) => `    ${line}`).join("\n"),
    stringContents.slice(indexAfterMatch),
  ].join("\n");

  return stringContents;
};

function groupFilesByType(assets) {
  return groupBy(assets, (type) => (mime.getType(type) || "").split("/")[0]);
}

function groupBy(arr, block) {
  const out = {};

  for (const i of arr) {
    const key = block(i);
    if (!(key in out)) {
      out[key] = [];
    }
    out[key].push(i);
  }

  return out;
}

const withAndroidLinkedAsset = (config, { font = [[]] }, debug) => {
  const fontWeights = {};
  const fontMetrics = {};
  const fontImports = {};
  let importStrings = [];
  withDangerousMod(config, [
    "android",
    async (config) => {
      font.forEach(async (assets) => {
        let xmlContent = `<?xml version="1.0" encoding="utf-8"?>\n<font-family xmlns:app="http://schemas.android.com/apk/res-auto">`;
        assets.forEach(async (asset, index) => {
          const font = opentype.loadSync(asset);

          const postScriptName = font.names.postScriptName.en.replace(/-/g, "_").toLowerCase();
          const fontStyle = font.tables.post.italicAngle !== 0 ? "italic" : "normal";
          let fontWeight = font.tables.os2.usWeightClass;

          // font weight needs to be 100, 200, 300, 400, 500, 600, 700, 800, 900 so check the 250 weights to distiguish between 200 and 100
          if (fontWeight === 250) {
            fontWeight = font.names.preferredSubfamily?.en.includes("Thin") ? 100 : 200;
          }
          // CHECK IF BAD FILE NAME IS PARSED CORRECTLY CHANGE A FONT NAME TO SOMETHING RANDOM
          xmlContent += `\n  <font app:fontStyle="${fontStyle}" app:fontWeight="${fontWeight}" app:font="@font/${postScriptName}" />`;

          const fontsDir = path.join(config.modRequest.platformProjectRoot, "app/src/main/res/font");
          fs.mkdirSync(fontsDir, { recursive: true });
          const pathName = path.basename(postScriptName.replace(/-/g, "_").toLowerCase());
          const fontName = font.names.preferredFamily?.en ?? font.names.fontFamily?.en;

          if (!fontWeights[fontName]) {
            fontWeights[fontName] = [fontWeight];
          } else {
            if (!fontWeights[fontName].includes(fontWeight)) {
              fontWeights[fontName].push(fontWeight);
            }
          }

          if (!fontImports[fontName]) {
            fontImports[fontName] = [postScriptName.split("_")[0]];
          } else {
            if (!fontImports[fontName].includes(postScriptName.split("_")[0])) {
              fontImports[fontName].push(postScriptName.split("_")[0]);
            }
          }

          if (!fontMetrics[fontName]) {
            const validMetric = (obj) => {
              for (const key in obj) {
                if (typeof obj[key] !== "number") {
                  return false; // Found a number value, return false
                }
              }
              return true; // No number values found, return true
            };
            const fontMetric = {
              descent: font.tables.hhea.descender,
              ascent: font.tables.hhea.ascender,
              lineGap: font.tables.hhea.lineGap,
              capHeight: font.tables.os2.sCapHeight,
              unitsPerEm: font.unitsPerEm,
            };

            if (!validMetric(fontMetric)) {
              console.log(
                chalk.red(
                  `✖ ${chalk.red.bold(fontName)} font is invalid, using null value for capsize metrics`
                )
              );
            }
            fontMetrics[fontName] = validMetric(fontMetric) ? fontMetric : null;
          }

          const output = path.join(fontsDir, pathName);
          if (debug) {
            console.log("Copying font:", asset, "to", output, postScriptName);
          }

          fs.copyFileSync(asset, output);

          if (index === assets.length - 1) {
            xmlContent += `\n</font-family>`;
            const projectRoot = config.modRequest.projectRoot;
            const filePath = await AndroidConfig.Paths.getResourceXMLPathAsync(projectRoot, {
              name: postScriptName.split("_")[0],
              kind: "font",
            });

            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
            await fs.promises.writeFile(filePath, xmlContent);
          }
        });
      });

      importStrings = Object.entries(fontImports).map(
        ([key, value]) => `ReactFontManager.getInstance().addCustomFont(this, "${key}", R.font.${value});`
      );

      const typographyFileString = JSON.stringify(fontMetrics);

      const formattedContent = prettier.format(
        `
      // This file is codegenerated as part of the link-assets expo config plugin
      export type FontWeights = ${JSON.stringify(fontWeights)};
      export const fontConfig = ${typographyFileString}`,
        { parser: "typescript" }
      );

      fs.writeFileSync("./theme.typography.tsx", formattedContent);

      console.log(
        chalk.green("» ") +
          chalk.green.bold("Theming: ") +
          chalk.green("theme.typograhy.tsx has been created, import it as part of the theme.config.tsx file")
      );

      return config;
    },
  ]);

  config = withMainApplication(config, (config) => {
    let stringContents = config.modResults.contents;

    stringContents = addImport(stringContents);
    stringContents = addToOnCreate(stringContents, importStrings);

    config.modResults.contents = stringContents;

    return config;
  });

  return config;
};

const withIosLinkedAsset = (config, { font, image }, debug) => {
  config = withXcodeProject(config, (config) => {
    const project = config.modResults;
    IOSConfig.XcodeUtils.ensureGroupRecursively(project, "Resources");

    function addResourceFile(f) {
      return (f ?? [])
        .map((asset) => {
          const absoluteAssetPath = path.relative(config.modRequest.platformProjectRoot, asset);
          if (debug) {
            console.log(`Linking asset ${asset} -- ${absoluteAssetPath} -- ${project.getFirstTarget().uuid}`);
          }
          return project.addResourceFile(absoluteAssetPath, {
            target: project.getFirstTarget().uuid,
          });
        })
        .filter(Boolean) // xcode returns false if file is already there
        .map((file) => file.basename);
    }

    addResourceFile(font);
    addResourceFile(image);

    return config;
  });

  config = withInfoPlist(config, (config) => {
    // console.log("set fonts:", fontList);
    // @ts-ignore Type mismatch with the lib
    const existingFonts = config.modResults.UIAppFonts ?? [];

    const fontList = font?.map((font) => path.basename(font)) ?? [];

    // console.log("Native iOS Fonts:", fontList);

    const allFonts = [
      // @ts-expect-error
      ...existingFonts,
      ...fontList,
    ];
    // @ts-ignore Type mismatch with the lib
    config.modResults.UIAppFonts = Array.from(new Set(allFonts));

    return config;
  });

  return config;
};

function withLinkedAsset(config, props) {
  const expanded = props.folders
    .map((filePath) => {
      const resolved = path.resolve(config._internal?.projectRoot, filePath);
      if (fs.statSync(resolved).isDirectory()) {
        return fs.readdirSync(resolved).map((file) => path.join(resolved, file));
      }
      return [resolved];
    })
    .flat();

  if (props.debug) {
    console.log("All files:", expanded);
  }

  const assets = groupFilesByType(expanded);
  if (props.debug) {
    console.log("Grouped:", assets);
  }

  const regroupedAssets = { assets: { font: [] } };

  const fontMap = {};

  assets.font.forEach((font) => {
    const splitFont = font.split("/");
    const fontName = splitFont[splitFont.length - 1];

    const check = opentype.loadSync(font);
    const postScriptName = check.names.postScriptName.en.split("-")[0];

    const family = fontName.split("-")[0];
    console.log(postScriptName, fontName, family);

    if (!fontMap[postScriptName]) {
      fontMap[postScriptName] = [];
    }
    fontMap[postScriptName].push(font);
  });

  for (const family in fontMap) {
    regroupedAssets.assets.font.push(fontMap[family]);
  }

  withIosLinkedAsset(config, assets, props.debug);
  withAndroidLinkedAsset(config, regroupedAssets.assets, props.debug);
  return config;
}

module.exports = withLinkedAsset;
