var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// tamagui.config.ts
var tamagui_config_exports = {};
__export(tamagui_config_exports, {
  default: () => tamagui_config_default,
  tamaguiConfig: () => tamaguiConfig
});
module.exports = __toCommonJS(tamagui_config_exports);

// ../../node_modules/.pnpm/@tamagui+create-theme@2.0.0_c45a65c08271e33a69fc515f40f824f5/node_modules/@tamagui/create-theme/dist/esm/isMinusZero.mjs
function isMinusZero(value) {
  return 1 / value === Number.NEGATIVE_INFINITY;
}
__name(isMinusZero, "isMinusZero");

// ../../node_modules/.pnpm/@tamagui+create-theme@2.0.0_c45a65c08271e33a69fc515f40f824f5/node_modules/@tamagui/create-theme/dist/esm/themeInfo.mjs
var THEME_INFO = /* @__PURE__ */ new Map();
var getThemeInfo = /* @__PURE__ */ __name((theme, name) => THEME_INFO.get(name || JSON.stringify(theme)), "getThemeInfo");
var setThemeInfo = /* @__PURE__ */ __name((theme, info) => {
  const next = {
    ...info,
    cache: /* @__PURE__ */ new Map()
  };
  THEME_INFO.set(info.name || JSON.stringify(theme), next), THEME_INFO.set(JSON.stringify(info.definition), next);
}, "setThemeInfo");

// ../../node_modules/.pnpm/@tamagui+create-theme@2.0.0_c45a65c08271e33a69fc515f40f824f5/node_modules/@tamagui/create-theme/dist/esm/createTheme.mjs
var identityCache = /* @__PURE__ */ new Map();
function createThemeWithPalettes(palettes, defaultPalette, definition, options, name, skipCache = false) {
  if (!palettes[defaultPalette]) throw new Error(`No palette: ${defaultPalette}`);
  const newDef = {
    ...definition
  };
  for (const key in definition) {
    let val = definition[key];
    if (typeof val == "string" && val[0] === "$") {
      const [altPaletteName$, altPaletteIndex] = val.split("."), altPaletteName = altPaletteName$.slice(1), parentName = defaultPalette.split("_")[0], altPalette = palettes[altPaletteName] || palettes[`${parentName}_${altPaletteName}`];
      if (altPalette) {
        const next = getValue(altPalette, +altPaletteIndex);
        typeof next < "u" && (newDef[key] = next);
      }
    }
  }
  return createTheme(palettes[defaultPalette], newDef, options, name, skipCache);
}
__name(createThemeWithPalettes, "createThemeWithPalettes");
function createTheme(palette, definition, options, name, skipCache = false) {
  const cacheKey = skipCache ? "" : JSON.stringify([name, palette, definition, options]);
  if (!skipCache && identityCache.has(cacheKey)) return identityCache.get(cacheKey);
  const theme = {
    ...Object.fromEntries(Object.entries(definition).map(([key, offset]) => [key, getValue(palette, offset)])),
    ...options?.nonInheritedValues
  };
  return setThemeInfo(theme, {
    palette,
    definition,
    options,
    name
  }), cacheKey && identityCache.set(cacheKey, theme), theme;
}
__name(createTheme, "createTheme");
var getValue = /* @__PURE__ */ __name((palette, value) => {
  if (!palette) throw new Error("No palette!");
  if (typeof value == "string") return value;
  const max = palette.length - 1, next = (value === 0 ? !isMinusZero(value) : value >= 0) ? value : max + value, index = Math.min(Math.max(0, next), max);
  return palette[index];
}, "getValue");

// ../../node_modules/.pnpm/@tamagui+create-theme@2.0.0_c45a65c08271e33a69fc515f40f824f5/node_modules/@tamagui/create-theme/dist/esm/helpers.mjs
function objectEntries(obj) {
  return Object.entries(obj);
}
__name(objectEntries, "objectEntries");
function objectFromEntries(arr) {
  return Object.fromEntries(arr);
}
__name(objectFromEntries, "objectFromEntries");

// ../../node_modules/.pnpm/@tamagui+create-theme@2.0.0_c45a65c08271e33a69fc515f40f824f5/node_modules/@tamagui/create-theme/dist/esm/masks.mjs
var createMask = /* @__PURE__ */ __name((createMask2) => typeof createMask2 == "function" ? {
  name: createMask2.name || "unnamed",
  mask: createMask2
} : createMask2, "createMask");

// ../../node_modules/.pnpm/@tamagui+create-theme@2.0.0_c45a65c08271e33a69fc515f40f824f5/node_modules/@tamagui/create-theme/dist/esm/applyMask.mjs
function applyMask(theme, mask, options = {}, parentName, nextName) {
  const info = getThemeInfo(theme, parentName);
  if (!info) throw new Error(process.env.NODE_ENV !== "production" ? "No info found for theme, you must pass the theme created by createThemeFromPalette directly to extendTheme" : "\u274C Err2");
  const next = applyMaskStateless(info, mask, options, parentName);
  return setThemeInfo(next.theme, {
    definition: next.definition,
    palette: info.palette,
    name: nextName
  }), next.theme;
}
__name(applyMask, "applyMask");
function applyMaskStateless(info, mask, options = {}, parentName) {
  const skip = {
    ...options.skip
  };
  if (info.options?.nonInheritedValues) for (const key in info.options.nonInheritedValues) skip[key] = 1;
  const maskOptions = {
    parentName,
    palette: info.palette,
    ...options,
    skip
  }, template = mask.mask(info.definition, maskOptions), theme = createTheme(info.palette, template);
  return {
    ...info,
    cache: /* @__PURE__ */ new Map(),
    definition: template,
    theme
  };
}
__name(applyMaskStateless, "applyMaskStateless");

// ../../node_modules/.pnpm/@tamagui+theme-builder@2.0._ee9150b47a828b0b24f0ba1152ac75b4/node_modules/@tamagui/theme-builder/dist/esm/ThemeBuilder.mjs
var ThemeBuilder = class {
  static {
    __name(this, "ThemeBuilder");
  }
  constructor(state) {
    this.state = state;
  }
  _getThemeFn;
  addPalettes(palettes) {
    return this.state.palettes = {
      // as {} prevents generic string key merge messing up types
      ...this.state.palettes,
      ...palettes
    }, this;
  }
  addTemplates(templates) {
    return this.state.templates = {
      // as {} prevents generic string key merge messing up types
      ...this.state.templates,
      ...templates
    }, this;
  }
  addMasks(masks) {
    return this.state.masks = {
      // as {} prevents generic string key merge messing up types
      ...this.state.masks,
      ...objectFromEntries(objectEntries(masks).map(([key, val]) => [key, createMask(val)]))
    }, this;
  }
  // for dev mode only really
  _addedThemes = [];
  addThemes(themes4) {
    return this._addedThemes.push({
      type: "themes",
      args: [themes4]
    }), this.state.themes = {
      // as {} prevents generic string key merge messing up types
      ...this.state.themes,
      ...themes4
    }, this;
  }
  // these wont be typed to save some complexity and because they don't need to be typed!
  addComponentThemes(childThemeDefinition, options) {
    return this.addChildThemes(childThemeDefinition, options), this;
  }
  addChildThemes(childThemeDefinition, options) {
    const currentThemes = this.state.themes;
    if (!currentThemes) throw new Error("No themes defined yet, use addThemes first to set your base themes");
    this._addedThemes.push({
      type: "childThemes",
      args: [childThemeDefinition, options]
    });
    const currentThemeNames = Object.keys(currentThemes), incomingThemeNames = Object.keys(childThemeDefinition), namesWithDefinitions = currentThemeNames.flatMap((prefix) => {
      const avoidNestingWithin = options?.avoidNestingWithin;
      return avoidNestingWithin && avoidNestingWithin.some((avoidName) => prefix.startsWith(avoidName) || prefix.endsWith(avoidName)) ? [] : incomingThemeNames.map((subName) => {
        const fullName = `${prefix}_${subName}`, definition = childThemeDefinition[subName];
        return "avoidNestingWithin" in definition && definition.avoidNestingWithin.some((name) => (name === "light" || name === "dark") && prefix.includes("_") ? false : prefix.startsWith(name) || prefix.endsWith(name)) || prefix.endsWith(`_${subName}`) ? null : [fullName, definition];
      }).filter(Boolean);
    }), childThemes = Object.fromEntries(namesWithDefinitions), next = {
      // as {} prevents generic string key merge messing up types
      ...this.state.themes,
      ...childThemes
    };
    return this.state.themes = next, this;
  }
  getTheme(fn) {
    return this._getThemeFn = fn, this;
  }
  build() {
    if (!this.state.themes) return {};
    const out = {}, maskedThemes = [];
    for (const themeName in this.state.themes) {
      const nameParts = themeName.split("_"), parentName = nameParts.slice(0, nameParts.length - 1).join("_"), definitions = this.state.themes[themeName], themeDefinition = Array.isArray(definitions) ? (() => {
        const found = definitions.find(
          // endWith match stronger than startsWith
          (d) => d.parent ? parentName.endsWith(d.parent) || parentName.startsWith(d.parent) : true
        );
        return found || null;
      })() : definitions;
      if (themeDefinition) if ("theme" in themeDefinition) out[themeName] = themeDefinition.theme;
      else if ("mask" in themeDefinition) maskedThemes.push({
        parentName,
        themeName,
        mask: themeDefinition
      });
      else {
        let {
          palette: paletteName = "",
          template: templateName,
          ...options
        } = themeDefinition;
        const parentDefinition = this.state.themes[parentName];
        if (!this.state.palettes) throw new Error(`No palettes defined for theme with palette expected: ${themeName}`);
        let palette = this.state.palettes[paletteName || ""], attemptParentName = `${parentName}_${paletteName}`;
        for (; !palette && attemptParentName; ) attemptParentName in this.state.palettes ? (palette = this.state.palettes[attemptParentName], paletteName = attemptParentName) : attemptParentName = attemptParentName.split("_").slice(0, -1).join("_");
        if (!palette) {
          const msg = process.env.NODE_ENV !== "production" ? `: ${themeName}: ${paletteName}
          Definition: ${JSON.stringify(themeDefinition)}
          Parent: ${JSON.stringify(parentDefinition)}
          Potential: (${Object.keys(this.state.palettes).join(", ")})` : "";
          throw new Error(`No palette for theme${msg}`);
        }
        const template = this.state.templates?.[templateName] ?? // fall back to finding the scheme specific on if it exists
        this.state.templates?.[`${nameParts[0]}_${templateName}`];
        if (!template) throw new Error(`No template for theme ${themeName}: ${templateName} in templates:
- ${Object.keys(this.state.templates || {}).join(`
 - `)}`);
        const theme = createThemeWithPalettes(this.state.palettes, paletteName, template, options, themeName, true);
        out[themeName] = this._getThemeFn ? {
          ...theme,
          ...this._getThemeFn({
            theme,
            name: themeName,
            level: nameParts.length,
            parentName,
            scheme: /^(light|dark)$/.test(nameParts[0]) ? nameParts[0] : void 0,
            parentNames: nameParts.slice(0, -1),
            palette,
            template
          })
        } : theme;
      }
    }
    for (const {
      mask,
      themeName,
      parentName
    } of maskedThemes) {
      const parent = out[parentName];
      if (!parent) continue;
      const {
        mask: maskName,
        ...options
      } = mask;
      let maskFunction = this.state.masks?.[maskName];
      if (!maskFunction) throw new Error(`No mask ${maskName}`);
      const parentTheme = this.state.themes[parentName];
      if (parentTheme && "childOptions" in parentTheme) {
        const {
          mask: mask2,
          ...childOpts
        } = parentTheme.childOptions;
        mask2 && (maskFunction = this.state.masks?.[mask2]), Object.assign(options, childOpts);
      }
      out[themeName] = applyMask(parent, maskFunction, options, parentName, themeName);
    }
    return out;
  }
};
function createThemeBuilder() {
  return new ThemeBuilder({});
}
__name(createThemeBuilder, "createThemeBuilder");

// ../../node_modules/.pnpm/color2k@2.0.3/node_modules/color2k/dist/index.exports.import.es.mjs
function guard(low, high, value) {
  return Math.min(Math.max(low, value), high);
}
__name(guard, "guard");
var ColorError = class extends Error {
  static {
    __name(this, "ColorError");
  }
  constructor(color) {
    super(`Failed to parse color: "${color}"`);
  }
};
var ColorError$1 = ColorError;
function parseToRgba(color) {
  if (typeof color !== "string") throw new ColorError$1(color);
  if (color.trim().toLowerCase() === "transparent") return [0, 0, 0, 0];
  let normalizedColor = color.trim();
  normalizedColor = namedColorRegex.test(color) ? nameToHex(color) : color;
  const reducedHexMatch = reducedHexRegex.exec(normalizedColor);
  if (reducedHexMatch) {
    const arr = Array.from(reducedHexMatch).slice(1);
    return [...arr.slice(0, 3).map((x) => parseInt(r(x, 2), 16)), parseInt(r(arr[3] || "f", 2), 16) / 255];
  }
  const hexMatch = hexRegex.exec(normalizedColor);
  if (hexMatch) {
    const arr = Array.from(hexMatch).slice(1);
    return [...arr.slice(0, 3).map((x) => parseInt(x, 16)), parseInt(arr[3] || "ff", 16) / 255];
  }
  const rgbaMatch = rgbaRegex.exec(normalizedColor);
  if (rgbaMatch) {
    const arr = Array.from(rgbaMatch).slice(1);
    return [...arr.slice(0, 3).map((x) => parseInt(x, 10)), parseFloat(arr[3] || "1")];
  }
  const hslaMatch = hslaRegex.exec(normalizedColor);
  if (hslaMatch) {
    const [h, s, l, a] = Array.from(hslaMatch).slice(1).map(parseFloat);
    if (guard(0, 100, s) !== s) throw new ColorError$1(color);
    if (guard(0, 100, l) !== l) throw new ColorError$1(color);
    return [...hslToRgb(h, s, l), Number.isNaN(a) ? 1 : a];
  }
  throw new ColorError$1(color);
}
__name(parseToRgba, "parseToRgba");
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i) {
    hash2 = hash2 * 33 ^ str.charCodeAt(--i);
  }
  return (hash2 >>> 0) % 2341;
}
__name(hash, "hash");
var colorToInt = /* @__PURE__ */ __name((x) => parseInt(x.replace(/_/g, ""), 36), "colorToInt");
var compressedColorMap = "1q29ehhb 1n09sgk7 1kl1ekf_ _yl4zsno 16z9eiv3 1p29lhp8 _bd9zg04 17u0____ _iw9zhe5 _to73___ _r45e31e _7l6g016 _jh8ouiv _zn3qba8 1jy4zshs 11u87k0u 1ro9yvyo 1aj3xael 1gz9zjz0 _3w8l4xo 1bf1ekf_ _ke3v___ _4rrkb__ 13j776yz _646mbhl _nrjr4__ _le6mbhl 1n37ehkb _m75f91n _qj3bzfz 1939yygw 11i5z6x8 _1k5f8xs 1509441m 15t5lwgf _ae2th1n _tg1ugcv 1lp1ugcv 16e14up_ _h55rw7n _ny9yavn _7a11xb_ 1ih442g9 _pv442g9 1mv16xof 14e6y7tu 1oo9zkds 17d1cisi _4v9y70f _y98m8kc 1019pq0v 12o9zda8 _348j4f4 1et50i2o _8epa8__ _ts6senj 1o350i2o 1mi9eiuo 1259yrp0 1ln80gnw _632xcoy 1cn9zldc _f29edu4 1n490c8q _9f9ziet 1b94vk74 _m49zkct 1kz6s73a 1eu9dtog _q58s1rz 1dy9sjiq __u89jo3 _aj5nkwg _ld89jo3 13h9z6wx _qa9z2ii _l119xgq _bs5arju 1hj4nwk9 1qt4nwk9 1ge6wau6 14j9zlcw 11p1edc_ _ms1zcxe _439shk6 _jt9y70f _754zsow 1la40eju _oq5p___ _x279qkz 1fa5r3rv _yd2d9ip _424tcku _8y1di2_ _zi2uabw _yy7rn9h 12yz980_ __39ljp6 1b59zg0x _n39zfzp 1fy9zest _b33k___ _hp9wq92 1il50hz4 _io472ub _lj9z3eo 19z9ykg0 _8t8iu3a 12b9bl4a 1ak5yw0o _896v4ku _tb8k8lv _s59zi6t _c09ze0p 1lg80oqn 1id9z8wb _238nba5 1kq6wgdi _154zssg _tn3zk49 _da9y6tc 1sg7cv4f _r12jvtt 1gq5fmkz 1cs9rvci _lp9jn1c _xw1tdnb 13f9zje6 16f6973h _vo7ir40 _bt5arjf _rc45e4t _hr4e100 10v4e100 _hc9zke2 _w91egv_ _sj2r1kk 13c87yx8 _vqpds__ _ni8ggk8 _tj9yqfb 1ia2j4r4 _7x9b10u 1fc9ld4j 1eq9zldr _5j9lhpx _ez9zl6o _md61fzm".split(" ").reduce((acc, next) => {
  const key = colorToInt(next.substring(0, 3));
  const hex = colorToInt(next.substring(3)).toString(16);
  let prefix = "";
  for (let i = 0; i < 6 - hex.length; i++) {
    prefix += "0";
  }
  acc[key] = `${prefix}${hex}`;
  return acc;
}, {});
function nameToHex(color) {
  const normalizedColorName = color.toLowerCase().trim();
  const result = compressedColorMap[hash(normalizedColorName)];
  if (!result) throw new ColorError$1(color);
  return `#${result}`;
}
__name(nameToHex, "nameToHex");
var r = /* @__PURE__ */ __name((str, amount) => Array.from(Array(amount)).map(() => str).join(""), "r");
var reducedHexRegex = new RegExp(`^#${r("([a-f0-9])", 3)}([a-f0-9])?$`, "i");
var hexRegex = new RegExp(`^#${r("([a-f0-9]{2})", 3)}([a-f0-9]{2})?$`, "i");
var rgbaRegex = new RegExp(`^rgba?\\(\\s*(\\d+)\\s*${r(",\\s*(\\d+)\\s*", 2)}(?:,\\s*([\\d.]+))?\\s*\\)$`, "i");
var hslaRegex = /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i;
var namedColorRegex = /^[a-z]+$/i;
var roundColor = /* @__PURE__ */ __name((color) => {
  return Math.round(color * 255);
}, "roundColor");
var hslToRgb = /* @__PURE__ */ __name((hue, saturation, lightness) => {
  let l = lightness / 100;
  if (saturation === 0) {
    return [l, l, l].map(roundColor);
  }
  const huePrime = (hue % 360 + 360) % 360 / 60;
  const chroma = (1 - Math.abs(2 * l - 1)) * (saturation / 100);
  const secondComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));
  let red3 = 0;
  let green3 = 0;
  let blue3 = 0;
  if (huePrime >= 0 && huePrime < 1) {
    red3 = chroma;
    green3 = secondComponent;
  } else if (huePrime >= 1 && huePrime < 2) {
    red3 = secondComponent;
    green3 = chroma;
  } else if (huePrime >= 2 && huePrime < 3) {
    green3 = chroma;
    blue3 = secondComponent;
  } else if (huePrime >= 3 && huePrime < 4) {
    green3 = secondComponent;
    blue3 = chroma;
  } else if (huePrime >= 4 && huePrime < 5) {
    red3 = secondComponent;
    blue3 = chroma;
  } else if (huePrime >= 5 && huePrime < 6) {
    red3 = chroma;
    blue3 = secondComponent;
  }
  const lightnessModification = l - chroma / 2;
  const finalRed = red3 + lightnessModification;
  const finalGreen = green3 + lightnessModification;
  const finalBlue = blue3 + lightnessModification;
  return [finalRed, finalGreen, finalBlue].map(roundColor);
}, "hslToRgb");
function parseToHsla(color) {
  const [red3, green3, blue3, alpha] = parseToRgba(color).map((value, index) => (
    // 3rd index is alpha channel which is already normalized
    index === 3 ? value : value / 255
  ));
  const max = Math.max(red3, green3, blue3);
  const min = Math.min(red3, green3, blue3);
  const lightness = (max + min) / 2;
  if (max === min) return [0, 0, lightness, alpha];
  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const hue = 60 * (red3 === max ? (green3 - blue3) / delta + (green3 < blue3 ? 6 : 0) : green3 === max ? (blue3 - red3) / delta + 2 : (red3 - green3) / delta + 4);
  return [hue, saturation, lightness, alpha];
}
__name(parseToHsla, "parseToHsla");
function hsla(hue, saturation, lightness, alpha) {
  return `hsla(${(hue % 360).toFixed()}, ${guard(0, 100, saturation * 100).toFixed()}%, ${guard(0, 100, lightness * 100).toFixed()}%, ${parseFloat(guard(0, 1, alpha).toFixed(3))})`;
}
__name(hsla, "hsla");

// ../../node_modules/.pnpm/@tamagui+theme-builder@2.0._ee9150b47a828b0b24f0ba1152ac75b4/node_modules/@tamagui/theme-builder/dist/esm/defaultComponentThemes.mjs
var defaultComponentThemes = {
  ListItem: {
    template: "surface1"
  },
  SelectItem: {
    template: "surface1"
  },
  SelectTrigger: {
    template: "surface1"
  },
  Card: {
    template: "surface1"
  },
  Button: {
    template: "surface3"
  },
  Checkbox: {
    template: "surface2"
  },
  Switch: {
    template: "surface2"
  },
  SwitchThumb: {
    template: "inverse"
  },
  TooltipContent: {
    template: "surface2"
  },
  Progress: {
    template: "surface1"
  },
  RadioGroupItem: {
    template: "surface2"
  },
  TooltipArrow: {
    template: "surface1"
  },
  SliderTrackActive: {
    template: "surface2"
  },
  SliderTrack: {
    template: "inverse"
  },
  SliderThumb: {
    template: "inverse"
  },
  Tooltip: {
    template: "inverse"
  },
  ProgressIndicator: {
    template: "inverse"
  },
  Input: {
    template: "surface1"
  },
  TextArea: {
    template: "surface1"
  }
};

// ../../node_modules/.pnpm/@tamagui+theme-builder@2.0._ee9150b47a828b0b24f0ba1152ac75b4/node_modules/@tamagui/theme-builder/dist/esm/helpers.mjs
var objectKeys = /* @__PURE__ */ __name((obj) => Object.keys(obj), "objectKeys");
function objectFromEntries2(arr) {
  return Object.fromEntries(arr);
}
__name(objectFromEntries2, "objectFromEntries");

// ../../node_modules/.pnpm/@tamagui+theme-builder@2.0._ee9150b47a828b0b24f0ba1152ac75b4/node_modules/@tamagui/theme-builder/dist/esm/defaultTemplates.mjs
var getTemplates = /* @__PURE__ */ __name(() => {
  const lightTemplates = getBaseTemplates("light"), darkTemplates = getBaseTemplates("dark");
  return {
    ...objectFromEntries2(objectKeys(lightTemplates).map((name) => [`light_${name}`, lightTemplates[name]])),
    ...objectFromEntries2(objectKeys(darkTemplates).map((name) => [`dark_${name}`, darkTemplates[name]]))
  };
}, "getTemplates");
var getBaseTemplates = /* @__PURE__ */ __name((scheme) => {
  const isLight = scheme === "light", bgIndex = 6, lighten = isLight ? -1 : 1, darken = -lighten, increaseContrast = 1, borderColor = bgIndex + 3, baseColors = {
    color: -bgIndex,
    colorHover: -bgIndex - 1,
    colorPress: -bgIndex,
    colorFocus: -bgIndex - 1,
    placeholderColor: -bgIndex - 3,
    outlineColor: -2
  }, base = {
    accentBackground: 0,
    accentColor: -0,
    background0: 1,
    background02: 2,
    background04: 3,
    background06: 4,
    background08: 5,
    color1: bgIndex,
    color2: bgIndex + 1,
    color3: bgIndex + 2,
    color4: bgIndex + 3,
    color5: bgIndex + 4,
    color6: bgIndex + 5,
    color7: bgIndex + 6,
    color8: bgIndex + 7,
    color9: bgIndex + 8,
    color10: bgIndex + 9,
    color11: bgIndex + 10,
    color12: bgIndex + 11,
    color0: -1,
    color02: -2,
    color04: -3,
    color06: -4,
    color08: -5,
    // the background, color, etc keys here work like generics - they make it so you
    // can publish components for others to use without mandating a specific color scale
    // the @tamagui/button Button component looks for `$background`, so you set the
    // dark_red_Button theme to have a stronger background than the dark_red theme.
    background: bgIndex,
    backgroundHover: bgIndex + increaseContrast * 2,
    backgroundPress: bgIndex + increaseContrast * 3,
    backgroundFocus: bgIndex + increaseContrast * 2,
    borderColor,
    borderColorHover: borderColor + lighten,
    borderColorPress: borderColor + darken,
    borderColorFocus: borderColor,
    ...baseColors,
    colorTransparent: -1
  }, surface1 = {
    ...baseColors,
    background: base.background + 1,
    backgroundHover: base.backgroundHover + 1,
    backgroundPress: base.backgroundPress + 1,
    backgroundFocus: base.backgroundFocus + 1,
    borderColor: base.borderColor + 1,
    borderColorHover: base.borderColorHover + 1,
    borderColorFocus: base.borderColorFocus + 1,
    borderColorPress: base.borderColorPress + 1
  }, surface2 = {
    ...baseColors,
    background: base.background + 2,
    backgroundHover: base.backgroundHover + 2,
    backgroundPress: base.backgroundPress + 2,
    backgroundFocus: base.backgroundFocus + 2,
    borderColor: base.borderColor + 2,
    borderColorHover: base.borderColorHover + 2,
    borderColorFocus: base.borderColorFocus + 2,
    borderColorPress: base.borderColorPress + 2
  }, surface3 = {
    ...baseColors,
    background: base.background + 3,
    backgroundHover: base.backgroundHover + 3,
    backgroundPress: base.backgroundPress + 3,
    backgroundFocus: base.backgroundFocus + 3,
    borderColor: base.borderColor + 3,
    borderColorHover: base.borderColorHover + 3,
    borderColorFocus: base.borderColorFocus + 3,
    borderColorPress: base.borderColorPress + 3
  }, alt1 = {
    color: base.color - 1,
    colorHover: base.colorHover - 1,
    colorPress: base.colorPress - 1,
    colorFocus: base.colorFocus - 1
  }, alt2 = {
    color: base.color - 2,
    colorHover: base.colorHover - 2,
    colorPress: base.colorPress - 2,
    colorFocus: base.colorFocus - 2
  }, inverse = Object.fromEntries(Object.entries(base).map(([key, index]) => [key, -index]));
  return {
    base,
    surface1,
    surface2,
    surface3,
    alt1,
    alt2,
    inverse
  };
}, "getBaseTemplates");
var defaultTemplates = getTemplates();

// ../../node_modules/.pnpm/@tamagui+theme-builder@2.0._ee9150b47a828b0b24f0ba1152ac75b4/node_modules/@tamagui/theme-builder/dist/esm/getThemeSuitePalettes.mjs
var paletteSize = 12;
var PALETTE_BACKGROUND_OFFSET = 6;
var generateColorPalette = /* @__PURE__ */ __name(({
  palette: buildPalette,
  scheme
}) => {
  if (!buildPalette) return [];
  const {
    anchors
  } = buildPalette;
  let palette = [];
  const add = /* @__PURE__ */ __name((h, s, l, a) => {
    palette.push(hsla(h, s, l, a ?? 1));
  }, "add"), numAnchors = Object.keys(anchors).length;
  for (const [anchorIndex, anchor] of anchors.entries()) {
    const [h, s, l, a] = [anchor.hue[scheme], anchor.sat[scheme], anchor.lum[scheme], anchor.alpha?.[scheme] ?? 1];
    if (anchorIndex !== 0) {
      const lastAnchor = anchors[anchorIndex - 1], steps = anchor.index - lastAnchor.index, lastHue = lastAnchor.hue[scheme], lastSat = lastAnchor.sat[scheme], lastLum = lastAnchor.lum[scheme], stepHue = (lastHue - h) / steps, stepSat = (lastSat - s) / steps, stepLum = (lastLum - l) / steps;
      for (let step = lastAnchor.index + 1; step < anchor.index; step++) {
        const str = anchor.index - step;
        add(h + stepHue * str, s + stepSat * str, l + stepLum * str);
      }
    }
    if (add(h, s, l, a), anchorIndex === numAnchors - 1 && palette.length < paletteSize) for (let step = anchor.index + 1; step < paletteSize; step++) add(h, s, l);
  }
  const background = palette[0], foreground = palette[palette.length - 1], transparentValues = [background, foreground].map((color) => {
    const [h, s, l] = parseToHsla(color);
    return [hsla(h, s, l, 0), hsla(h, s, l, 0.2), hsla(h, s, l, 0.4), hsla(h, s, l, 0.6), hsla(h, s, l, 0.8)];
  }), reverseForeground = [...transparentValues[1]].reverse();
  return palette = [...transparentValues[0], ...palette, ...reverseForeground], palette;
}, "generateColorPalette");
function getThemeSuitePalettes(palette) {
  return {
    light: generateColorPalette({
      palette,
      scheme: "light"
    }),
    dark: generateColorPalette({
      palette,
      scheme: "dark"
    })
  };
}
__name(getThemeSuitePalettes, "getThemeSuitePalettes");

// ../../node_modules/.pnpm/@tamagui+theme-builder@2.0._ee9150b47a828b0b24f0ba1152ac75b4/node_modules/@tamagui/theme-builder/dist/esm/createThemes.mjs
function createThemes(props) {
  const {
    accent,
    childrenThemes,
    grandChildrenThemes,
    templates = defaultTemplates,
    componentThemes,
    getTheme
  } = props, builder = createSimpleThemeBuilder({
    extra: props.base.extra,
    accentExtra: accent?.extra,
    componentThemes,
    palettes: createPalettes(getThemesPalettes(props)),
    templates,
    accentTheme: !!accent,
    childrenThemes: normalizeSubThemes(childrenThemes),
    grandChildrenThemes: grandChildrenThemes ? normalizeSubThemes(grandChildrenThemes) : void 0,
    getTheme
  });
  return lastBuilder = builder.themeBuilder, builder.themes;
}
__name(createThemes, "createThemes");
var lastBuilder = null;
function normalizeSubThemes(defs) {
  return Object.fromEntries(Object.entries(defs || {}).map(([name, value]) => {
    const hasPalette = value.palette !== void 0;
    return [name, {
      // Only add palette if the definition has one, otherwise theme is template-only
      ...hasPalette ? {
        palette: name
      } : {},
      template: value.template || "base"
    }];
  }));
}
__name(normalizeSubThemes, "normalizeSubThemes");
var defaultPalettes = createPalettes(getThemesPalettes({
  base: {
    palette: ["#fff", "#000"]
  },
  accent: {
    palette: ["#ff0000", "#ff9999"]
  }
}));
function createSimpleThemeBuilder(props) {
  const {
    getTheme,
    extra,
    accentExtra,
    childrenThemes = null,
    grandChildrenThemes = null,
    templates = defaultTemplates,
    palettes = defaultPalettes,
    accentTheme,
    componentThemes = templates === defaultTemplates ? defaultComponentThemes : void 0
  } = props;
  let themeBuilder = createThemeBuilder().addPalettes(palettes).addTemplates(templates).addThemes({
    light: {
      template: "base",
      palette: "light",
      nonInheritedValues: {
        ...extra?.light,
        ...accentTheme && palettes.light_accent && {
          accent1: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 0],
          accent2: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 1],
          accent3: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 2],
          accent4: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 3],
          accent5: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 4],
          accent6: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 5],
          accent7: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 6],
          accent8: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 7],
          accent9: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 8],
          accent10: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 9],
          accent11: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 10],
          accent12: palettes.light_accent[PALETTE_BACKGROUND_OFFSET + 11]
        }
      }
    },
    dark: {
      template: "base",
      palette: "dark",
      nonInheritedValues: {
        ...extra?.dark,
        ...accentTheme && palettes.dark_accent && {
          accent1: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 0],
          accent2: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 1],
          accent3: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 2],
          accent4: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 3],
          accent5: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 4],
          accent6: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 5],
          accent7: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 6],
          accent8: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 7],
          accent9: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 8],
          accent10: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 9],
          accent11: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 10],
          accent12: palettes.dark_accent[PALETTE_BACKGROUND_OFFSET + 11]
        }
      }
    }
  });
  return palettes.light_accent && (themeBuilder = themeBuilder.addChildThemes({
    accent: [{
      parent: "light",
      template: "base",
      palette: "light_accent",
      nonInheritedValues: accentExtra?.light
    }, {
      parent: "dark",
      template: "base",
      palette: "dark_accent",
      nonInheritedValues: accentExtra?.dark
    }]
  })), childrenThemes && (themeBuilder = themeBuilder.addChildThemes(childrenThemes, {
    avoidNestingWithin: ["accent"]
  })), grandChildrenThemes && (themeBuilder = themeBuilder.addChildThemes(grandChildrenThemes, {
    avoidNestingWithin: ["accent"]
  })), componentThemes && (themeBuilder = themeBuilder.addComponentThemes(getComponentThemes(componentThemes), {
    avoidNestingWithin: [
      // ...Object.keys(childrenThemes || {}),
      ...Object.keys(grandChildrenThemes || {})
    ]
  })), getTheme && (themeBuilder = themeBuilder.getTheme(getTheme)), {
    themeBuilder,
    themes: themeBuilder.build()
  };
}
__name(createSimpleThemeBuilder, "createSimpleThemeBuilder");
function getSchemePalette(colors2) {
  return {
    light: colors2,
    dark: [...colors2].reverse()
  };
}
__name(getSchemePalette, "getSchemePalette");
function getAnchors(palette) {
  const numItems = palette.light.length;
  return palette.light.map((lcolor, index) => {
    const dcolor = palette.dark[index], [lhue, lsat, llum, lalpha] = parseToHsla(lcolor), [dhue, dsat, dlum, dalpha] = parseToHsla(dcolor);
    return {
      index: spreadIndex(11, numItems, index),
      hue: {
        light: lhue,
        dark: dhue
      },
      sat: {
        light: lsat,
        dark: dsat
      },
      lum: {
        light: llum,
        dark: dlum
      },
      alpha: {
        light: lalpha,
        dark: dalpha
      }
    };
  });
}
__name(getAnchors, "getAnchors");
function spreadIndex(maxIndex, numItems, index) {
  return Math.round(index / (numItems - 1) * maxIndex);
}
__name(spreadIndex, "spreadIndex");
function coerceSimplePaletteToSchemePalette(def) {
  return Array.isArray(def) ? getSchemePalette(def) : def;
}
__name(coerceSimplePaletteToSchemePalette, "coerceSimplePaletteToSchemePalette");
function getThemesPalettes(props) {
  const base = coerceSimplePaletteToSchemePalette(props.base.palette), accent = props.accent ? coerceSimplePaletteToSchemePalette(props.accent.palette) : null, baseAnchors = getAnchors(base);
  function getSubThemesPalettes(defs, isGrandChildren = false) {
    return Object.fromEntries(Object.entries(defs).map(([key, value]) => isGrandChildren && key === "accent" && !value.palette ? null : [key, {
      name: key,
      anchors: value.palette ? getAnchors(coerceSimplePaletteToSchemePalette(value.palette)) : baseAnchors
    }]).filter(Boolean));
  }
  __name(getSubThemesPalettes, "getSubThemesPalettes");
  return {
    base: {
      name: "base",
      anchors: baseAnchors
    },
    ...accent && {
      accent: {
        name: "accent",
        anchors: getAnchors(accent)
      }
    },
    ...props.childrenThemes && getSubThemesPalettes(props.childrenThemes, false),
    ...props.grandChildrenThemes && getSubThemesPalettes(props.grandChildrenThemes, true)
  };
}
__name(getThemesPalettes, "getThemesPalettes");
var getComponentThemes = /* @__PURE__ */ __name((components) => Object.fromEntries(Object.entries(components).map(([componentName, {
  template
}]) => [componentName, {
  parent: "",
  template: template || "base"
}])), "getComponentThemes");
function createPalettes(palettes) {
  const accentPalettes = palettes.accent ? getThemeSuitePalettes(palettes.accent) : null, basePalettes = getThemeSuitePalettes(palettes.base);
  return Object.fromEntries(Object.entries(palettes).flatMap(([name, palette]) => {
    const palettes2 = getThemeSuitePalettes(palette), oppositePalettes = name.startsWith("accent") ? basePalettes : accentPalettes || basePalettes;
    if (!oppositePalettes) return [];
    const oppositeLight = oppositePalettes.light, oppositeDark = oppositePalettes.dark, bgOffset = 7;
    return [[name === "base" ? "light" : `light_${name}`, [oppositeLight[bgOffset], ...palettes2.light, oppositeLight[oppositeLight.length - bgOffset - 1]]], [name === "base" ? "dark" : `dark_${name}`, [oppositeDark[oppositeDark.length - bgOffset - 1], ...palettes2.dark, oppositeDark[bgOffset]]]];
  }));
}
__name(createPalettes, "createPalettes");

// ../../node_modules/.pnpm/@tamagui+themes@2.0.0-rc.0__7a3bd2383ffd4867a2dd6d13917ae8c2/node_modules/@tamagui/themes/dist/esm/generated-v5.mjs
function t(a) {
  let res = {};
  for (const [ki, vi] of a) res[ks[ki]] = colors[vi];
  return res;
}
__name(t, "t");
var colors = ["hsla(0, 0%, 10%, 1)", "hsla(0, 0%, 67%, 1)", "hsla(0, 0%, 100%, 0)", "hsla(0, 0%, 97%, 0.2)", "hsla(0, 0%, 97%, 0.4)", "hsla(0, 0%, 97%, 0.6)", "hsla(0, 0%, 97%, 0.8)", "hsla(0, 0%, 100%, 1)", "hsla(0, 0%, 97%, 1)", "hsla(0, 0%, 93%, 1)", "hsla(0, 0%, 87%, 1)", "hsla(0, 0%, 80%, 1)", "hsla(0, 0%, 70%, 1)", "hsla(0, 0%, 59%, 1)", "hsla(0, 0%, 45%, 1)", "hsla(0, 0%, 30%, 1)", "hsla(0, 0%, 20%, 1)", "hsla(0, 0%, 14%, 1)", "hsla(0, 0%, 2%, 1)", "hsla(0, 0%, 2%, 0)", "hsla(0, 0%, 2%, 0.2)", "hsla(0, 0%, 2%, 0.4)", "hsla(0, 0%, 2%, 0.6)", "hsla(0, 0%, 2%, 0.8)", "#090909", "#151515", "#191919", "#232323", "#333", "#444", "#666", "#777", "#858585", "#aaa", "#ccc", "#ffffff", "#fff", "#f8f8f8", "hsl(0, 0%, 93%)", "hsl(0, 0%, 87%)", "hsl(0, 0%, 80%)", "hsl(0, 0%, 70%)", "hsl(0, 0%, 59%)", "hsl(0, 0%, 45%)", "hsl(0, 0%, 30%)", "hsl(0, 0%, 20%)", "hsl(0, 0%, 14%)", "hsl(0, 0%, 2%)", "rgba(255,255,255,1)", "rgba(255,255,255,0)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.8)", "rgba(0,0,0,1)", "rgba(0,0,0,0)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.05)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.15)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.85)", "rgba(255,255,255,0.05)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0.55)", "rgba(255,255,255,0.7)", "rgba(255,255,255,0.85)", "#fcfcfc", "#f9f9f9", "#f0f0f0", "#e8e8e8", "#e0e0e0", "#d9d9d9", "#cecece", "#bbbbbb", "#8d8d8d", "#838383", "#646464", "#202020", "#fbfdff", "#f4faff", "#e6f4fe", "#d5efff", "#c2e5ff", "#acd8fc", "#8ec8f6", "#5eb1ef", "#0090ff", "#0588f0", "#0d74ce", "#113264", "#fffcfc", "#fff7f7", "#feebec", "#ffdbdc", "#ffcdce", "#fdbdbe", "#f4a9aa", "#eb8e90", "#e5484d", "#dc3e42", "#ce2c31", "#641723", "#fdfdf9", "#fefce9", "#fffab8", "#fff394", "#ffe770", "#f3d768", "#e4c767", "#d5ae39", "#ffe629", "#ffdc00", "#9e6c00", "#473b1f", "#fbfefc", "#f4fbf6", "#e6f6eb", "#d6f1df", "#c4e8d1", "#adddc0", "#8eceaa", "#5bb98b", "#30a46c", "#2b9a66", "#218358", "#193b2d", "#fefcfb", "#fff7ed", "#ffefd6", "#ffdfb5", "#ffd19a", "#ffc182", "#f5ae73", "#ec9455", "#f76b15", "#ef5f00", "#cc4e00", "#582d1d", "#fffcfe", "#fef7fb", "#fee9f5", "#fbdcef", "#f6cee7", "#efbfdd", "#e7acd0", "#dd93c2", "#d6409f", "#cf3897", "#c2298a", "#651249", "#fefcfe", "#fbf7fe", "#f7edfe", "#f2e2fc", "#ead5f9", "#e0c4f4", "#d1afec", "#be93e4", "#8e4ec6", "#8347b9", "#8145b5", "#402060", "#fafefd", "#f3fbf9", "#e0f8f3", "#ccf3ea", "#b8eae0", "#a1ded2", "#83cdc1", "#53b9ab", "#12a594", "#0d9b8a", "#008573", "#0d3d38", "hsl(0, 0%, 68%)", "hsl(0, 0%, 65%)", "hsl(0, 0%, 62%)", "hsl(0, 0%, 56%)", "hsl(0, 0%, 53%)", "hsl(0, 0%, 50%)", "hsl(0, 0%, 47%)", "hsl(0, 0%, 44%)", "hsl(0, 0%, 41%)", "hsl(0, 0%, 38%)", "hsl(0, 0%, 32%)", "hsla(0, 0%, 4%, 1)", "hsla(0, 0%, 8%, 1)", "hsla(0, 0%, 27%, 1)", "hsla(0, 0%, 40%, 1)", "hsla(0, 0%, 47%, 1)", "hsla(0, 0%, 52%, 1)", "hsla(0, 0%, 2%, 0.1)", "hsla(0, 0%, 2%, 0.075)", "hsla(0, 0%, 2%, 0.05)", "hsla(0, 0%, 2%, 0.025)", "hsla(0, 0%, 2%, 0.02)", "hsla(0, 0%, 2%, 0.01)", "hsla(0, 0%, 97%, 0.1)", "hsla(0, 0%, 97%, 0.075)", "hsla(0, 0%, 97%, 0.05)", "hsla(0, 0%, 97%, 0.025)", "hsla(0, 0%, 97%, 0.02)", "hsla(0, 0%, 97%, 0.01)", "hsla(0, 0%, 70%, 0.6)", "hsla(0, 0%, 4%, 0)", "hsla(0, 0%, 8%, 0.2)", "hsla(0, 0%, 8%, 0.4)", "hsla(0, 0%, 8%, 0.6)", "hsla(0, 0%, 8%, 0.8)", "hsla(0, 0%, 100%, 0.2)", "hsla(0, 0%, 100%, 0.4)", "hsla(0, 0%, 100%, 0.6)", "hsla(0, 0%, 100%, 0.8)", "rgba(0,0,0,0.45)", "rgba(0,0,0,0.65)", "rgba(0,0,0,0.95)", "rgba(255,255,255,0.45)", "rgba(255,255,255,0.65)", "rgba(255,255,255,0.95)", "#111111", "#222222", "#2a2a2a", "#313131", "#3a3a3a", "#484848", "#606060", "#6e6e6e", "#7b7b7b", "#b4b4b4", "#eeeeee", "#0d1520", "#111927", "#0d2847", "#003362", "#004074", "#104d87", "#205d9e", "#2870bd", "#3b9eff", "#70b8ff", "#c2e6ff", "#191111", "#201314", "#3b1219", "#500f1c", "#611623", "#72232d", "#8c333a", "#b54548", "#ec5d5e", "#ff9592", "#ffd1d9", "#14120b", "#1b180f", "#2d2305", "#362b00", "#433500", "#524202", "#665417", "#836a21", "#ffff57", "#f5e147", "#f6eeb4", "#0e1512", "#121b17", "#132d21", "#113b29", "#174933", "#20573e", "#28684a", "#2f7c57", "#33b074", "#3dd68c", "#b1f1cb", "#17120e", "#1e160f", "#331e0b", "#462100", "#562800", "#66350c", "#7e451d", "#a35829", "#ff801f", "#ffa057", "#ffe0c2", "#191117", "#21121d", "#37172f", "#4b143d", "#591c47", "#692955", "#833869", "#a84885", "#de51a8", "#ff8dcc", "#fdd1ea", "#18111b", "#1e1523", "#301c3b", "#3d224e", "#48295c", "#54346b", "#664282", "#8457aa", "#9a5cd0", "#d19dff", "#ecd9fa", "#0d1514", "#111c1b", "#0d2d2a", "#023b37", "#084843", "#145750", "#1c6961", "#207e73", "#0eb39e", "#0bd8b6", "#adf0dd", "hsla(0, 0%, 100%, 0.1)", "hsla(0, 0%, 100%, 0.075)", "hsla(0, 0%, 100%, 0.05)", "hsla(0, 0%, 100%, 0.025)", "hsla(0, 0%, 100%, 0.02)", "hsla(0, 0%, 100%, 0.01)", "hsla(0, 0%, 8%, 0.1)", "hsla(0, 0%, 8%, 0.075)", "hsla(0, 0%, 8%, 0.05)", "hsla(0, 0%, 8%, 0.025)", "hsla(0, 0%, 8%, 0.02)", "hsla(0, 0%, 8%, 0.01)", "hsla(0, 0%, 27%, 0.6)", "hsla(0, 0%, 4%, 0.2)", "hsla(0, 0%, 4%, 0.4)", "hsla(0, 0%, 4%, 0.6)", "hsla(0, 0%, 4%, 0.8)", "hsla(0, 0%, 99%, 0)", "hsla(0, 0%, 98%, 0.2)", "hsla(0, 0%, 98%, 0.4)", "hsla(0, 0%, 98%, 0.6)", "hsla(0, 0%, 98%, 0.8)", "hsla(0, 0%, 99%, 1)", "hsla(0, 0%, 98%, 1)", "hsla(0, 0%, 94%, 1)", "hsla(0, 0%, 91%, 1)", "hsla(0, 0%, 88%, 1)", "hsla(0, 0%, 85%, 1)", "hsla(0, 0%, 81%, 1)", "hsla(0, 0%, 73%, 1)", "hsla(0, 0%, 55%, 1)", "hsla(0, 0%, 51%, 1)", "hsla(0, 0%, 39%, 1)", "hsla(0, 0%, 13%, 1)", "hsla(0, 0%, 13%, 0)", "hsla(0, 0%, 13%, 0.2)", "hsla(0, 0%, 13%, 0.4)", "hsla(0, 0%, 13%, 0.6)", "hsla(0, 0%, 13%, 0.8)", "hsla(0, 0%, 13%, 0.1)", "hsla(0, 0%, 13%, 0.075)", "hsla(0, 0%, 13%, 0.05)", "hsla(0, 0%, 13%, 0.025)", "hsla(0, 0%, 13%, 0.02)", "hsla(0, 0%, 13%, 0.01)", "hsla(0, 0%, 98%, 0.1)", "hsla(0, 0%, 98%, 0.075)", "hsla(0, 0%, 98%, 0.05)", "hsla(0, 0%, 98%, 0.025)", "hsla(0, 0%, 98%, 0.02)", "hsla(0, 0%, 98%, 0.01)", "hsla(0, 0%, 85%, 0.6)", "hsla(216, 100%, 99%, 0)", "hsla(207, 100%, 98%, 0.2)", "hsla(207, 100%, 98%, 0.4)", "hsla(207, 100%, 98%, 0.6)", "hsla(207, 100%, 98%, 0.8)", "hsla(210, 100%, 99%, 1)", "hsla(207, 100%, 98%, 1)", "hsla(205, 92%, 95%, 1)", "hsla(203, 100%, 92%, 1)", "hsla(206, 100%, 88%, 1)", "hsla(207, 93%, 83%, 1)", "hsla(207, 85%, 76%, 1)", "hsla(206, 82%, 65%, 1)", "hsla(206, 100%, 50%, 1)", "hsla(207, 96%, 48%, 1)", "hsla(208, 88%, 43%, 1)", "hsla(216, 71%, 23%, 1)", "hsla(216, 71%, 23%, 0)", "hsla(216, 71%, 23%, 0.2)", "hsla(216, 71%, 23%, 0.4)", "hsla(216, 71%, 23%, 0.6)", "hsla(216, 71%, 23%, 0.8)", "hsla(216, 71%, 23%, 0.1)", "hsla(216, 71%, 23%, 0.075)", "hsla(216, 71%, 23%, 0.05)", "hsla(216, 71%, 23%, 0.025)", "hsla(216, 71%, 23%, 0.02)", "hsla(216, 71%, 23%, 0.01)", "hsla(207, 100%, 98%, 0.1)", "hsla(207, 100%, 98%, 0.075)", "hsla(207, 100%, 98%, 0.05)", "hsla(207, 100%, 98%, 0.025)", "hsla(207, 100%, 98%, 0.02)", "hsla(207, 100%, 98%, 0.01)", "hsla(207, 93%, 83%, 0.6)", "hsla(0, 100%, 99%, 0)", "hsla(0, 100%, 98%, 0.2)", "hsla(0, 100%, 98%, 0.4)", "hsla(0, 100%, 98%, 0.6)", "hsla(0, 100%, 98%, 0.8)", "hsla(0, 100%, 99%, 1)", "hsla(0, 100%, 98%, 1)", "hsla(357, 90%, 96%, 1)", "hsla(358, 100%, 93%, 1)", "hsla(359, 100%, 90%, 1)", "hsla(359, 94%, 87%, 1)", "hsla(359, 77%, 81%, 1)", "hsla(359, 70%, 74%, 1)", "hsla(358, 75%, 59%, 1)", "hsla(358, 69%, 55%, 1)", "hsla(358, 65%, 49%, 1)", "hsla(351, 63%, 24%, 1)", "hsla(351, 63%, 24%, 0)", "hsla(351, 63%, 24%, 0.2)", "hsla(351, 63%, 24%, 0.4)", "hsla(351, 63%, 24%, 0.6)", "hsla(351, 63%, 24%, 0.8)", "hsla(351, 63%, 24%, 0.1)", "hsla(351, 63%, 24%, 0.075)", "hsla(351, 63%, 24%, 0.05)", "hsla(351, 63%, 24%, 0.025)", "hsla(351, 63%, 24%, 0.02)", "hsla(351, 63%, 24%, 0.01)", "hsla(0, 100%, 98%, 0.1)", "hsla(0, 100%, 98%, 0.075)", "hsla(0, 100%, 98%, 0.05)", "hsla(0, 100%, 98%, 0.025)", "hsla(0, 100%, 98%, 0.02)", "hsla(0, 100%, 98%, 0.01)", "hsla(359, 94%, 87%, 0.6)", "hsla(60, 45%, 98%, 0)", "hsla(54, 91%, 95%, 0.2)", "hsla(54, 91%, 95%, 0.4)", "hsla(54, 91%, 95%, 0.6)", "hsla(54, 91%, 95%, 0.8)", "hsla(60, 50%, 98%, 1)", "hsla(54, 91%, 95%, 1)", "hsla(56, 100%, 86%, 1)", "hsla(53, 100%, 79%, 1)", "hsla(50, 100%, 72%, 1)", "hsla(48, 85%, 68%, 1)", "hsla(46, 70%, 65%, 1)", "hsla(45, 65%, 53%, 1)", "hsla(53, 100%, 58%, 1)", "hsla(52, 100%, 50%, 1)", "hsla(41, 100%, 31%, 1)", "hsla(42, 39%, 20%, 1)", "hsla(42, 39%, 20%, 0)", "hsla(42, 39%, 20%, 0.2)", "hsla(42, 39%, 20%, 0.4)", "hsla(42, 39%, 20%, 0.6)", "hsla(42, 39%, 20%, 0.8)", "hsla(42, 39%, 20%, 0.1)", "hsla(42, 39%, 20%, 0.075)", "hsla(42, 39%, 20%, 0.05)", "hsla(42, 39%, 20%, 0.025)", "hsla(42, 39%, 20%, 0.02)", "hsla(42, 39%, 20%, 0.01)", "hsla(54, 91%, 95%, 0.1)", "hsla(54, 91%, 95%, 0.075)", "hsla(54, 91%, 95%, 0.05)", "hsla(54, 91%, 95%, 0.025)", "hsla(54, 91%, 95%, 0.02)", "hsla(54, 91%, 95%, 0.01)", "hsla(48, 85%, 68%, 0.6)", "hsla(140, 60%, 99%, 0)", "hsla(137, 47%, 97%, 0.2)", "hsla(137, 47%, 97%, 0.4)", "hsla(137, 47%, 97%, 0.6)", "hsla(137, 47%, 97%, 0.8)", "hsla(140, 60%, 99%, 1)", "hsla(137, 47%, 97%, 1)", "hsla(139, 47%, 93%, 1)", "hsla(140, 49%, 89%, 1)", "hsla(142, 44%, 84%, 1)", "hsla(144, 41%, 77%, 1)", "hsla(146, 40%, 68%, 1)", "hsla(151, 40%, 54%, 1)", "hsla(151, 55%, 42%, 1)", "hsla(152, 56%, 39%, 1)", "hsla(154, 60%, 32%, 1)", "hsla(155, 40%, 16%, 1)", "hsla(156, 41%, 16%, 0)", "hsla(156, 41%, 16%, 0.2)", "hsla(156, 41%, 16%, 0.4)", "hsla(156, 41%, 16%, 0.6)", "hsla(156, 41%, 16%, 0.8)", "hsla(156, 41%, 16%, 0.1)", "hsla(156, 41%, 16%, 0.075)", "hsla(156, 41%, 16%, 0.05)", "hsla(156, 41%, 16%, 0.025)", "hsla(156, 41%, 16%, 0.02)", "hsla(156, 41%, 16%, 0.01)", "hsla(137, 47%, 97%, 0.1)", "hsla(137, 47%, 97%, 0.075)", "hsla(137, 47%, 97%, 0.05)", "hsla(137, 47%, 97%, 0.025)", "hsla(137, 47%, 97%, 0.02)", "hsla(137, 47%, 97%, 0.01)", "hsla(144, 41%, 77%, 0.6)", "hsla(20, 60%, 99%, 0)", "hsla(33, 100%, 96%, 0.2)", "hsla(33, 100%, 96%, 0.4)", "hsla(33, 100%, 96%, 0.6)", "hsla(33, 100%, 96%, 0.8)", "hsla(20, 60%, 99%, 1)", "hsla(33, 100%, 96%, 1)", "hsla(37, 100%, 92%, 1)", "hsla(34, 100%, 85%, 1)", "hsla(33, 100%, 80%, 1)", "hsla(30, 100%, 75%, 1)", "hsla(27, 87%, 71%, 1)", "hsla(25, 80%, 63%, 1)", "hsla(23, 93%, 53%, 1)", "hsla(24, 100%, 47%, 1)", "hsla(23, 100%, 40%, 1)", "hsla(16, 50%, 23%, 1)", "hsla(16, 50%, 23%, 0)", "hsla(16, 50%, 23%, 0.2)", "hsla(16, 50%, 23%, 0.4)", "hsla(16, 50%, 23%, 0.6)", "hsla(16, 50%, 23%, 0.8)", "hsla(16, 50%, 23%, 0.1)", "hsla(16, 50%, 23%, 0.075)", "hsla(16, 50%, 23%, 0.05)", "hsla(16, 50%, 23%, 0.025)", "hsla(16, 50%, 23%, 0.02)", "hsla(16, 50%, 23%, 0.01)", "hsla(33, 100%, 96%, 0.1)", "hsla(33, 100%, 96%, 0.075)", "hsla(33, 100%, 96%, 0.05)", "hsla(33, 100%, 96%, 0.025)", "hsla(33, 100%, 96%, 0.02)", "hsla(33, 100%, 96%, 0.01)", "hsla(30, 100%, 75%, 0.6)", "hsla(324, 100%, 99%, 0)", "hsla(326, 78%, 98%, 0.2)", "hsla(326, 78%, 98%, 0.4)", "hsla(326, 78%, 98%, 0.6)", "hsla(326, 78%, 98%, 0.8)", "hsla(320, 100%, 99%, 1)", "hsla(326, 78%, 98%, 1)", "hsla(326, 91%, 95%, 1)", "hsla(323, 79%, 92%, 1)", "hsla(323, 69%, 89%, 1)", "hsla(323, 60%, 84%, 1)", "hsla(323, 55%, 79%, 1)", "hsla(322, 52%, 72%, 1)", "hsla(322, 65%, 55%, 1)", "hsla(322, 61%, 52%, 1)", "hsla(322, 65%, 46%, 1)", "hsla(320, 70%, 23%, 1)", "hsla(320, 69%, 23%, 0)", "hsla(320, 69%, 23%, 0.2)", "hsla(320, 69%, 23%, 0.4)", "hsla(320, 69%, 23%, 0.6)", "hsla(320, 69%, 23%, 0.8)", "hsla(320, 69%, 23%, 0.1)", "hsla(320, 69%, 23%, 0.075)", "hsla(320, 69%, 23%, 0.05)", "hsla(320, 69%, 23%, 0.025)", "hsla(320, 69%, 23%, 0.02)", "hsla(320, 69%, 23%, 0.01)", "hsla(326, 78%, 98%, 0.1)", "hsla(326, 78%, 98%, 0.075)", "hsla(326, 78%, 98%, 0.05)", "hsla(326, 78%, 98%, 0.025)", "hsla(326, 78%, 98%, 0.02)", "hsla(326, 78%, 98%, 0.01)", "hsla(323, 60%, 84%, 0.6)", "hsla(300, 60%, 99%, 0)", "hsla(274, 78%, 98%, 0.2)", "hsla(274, 78%, 98%, 0.4)", "hsla(274, 78%, 98%, 0.6)", "hsla(274, 78%, 98%, 0.8)", "hsla(300, 50%, 99%, 1)", "hsla(274, 78%, 98%, 1)", "hsla(275, 89%, 96%, 1)", "hsla(277, 81%, 94%, 1)", "hsla(275, 75%, 91%, 1)", "hsla(275, 69%, 86%, 1)", "hsla(273, 62%, 81%, 1)", "hsla(272, 60%, 74%, 1)", "hsla(272, 51%, 54%, 1)", "hsla(272, 45%, 50%, 1)", "hsla(272, 45%, 49%, 1)", "hsla(270, 50%, 25%, 1)", "hsla(270, 50%, 25%, 0)", "hsla(270, 50%, 25%, 0.2)", "hsla(270, 50%, 25%, 0.4)", "hsla(270, 50%, 25%, 0.6)", "hsla(270, 50%, 25%, 0.8)", "hsla(270, 50%, 25%, 0.1)", "hsla(270, 50%, 25%, 0.075)", "hsla(270, 50%, 25%, 0.05)", "hsla(270, 50%, 25%, 0.025)", "hsla(270, 50%, 25%, 0.02)", "hsla(270, 50%, 25%, 0.01)", "hsla(274, 78%, 98%, 0.1)", "hsla(274, 78%, 98%, 0.075)", "hsla(274, 78%, 98%, 0.05)", "hsla(274, 78%, 98%, 0.025)", "hsla(274, 78%, 98%, 0.02)", "hsla(274, 78%, 98%, 0.01)", "hsla(275, 69%, 86%, 0.6)", "hsla(160, 60%, 99%, 0)", "hsla(165, 50%, 97%, 0.2)", "hsla(165, 50%, 97%, 0.4)", "hsla(165, 50%, 97%, 0.6)", "hsla(165, 50%, 97%, 0.8)", "hsla(165, 67%, 99%, 1)", "hsla(165, 50%, 97%, 1)", "hsla(167, 63%, 93%, 1)", "hsla(166, 62%, 88%, 1)", "hsla(168, 54%, 82%, 1)", "hsla(168, 48%, 75%, 1)", "hsla(170, 43%, 66%, 1)", "hsla(172, 42%, 53%, 1)", "hsla(173, 80%, 36%, 1)", "hsla(173, 85%, 33%, 1)", "hsla(172, 100%, 26%, 1)", "hsla(174, 65%, 15%, 1)", "hsla(174, 66%, 15%, 0)", "hsla(174, 66%, 15%, 0.2)", "hsla(174, 66%, 15%, 0.4)", "hsla(174, 66%, 15%, 0.6)", "hsla(174, 66%, 15%, 0.8)", "hsla(174, 66%, 15%, 0.1)", "hsla(174, 66%, 15%, 0.075)", "hsla(174, 66%, 15%, 0.05)", "hsla(174, 66%, 15%, 0.025)", "hsla(174, 66%, 15%, 0.02)", "hsla(174, 66%, 15%, 0.01)", "hsla(165, 50%, 97%, 0.1)", "hsla(165, 50%, 97%, 0.075)", "hsla(165, 50%, 97%, 0.05)", "hsla(165, 50%, 97%, 0.025)", "hsla(165, 50%, 97%, 0.02)", "hsla(165, 50%, 97%, 0.01)", "hsla(168, 48%, 75%, 0.6)", "hsla(0, 0%, 68%, 0)", "hsla(0, 0%, 65%, 0.2)", "hsla(0, 0%, 65%, 0.4)", "hsla(0, 0%, 65%, 0.6)", "hsla(0, 0%, 65%, 0.8)", "hsla(0, 0%, 68%, 1)", "hsla(0, 0%, 65%, 1)", "hsla(0, 0%, 62%, 1)", "hsla(0, 0%, 56%, 1)", "hsla(0, 0%, 53%, 1)", "hsla(0, 0%, 50%, 1)", "hsla(0, 0%, 44%, 1)", "hsla(0, 0%, 41%, 1)", "hsla(0, 0%, 38%, 1)", "hsla(0, 0%, 32%, 1)", "hsla(0, 0%, 32%, 0)", "hsla(0, 0%, 32%, 0.2)", "hsla(0, 0%, 32%, 0.4)", "hsla(0, 0%, 32%, 0.6)", "hsla(0, 0%, 32%, 0.8)", "hsla(0, 0%, 32%, 0.1)", "hsla(0, 0%, 32%, 0.075)", "hsla(0, 0%, 32%, 0.05)", "hsla(0, 0%, 32%, 0.025)", "hsla(0, 0%, 32%, 0.02)", "hsla(0, 0%, 32%, 0.01)", "hsla(0, 0%, 65%, 0.1)", "hsla(0, 0%, 65%, 0.075)", "hsla(0, 0%, 65%, 0.05)", "hsla(0, 0%, 65%, 0.025)", "hsla(0, 0%, 65%, 0.02)", "hsla(0, 0%, 65%, 0.01)", "hsla(0, 0%, 53%, 0.6)", "hsla(0, 0%, 7%, 0)", "hsla(0, 0%, 10%, 0.2)", "hsla(0, 0%, 10%, 0.4)", "hsla(0, 0%, 10%, 0.6)", "hsla(0, 0%, 10%, 0.8)", "hsla(0, 0%, 7%, 1)", "hsla(0, 0%, 16%, 1)", "hsla(0, 0%, 19%, 1)", "hsla(0, 0%, 23%, 1)", "hsla(0, 0%, 28%, 1)", "hsla(0, 0%, 43%, 1)", "hsla(0, 0%, 48%, 1)", "hsla(0, 0%, 71%, 1)", "hsla(0, 0%, 93%, 0)", "hsla(0, 0%, 93%, 0.2)", "hsla(0, 0%, 93%, 0.4)", "hsla(0, 0%, 93%, 0.6)", "hsla(0, 0%, 93%, 0.8)", "hsla(0, 0%, 93%, 0.1)", "hsla(0, 0%, 93%, 0.075)", "hsla(0, 0%, 93%, 0.05)", "hsla(0, 0%, 93%, 0.025)", "hsla(0, 0%, 93%, 0.02)", "hsla(0, 0%, 93%, 0.01)", "hsla(0, 0%, 10%, 0.1)", "hsla(0, 0%, 10%, 0.075)", "hsla(0, 0%, 10%, 0.05)", "hsla(0, 0%, 10%, 0.025)", "hsla(0, 0%, 10%, 0.02)", "hsla(0, 0%, 10%, 0.01)", "hsla(0, 0%, 23%, 0.6)", "hsla(216, 43%, 9%, 0)", "hsla(218, 39%, 11%, 0.2)", "hsla(218, 39%, 11%, 0.4)", "hsla(218, 39%, 11%, 0.6)", "hsla(218, 39%, 11%, 0.8)", "hsla(215, 42%, 9%, 1)", "hsla(218, 39%, 11%, 1)", "hsla(212, 69%, 16%, 1)", "hsla(209, 100%, 19%, 1)", "hsla(207, 100%, 23%, 1)", "hsla(209, 79%, 30%, 1)", "hsla(211, 66%, 37%, 1)", "hsla(211, 65%, 45%, 1)", "hsla(210, 100%, 62%, 1)", "hsla(210, 100%, 72%, 1)", "hsla(205, 100%, 88%, 1)", "hsla(205, 100%, 88%, 0)", "hsla(205, 100%, 88%, 0.2)", "hsla(205, 100%, 88%, 0.4)", "hsla(205, 100%, 88%, 0.6)", "hsla(205, 100%, 88%, 0.8)", "hsla(205, 100%, 88%, 0.1)", "hsla(205, 100%, 88%, 0.075)", "hsla(205, 100%, 88%, 0.05)", "hsla(205, 100%, 88%, 0.025)", "hsla(205, 100%, 88%, 0.02)", "hsla(205, 100%, 88%, 0.01)", "hsla(218, 39%, 11%, 0.1)", "hsla(218, 39%, 11%, 0.075)", "hsla(218, 39%, 11%, 0.05)", "hsla(218, 39%, 11%, 0.025)", "hsla(218, 39%, 11%, 0.02)", "hsla(218, 39%, 11%, 0.01)", "hsla(209, 79%, 30%, 0.6)", "hsla(0, 17%, 8%, 0)", "hsla(355, 25%, 10%, 0.2)", "hsla(355, 25%, 10%, 0.4)", "hsla(355, 25%, 10%, 0.6)", "hsla(355, 25%, 10%, 0.8)", "hsla(0, 19%, 8%, 1)", "hsla(355, 25%, 10%, 1)", "hsla(350, 53%, 15%, 1)", "hsla(348, 68%, 19%, 1)", "hsla(350, 63%, 23%, 1)", "hsla(352, 53%, 29%, 1)", "hsla(355, 47%, 37%, 1)", "hsla(358, 45%, 49%, 1)", "hsla(360, 79%, 65%, 1)", "hsla(2, 100%, 79%, 1)", "hsla(350, 100%, 91%, 1)", "hsla(350, 100%, 91%, 0)", "hsla(350, 100%, 91%, 0.2)", "hsla(350, 100%, 91%, 0.4)", "hsla(350, 100%, 91%, 0.6)", "hsla(350, 100%, 91%, 0.8)", "hsla(350, 100%, 91%, 0.1)", "hsla(350, 100%, 91%, 0.075)", "hsla(350, 100%, 91%, 0.05)", "hsla(350, 100%, 91%, 0.025)", "hsla(350, 100%, 91%, 0.02)", "hsla(350, 100%, 91%, 0.01)", "hsla(355, 25%, 10%, 0.1)", "hsla(355, 25%, 10%, 0.075)", "hsla(355, 25%, 10%, 0.05)", "hsla(355, 25%, 10%, 0.025)", "hsla(355, 25%, 10%, 0.02)", "hsla(355, 25%, 10%, 0.01)", "hsla(352, 53%, 29%, 0.6)", "hsla(47, 29%, 6%, 0)", "hsla(45, 29%, 8%, 0.2)", "hsla(45, 29%, 8%, 0.4)", "hsla(45, 29%, 8%, 0.6)", "hsla(45, 29%, 8%, 0.8)", "hsla(47, 29%, 6%, 1)", "hsla(45, 29%, 8%, 1)", "hsla(45, 80%, 10%, 1)", "hsla(48, 100%, 11%, 1)", "hsla(47, 100%, 13%, 1)", "hsla(48, 95%, 16%, 1)", "hsla(46, 63%, 25%, 1)", "hsla(45, 60%, 32%, 1)", "hsla(60, 100%, 67%, 1)", "hsla(53, 90%, 62%, 1)", "hsla(53, 79%, 84%, 1)", "hsla(53, 78%, 84%, 0)", "hsla(53, 78%, 84%, 0.2)", "hsla(53, 78%, 84%, 0.4)", "hsla(53, 78%, 84%, 0.6)", "hsla(53, 78%, 84%, 0.8)", "hsla(53, 78%, 84%, 0.1)", "hsla(53, 78%, 84%, 0.075)", "hsla(53, 78%, 84%, 0.05)", "hsla(53, 78%, 84%, 0.025)", "hsla(53, 78%, 84%, 0.02)", "hsla(53, 78%, 84%, 0.01)", "hsla(45, 29%, 8%, 0.1)", "hsla(45, 29%, 8%, 0.075)", "hsla(45, 29%, 8%, 0.05)", "hsla(45, 29%, 8%, 0.025)", "hsla(45, 29%, 8%, 0.02)", "hsla(45, 29%, 8%, 0.01)", "hsla(48, 95%, 16%, 0.6)", "hsla(154, 20%, 7%, 0)", "hsla(153, 20%, 9%, 0.2)", "hsla(153, 20%, 9%, 0.4)", "hsla(153, 20%, 9%, 0.6)", "hsla(153, 20%, 9%, 0.8)", "hsla(154, 20%, 7%, 1)", "hsla(153, 20%, 9%, 1)", "hsla(152, 41%, 13%, 1)", "hsla(154, 55%, 15%, 1)", "hsla(154, 52%, 19%, 1)", "hsla(153, 46%, 23%, 1)", "hsla(152, 44%, 28%, 1)", "hsla(151, 45%, 34%, 1)", "hsla(151, 55%, 45%, 1)", "hsla(151, 65%, 54%, 1)", "hsla(144, 70%, 82%, 1)", "hsla(144, 70%, 82%, 0)", "hsla(144, 70%, 82%, 0.2)", "hsla(144, 70%, 82%, 0.4)", "hsla(144, 70%, 82%, 0.6)", "hsla(144, 70%, 82%, 0.8)", "hsla(144, 70%, 82%, 0.1)", "hsla(144, 70%, 82%, 0.075)", "hsla(144, 70%, 82%, 0.05)", "hsla(144, 70%, 82%, 0.025)", "hsla(144, 70%, 82%, 0.02)", "hsla(144, 70%, 82%, 0.01)", "hsla(153, 20%, 9%, 0.1)", "hsla(153, 20%, 9%, 0.075)", "hsla(153, 20%, 9%, 0.05)", "hsla(153, 20%, 9%, 0.025)", "hsla(153, 20%, 9%, 0.02)", "hsla(153, 20%, 9%, 0.01)", "hsla(153, 46%, 23%, 0.6)", "hsla(23, 22%, 7%, 0)", "hsla(28, 33%, 9%, 0.2)", "hsla(28, 33%, 9%, 0.4)", "hsla(28, 33%, 9%, 0.6)", "hsla(28, 33%, 9%, 0.8)", "hsla(27, 24%, 7%, 1)", "hsla(28, 33%, 9%, 1)", "hsla(29, 65%, 12%, 1)", "hsla(28, 100%, 14%, 1)", "hsla(28, 100%, 17%, 1)", "hsla(27, 79%, 22%, 1)", "hsla(25, 63%, 30%, 1)", "hsla(23, 60%, 40%, 1)", "hsla(26, 100%, 56%, 1)", "hsla(26, 100%, 67%, 1)", "hsla(30, 100%, 88%, 1)", "hsla(30, 100%, 88%, 0)", "hsla(30, 100%, 88%, 0.2)", "hsla(30, 100%, 88%, 0.4)", "hsla(30, 100%, 88%, 0.6)", "hsla(30, 100%, 88%, 0.8)", "hsla(30, 100%, 88%, 0.1)", "hsla(30, 100%, 88%, 0.075)", "hsla(30, 100%, 88%, 0.05)", "hsla(30, 100%, 88%, 0.025)", "hsla(30, 100%, 88%, 0.02)", "hsla(30, 100%, 88%, 0.01)", "hsla(28, 33%, 9%, 0.1)", "hsla(28, 33%, 9%, 0.075)", "hsla(28, 33%, 9%, 0.05)", "hsla(28, 33%, 9%, 0.025)", "hsla(28, 33%, 9%, 0.02)", "hsla(28, 33%, 9%, 0.01)", "hsla(27, 79%, 22%, 0.6)", "hsla(317, 17%, 8%, 0)", "hsla(316, 29%, 10%, 0.2)", "hsla(316, 29%, 10%, 0.4)", "hsla(316, 29%, 10%, 0.6)", "hsla(316, 29%, 10%, 0.8)", "hsla(315, 19%, 8%, 1)", "hsla(316, 29%, 10%, 1)", "hsla(315, 41%, 15%, 1)", "hsla(315, 58%, 19%, 1)", "hsla(318, 52%, 23%, 1)", "hsla(319, 44%, 29%, 1)", "hsla(321, 40%, 37%, 1)", "hsla(322, 40%, 47%, 1)", "hsla(323, 68%, 59%, 1)", "hsla(327, 100%, 78%, 1)", "hsla(326, 92%, 91%, 1)", "hsla(326, 91%, 91%, 0)", "hsla(326, 91%, 91%, 0.2)", "hsla(326, 91%, 91%, 0.4)", "hsla(326, 91%, 91%, 0.6)", "hsla(326, 91%, 91%, 0.8)", "hsla(326, 91%, 91%, 0.1)", "hsla(326, 91%, 91%, 0.075)", "hsla(326, 91%, 91%, 0.05)", "hsla(326, 91%, 91%, 0.025)", "hsla(326, 91%, 91%, 0.02)", "hsla(326, 91%, 91%, 0.01)", "hsla(316, 29%, 10%, 0.1)", "hsla(316, 29%, 10%, 0.075)", "hsla(316, 29%, 10%, 0.05)", "hsla(316, 29%, 10%, 0.025)", "hsla(316, 29%, 10%, 0.02)", "hsla(316, 29%, 10%, 0.01)", "hsla(319, 44%, 29%, 0.6)", "hsla(282, 22%, 9%, 0)", "hsla(279, 25%, 11%, 0.2)", "hsla(279, 25%, 11%, 0.4)", "hsla(279, 25%, 11%, 0.6)", "hsla(279, 25%, 11%, 0.8)", "hsla(282, 23%, 9%, 1)", "hsla(279, 25%, 11%, 1)", "hsla(279, 36%, 17%, 1)", "hsla(277, 39%, 22%, 1)", "hsla(276, 38%, 26%, 1)", "hsla(275, 35%, 31%, 1)", "hsla(274, 33%, 38%, 1)", "hsla(273, 33%, 50%, 1)", "hsla(272, 55%, 59%, 1)", "hsla(272, 100%, 81%, 1)", "hsla(275, 77%, 92%, 1)", "hsla(275, 76%, 92%, 0)", "hsla(275, 76%, 92%, 0.2)", "hsla(275, 76%, 92%, 0.4)", "hsla(275, 76%, 92%, 0.6)", "hsla(275, 76%, 92%, 0.8)", "hsla(275, 76%, 92%, 0.1)", "hsla(275, 76%, 92%, 0.075)", "hsla(275, 76%, 92%, 0.05)", "hsla(275, 76%, 92%, 0.025)", "hsla(275, 76%, 92%, 0.02)", "hsla(275, 76%, 92%, 0.01)", "hsla(279, 25%, 11%, 0.1)", "hsla(279, 25%, 11%, 0.075)", "hsla(279, 25%, 11%, 0.05)", "hsla(279, 25%, 11%, 0.025)", "hsla(279, 25%, 11%, 0.02)", "hsla(279, 25%, 11%, 0.01)", "hsla(275, 35%, 31%, 0.6)", "hsla(173, 22%, 7%, 0)", "hsla(175, 24%, 9%, 0.2)", "hsla(175, 24%, 9%, 0.4)", "hsla(175, 24%, 9%, 0.6)", "hsla(175, 24%, 9%, 0.8)", "hsla(173, 24%, 7%, 1)", "hsla(175, 24%, 9%, 1)", "hsla(174, 55%, 11%, 1)", "hsla(176, 93%, 12%, 1)", "hsla(175, 80%, 16%, 1)", "hsla(174, 63%, 21%, 1)", "hsla(174, 58%, 26%, 1)", "hsla(173, 59%, 31%, 1)", "hsla(172, 85%, 38%, 1)", "hsla(170, 90%, 45%, 1)", "hsla(163, 69%, 81%, 1)", "hsla(163, 69%, 81%, 0)", "hsla(163, 69%, 81%, 0.2)", "hsla(163, 69%, 81%, 0.4)", "hsla(163, 69%, 81%, 0.6)", "hsla(163, 69%, 81%, 0.8)", "hsla(163, 69%, 81%, 0.1)", "hsla(163, 69%, 81%, 0.075)", "hsla(163, 69%, 81%, 0.05)", "hsla(163, 69%, 81%, 0.025)", "hsla(163, 69%, 81%, 0.02)", "hsla(163, 69%, 81%, 0.01)", "hsla(175, 24%, 9%, 0.1)", "hsla(175, 24%, 9%, 0.075)", "hsla(175, 24%, 9%, 0.05)", "hsla(175, 24%, 9%, 0.025)", "hsla(175, 24%, 9%, 0.02)", "hsla(175, 24%, 9%, 0.01)", "hsla(174, 63%, 21%, 0.6)", "hsla(0, 0%, 99%, 0.2)", "hsla(0, 0%, 99%, 0.4)", "hsla(0, 0%, 99%, 0.6)", "hsla(0, 0%, 99%, 0.8)", "hsla(216, 100%, 99%, 0.2)", "hsla(216, 100%, 99%, 0.4)", "hsla(216, 100%, 99%, 0.6)", "hsla(216, 100%, 99%, 0.8)", "hsla(0, 100%, 99%, 0.2)", "hsla(0, 100%, 99%, 0.4)", "hsla(0, 100%, 99%, 0.6)", "hsla(0, 100%, 99%, 0.8)", "hsla(60, 45%, 98%, 0.2)", "hsla(60, 45%, 98%, 0.4)", "hsla(60, 45%, 98%, 0.6)", "hsla(60, 45%, 98%, 0.8)", "hsla(140, 60%, 99%, 0.2)", "hsla(140, 60%, 99%, 0.4)", "hsla(140, 60%, 99%, 0.6)", "hsla(140, 60%, 99%, 0.8)", "hsla(20, 60%, 99%, 0.2)", "hsla(20, 60%, 99%, 0.4)", "hsla(20, 60%, 99%, 0.6)", "hsla(20, 60%, 99%, 0.8)", "hsla(324, 100%, 99%, 0.2)", "hsla(324, 100%, 99%, 0.4)", "hsla(324, 100%, 99%, 0.6)", "hsla(324, 100%, 99%, 0.8)", "hsla(300, 60%, 99%, 0.2)", "hsla(300, 60%, 99%, 0.4)", "hsla(300, 60%, 99%, 0.6)", "hsla(300, 60%, 99%, 0.8)", "hsla(160, 60%, 99%, 0.2)", "hsla(160, 60%, 99%, 0.4)", "hsla(160, 60%, 99%, 0.6)", "hsla(160, 60%, 99%, 0.8)", "hsla(0, 0%, 68%, 0.2)", "hsla(0, 0%, 68%, 0.4)", "hsla(0, 0%, 68%, 0.6)", "hsla(0, 0%, 68%, 0.8)", "hsla(0, 0%, 7%, 0.2)", "hsla(0, 0%, 7%, 0.4)", "hsla(0, 0%, 7%, 0.6)", "hsla(0, 0%, 7%, 0.8)", "hsla(216, 43%, 9%, 0.2)", "hsla(216, 43%, 9%, 0.4)", "hsla(216, 43%, 9%, 0.6)", "hsla(216, 43%, 9%, 0.8)", "hsla(0, 17%, 8%, 0.2)", "hsla(0, 17%, 8%, 0.4)", "hsla(0, 17%, 8%, 0.6)", "hsla(0, 17%, 8%, 0.8)", "hsla(47, 29%, 6%, 0.2)", "hsla(47, 29%, 6%, 0.4)", "hsla(47, 29%, 6%, 0.6)", "hsla(47, 29%, 6%, 0.8)", "hsla(154, 20%, 7%, 0.2)", "hsla(154, 20%, 7%, 0.4)", "hsla(154, 20%, 7%, 0.6)", "hsla(154, 20%, 7%, 0.8)", "hsla(23, 22%, 7%, 0.2)", "hsla(23, 22%, 7%, 0.4)", "hsla(23, 22%, 7%, 0.6)", "hsla(23, 22%, 7%, 0.8)", "hsla(317, 17%, 8%, 0.2)", "hsla(317, 17%, 8%, 0.4)", "hsla(317, 17%, 8%, 0.6)", "hsla(317, 17%, 8%, 0.8)", "hsla(282, 22%, 9%, 0.2)", "hsla(282, 22%, 9%, 0.4)", "hsla(282, 22%, 9%, 0.6)", "hsla(282, 22%, 9%, 0.8)", "hsla(173, 22%, 7%, 0.2)", "hsla(173, 22%, 7%, 0.4)", "hsla(173, 22%, 7%, 0.6)", "hsla(173, 22%, 7%, 0.8)"];
var ks = ["accentBackground", "accentColor", "background0", "background02", "background04", "background06", "background08", "color1", "color2", "color3", "color4", "color5", "color6", "color7", "color8", "color9", "color10", "color11", "color12", "color0", "color02", "color04", "color06", "color08", "color", "colorHover", "colorPress", "colorFocus", "background", "backgroundHover", "backgroundPress", "backgroundFocus", "backgroundActive", "borderColor", "borderColorHover", "borderColorFocus", "borderColorPress", "placeholderColor", "colorTransparent", "black1", "black2", "black3", "black4", "black5", "black6", "black7", "black8", "black9", "black10", "black11", "black12", "white1", "white2", "white3", "white4", "white5", "white6", "white7", "white8", "white9", "white10", "white11", "white12", "white", "white0", "white02", "white04", "white06", "white08", "black", "black0", "black02", "black04", "black06", "black08", "shadow1", "shadow2", "shadow3", "shadow4", "shadow5", "shadow6", "shadow7", "shadow8", "highlight1", "highlight2", "highlight3", "highlight4", "highlight5", "highlight6", "highlight7", "highlight8", "shadowColor", "gray1", "gray2", "gray3", "gray4", "gray5", "gray6", "gray7", "gray8", "gray9", "gray10", "gray11", "gray12", "blue1", "blue2", "blue3", "blue4", "blue5", "blue6", "blue7", "blue8", "blue9", "blue10", "blue11", "blue12", "red1", "red2", "red3", "red4", "red5", "red6", "red7", "red8", "red9", "red10", "red11", "red12", "yellow1", "yellow2", "yellow3", "yellow4", "yellow5", "yellow6", "yellow7", "yellow8", "yellow9", "yellow10", "yellow11", "yellow12", "green1", "green2", "green3", "green4", "green5", "green6", "green7", "green8", "green9", "green10", "green11", "green12", "orange1", "orange2", "orange3", "orange4", "orange5", "orange6", "orange7", "orange8", "orange9", "orange10", "orange11", "orange12", "pink1", "pink2", "pink3", "pink4", "pink5", "pink6", "pink7", "pink8", "pink9", "pink10", "pink11", "pink12", "purple1", "purple2", "purple3", "purple4", "purple5", "purple6", "purple7", "purple8", "purple9", "purple10", "purple11", "purple12", "teal1", "teal2", "teal3", "teal4", "teal5", "teal6", "teal7", "teal8", "teal9", "teal10", "teal11", "teal12", "neutral1", "neutral2", "neutral3", "neutral4", "neutral5", "neutral6", "neutral7", "neutral8", "neutral9", "neutral10", "neutral11", "neutral12", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "accent7", "accent8", "accent9", "accent10", "accent11", "accent12", "color01", "color0075", "color005", "color0025", "color002", "color001", "background01", "background0075", "background005", "background0025", "background002", "background001", "outlineColor"];
var n1 = t([[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 18], [25, 18], [26, 18], [27, 23], [28, 8], [29, 7], [30, 9], [31, 9], [32, 8], [33, 10], [34, 9], [35, 10], [36, 11], [37, 15], [38, 19], [39, 24], [40, 25], [41, 26], [42, 27], [43, 28], [44, 29], [45, 30], [46, 31], [47, 32], [48, 33], [49, 34], [50, 35], [51, 36], [52, 37], [53, 38], [54, 39], [55, 40], [56, 41], [57, 42], [58, 43], [59, 44], [60, 45], [61, 46], [62, 47], [63, 48], [64, 49], [65, 50], [66, 51], [67, 52], [68, 53], [69, 54], [70, 55], [71, 56], [72, 57], [73, 58], [74, 59], [75, 60], [76, 61], [77, 62], [78, 63], [79, 57], [80, 64], [81, 65], [82, 66], [83, 67], [84, 68], [85, 69], [86, 70], [87, 51], [88, 71], [89, 72], [90, 73], [91, 62], [92, 74], [93, 75], [94, 76], [95, 77], [96, 78], [97, 79], [98, 80], [99, 81], [100, 82], [101, 83], [102, 84], [103, 85], [104, 86], [105, 87], [106, 88], [107, 89], [108, 90], [109, 91], [110, 92], [111, 93], [112, 94], [113, 95], [114, 96], [115, 97], [116, 98], [117, 99], [118, 100], [119, 101], [120, 102], [121, 103], [122, 104], [123, 105], [124, 106], [125, 107], [126, 108], [127, 109], [128, 110], [129, 111], [130, 112], [131, 113], [132, 114], [133, 115], [134, 116], [135, 117], [136, 118], [137, 119], [138, 120], [139, 121], [140, 122], [141, 123], [142, 124], [143, 125], [144, 126], [145, 127], [146, 128], [147, 129], [148, 130], [149, 131], [150, 132], [151, 133], [152, 134], [153, 135], [154, 136], [155, 137], [156, 138], [157, 139], [158, 140], [159, 141], [160, 142], [161, 143], [162, 144], [163, 145], [164, 146], [165, 147], [166, 148], [167, 149], [168, 150], [169, 151], [170, 152], [171, 153], [172, 154], [173, 155], [174, 156], [175, 157], [176, 158], [177, 159], [178, 160], [179, 161], [180, 162], [181, 163], [182, 164], [183, 165], [184, 166], [185, 167], [186, 168], [187, 169], [188, 170], [189, 171], [190, 172], [191, 173], [192, 174], [193, 175], [194, 176], [195, 177], [196, 178], [197, 179], [198, 180], [199, 181], [200, 182], [201, 183], [202, 184], [203, 42], [204, 185], [205, 186], [206, 187], [207, 188], [208, 189], [209, 190], [210, 191], [211, 192], [212, 193], [213, 194], [214, 0], [215, 17], [216, 16], [217, 195], [218, 196], [219, 197], [220, 198], [221, 1], [222, 11], [223, 7], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [236, 211]]);
var n2 = t([[0, 16], [1, 9], [2, 212], [3, 213], [4, 214], [5, 215], [6, 216], [7, 193], [8, 194], [9, 0], [10, 17], [11, 16], [12, 195], [13, 196], [14, 197], [15, 198], [16, 1], [17, 11], [18, 7], [19, 2], [20, 217], [21, 218], [22, 219], [23, 220], [24, 7], [25, 220], [26, 7], [27, 11], [28, 194], [29, 0], [30, 193], [31, 0], [32, 194], [33, 17], [34, 16], [35, 17], [36, 0], [37, 198], [38, 2], [39, 24], [40, 25], [41, 26], [42, 27], [43, 28], [44, 29], [45, 30], [46, 31], [47, 32], [48, 33], [49, 34], [50, 35], [51, 36], [52, 37], [53, 38], [54, 39], [55, 40], [56, 41], [57, 42], [58, 43], [59, 44], [60, 45], [61, 46], [62, 47], [63, 48], [64, 49], [65, 50], [66, 51], [67, 52], [68, 53], [69, 54], [70, 55], [71, 56], [72, 57], [73, 58], [74, 59], [75, 61], [76, 56], [77, 63], [78, 221], [79, 222], [80, 66], [81, 223], [82, 54], [83, 68], [84, 50], [85, 70], [86, 224], [87, 225], [88, 73], [89, 226], [90, 48], [91, 63], [92, 227], [93, 26], [94, 228], [95, 229], [96, 230], [97, 231], [98, 232], [99, 233], [100, 234], [101, 235], [102, 236], [103, 237], [104, 238], [105, 239], [106, 240], [107, 241], [108, 242], [109, 243], [110, 244], [111, 245], [112, 94], [113, 246], [114, 247], [115, 248], [116, 249], [117, 250], [118, 251], [119, 252], [120, 253], [121, 254], [122, 255], [123, 256], [124, 106], [125, 257], [126, 258], [127, 259], [128, 260], [129, 261], [130, 262], [131, 263], [132, 264], [133, 265], [134, 266], [135, 267], [136, 118], [137, 268], [138, 269], [139, 270], [140, 271], [141, 272], [142, 273], [143, 274], [144, 275], [145, 276], [146, 277], [147, 278], [148, 130], [149, 279], [150, 280], [151, 281], [152, 282], [153, 283], [154, 284], [155, 285], [156, 286], [157, 287], [158, 288], [159, 289], [160, 142], [161, 290], [162, 291], [163, 292], [164, 293], [165, 294], [166, 295], [167, 296], [168, 297], [169, 298], [170, 299], [171, 300], [172, 154], [173, 301], [174, 302], [175, 303], [176, 304], [177, 305], [178, 306], [179, 307], [180, 308], [181, 309], [182, 310], [183, 311], [184, 166], [185, 312], [186, 313], [187, 314], [188, 315], [189, 316], [190, 317], [191, 318], [192, 319], [193, 320], [194, 321], [195, 322], [196, 178], [197, 323], [198, 324], [199, 325], [200, 182], [201, 183], [202, 184], [203, 42], [204, 185], [205, 186], [206, 187], [207, 188], [208, 189], [209, 190], [210, 191], [211, 192], [212, 7], [213, 8], [214, 9], [215, 10], [216, 11], [217, 12], [218, 13], [219, 14], [220, 15], [221, 16], [222, 17], [223, 18], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [236, 338]]);
var n3 = t([[0, 1], [1, 0], [2, 19], [3, 3], [4, 4], [5, 5], [6, 6], [7, 18], [8, 17], [9, 16], [10, 15], [11, 14], [12, 13], [13, 12], [14, 11], [15, 10], [16, 9], [17, 8], [18, 7], [19, 2], [20, 217], [21, 218], [22, 219], [23, 220], [24, 7], [25, 7], [26, 7], [27, 220], [28, 17], [29, 18], [30, 16], [31, 16], [32, 17], [33, 15], [34, 16], [35, 15], [36, 14], [37, 10], [38, 2], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [236, 211]]);
var n4 = t([[0, 9], [1, 16], [2, 2], [3, 213], [4, 214], [5, 215], [6, 216], [7, 7], [8, 11], [9, 1], [10, 198], [11, 197], [12, 196], [13, 195], [14, 16], [15, 17], [16, 0], [17, 194], [18, 193], [19, 212], [20, 339], [21, 340], [22, 341], [23, 342], [24, 193], [25, 342], [26, 193], [27, 194], [28, 11], [29, 1], [30, 7], [31, 1], [32, 11], [33, 198], [34, 197], [35, 198], [36, 1], [37, 17], [38, 212], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [236, 338]]);
var n5 = t([[0, 0], [1, 1], [2, 212], [3, 213], [4, 214], [5, 215], [6, 216], [7, 193], [8, 194], [9, 0], [10, 17], [11, 16], [12, 195], [13, 196], [14, 197], [15, 198], [16, 1], [17, 11], [18, 7], [19, 2], [20, 217], [21, 218], [22, 219], [23, 220], [24, 7], [25, 7], [26, 7], [27, 220], [28, 194], [29, 193], [30, 0], [31, 0], [32, 194], [33, 17], [34, 0], [35, 17], [36, 16], [37, 198], [38, 2], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [236, 338]]);
var n6 = t([[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 18], [25, 18], [26, 18], [27, 23], [28, 8], [29, 7], [30, 9], [31, 9], [32, 8], [33, 10], [34, 9], [35, 10], [36, 11], [37, 15], [38, 19], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [236, 211]]);
var n7 = t([[0, 0], [1, 1], [2, 343], [3, 344], [4, 345], [5, 346], [6, 347], [7, 348], [8, 349], [9, 350], [10, 351], [11, 352], [12, 353], [13, 354], [14, 355], [15, 356], [16, 357], [17, 358], [18, 359], [19, 360], [20, 361], [21, 362], [22, 363], [23, 364], [24, 359], [25, 359], [26, 359], [27, 364], [28, 349], [29, 348], [30, 350], [31, 350], [32, 349], [33, 351], [34, 350], [35, 351], [36, 352], [37, 356], [38, 360], [224, 365], [225, 366], [226, 367], [227, 368], [228, 369], [229, 370], [230, 371], [231, 372], [232, 373], [233, 374], [234, 375], [235, 376], [236, 377]]);
var n8 = t([[0, 0], [1, 1], [2, 378], [3, 379], [4, 380], [5, 381], [6, 382], [7, 383], [8, 384], [9, 385], [10, 386], [11, 387], [12, 388], [13, 389], [14, 390], [15, 391], [16, 392], [17, 393], [18, 394], [19, 395], [20, 396], [21, 397], [22, 398], [23, 399], [24, 394], [25, 394], [26, 394], [27, 399], [28, 384], [29, 383], [30, 385], [31, 385], [32, 384], [33, 386], [34, 385], [35, 386], [36, 387], [37, 391], [38, 395], [224, 400], [225, 401], [226, 402], [227, 403], [228, 404], [229, 405], [230, 406], [231, 407], [232, 408], [233, 409], [234, 410], [235, 411], [236, 412]]);
var n9 = t([[0, 0], [1, 1], [2, 413], [3, 414], [4, 415], [5, 416], [6, 417], [7, 418], [8, 419], [9, 420], [10, 421], [11, 422], [12, 423], [13, 424], [14, 425], [15, 426], [16, 427], [17, 428], [18, 429], [19, 430], [20, 431], [21, 432], [22, 433], [23, 434], [24, 429], [25, 429], [26, 429], [27, 434], [28, 419], [29, 418], [30, 420], [31, 420], [32, 419], [33, 421], [34, 420], [35, 421], [36, 422], [37, 426], [38, 430], [224, 435], [225, 436], [226, 437], [227, 438], [228, 439], [229, 440], [230, 441], [231, 442], [232, 443], [233, 444], [234, 445], [235, 446], [236, 447]]);
var n10 = t([[0, 0], [1, 1], [2, 448], [3, 449], [4, 450], [5, 451], [6, 452], [7, 453], [8, 454], [9, 455], [10, 456], [11, 457], [12, 458], [13, 459], [14, 460], [15, 461], [16, 462], [17, 463], [18, 464], [19, 465], [20, 466], [21, 467], [22, 468], [23, 469], [24, 464], [25, 464], [26, 464], [27, 469], [28, 454], [29, 453], [30, 455], [31, 455], [32, 454], [33, 456], [34, 455], [35, 456], [36, 457], [37, 461], [38, 465], [224, 470], [225, 471], [226, 472], [227, 473], [228, 474], [229, 475], [230, 476], [231, 477], [232, 478], [233, 479], [234, 480], [235, 481], [236, 482]]);
var n11 = t([[0, 0], [1, 1], [2, 483], [3, 484], [4, 485], [5, 486], [6, 487], [7, 488], [8, 489], [9, 490], [10, 491], [11, 492], [12, 493], [13, 494], [14, 495], [15, 496], [16, 497], [17, 498], [18, 499], [19, 500], [20, 501], [21, 502], [22, 503], [23, 504], [24, 499], [25, 499], [26, 499], [27, 504], [28, 489], [29, 488], [30, 490], [31, 490], [32, 489], [33, 491], [34, 490], [35, 491], [36, 492], [37, 496], [38, 500], [224, 505], [225, 506], [226, 507], [227, 508], [228, 509], [229, 510], [230, 511], [231, 512], [232, 513], [233, 514], [234, 515], [235, 516], [236, 517]]);
var n12 = t([[0, 0], [1, 1], [2, 518], [3, 519], [4, 520], [5, 521], [6, 522], [7, 523], [8, 524], [9, 525], [10, 526], [11, 527], [12, 528], [13, 529], [14, 530], [15, 531], [16, 532], [17, 533], [18, 534], [19, 535], [20, 536], [21, 537], [22, 538], [23, 539], [24, 534], [25, 534], [26, 534], [27, 539], [28, 524], [29, 523], [30, 525], [31, 525], [32, 524], [33, 526], [34, 525], [35, 526], [36, 527], [37, 531], [38, 535], [224, 540], [225, 541], [226, 542], [227, 543], [228, 544], [229, 545], [230, 546], [231, 547], [232, 548], [233, 549], [234, 550], [235, 551], [236, 552]]);
var n13 = t([[0, 0], [1, 1], [2, 553], [3, 554], [4, 555], [5, 556], [6, 557], [7, 558], [8, 559], [9, 560], [10, 561], [11, 562], [12, 563], [13, 564], [14, 565], [15, 566], [16, 567], [17, 568], [18, 569], [19, 570], [20, 571], [21, 572], [22, 573], [23, 574], [24, 569], [25, 569], [26, 569], [27, 574], [28, 559], [29, 558], [30, 560], [31, 560], [32, 559], [33, 561], [34, 560], [35, 561], [36, 562], [37, 566], [38, 570], [224, 575], [225, 576], [226, 577], [227, 578], [228, 579], [229, 580], [230, 581], [231, 582], [232, 583], [233, 584], [234, 585], [235, 586], [236, 587]]);
var n14 = t([[0, 0], [1, 1], [2, 588], [3, 589], [4, 590], [5, 591], [6, 592], [7, 593], [8, 594], [9, 595], [10, 596], [11, 597], [12, 598], [13, 599], [14, 600], [15, 601], [16, 602], [17, 603], [18, 604], [19, 605], [20, 606], [21, 607], [22, 608], [23, 609], [24, 604], [25, 604], [26, 604], [27, 609], [28, 594], [29, 593], [30, 595], [31, 595], [32, 594], [33, 596], [34, 595], [35, 596], [36, 597], [37, 601], [38, 605], [224, 610], [225, 611], [226, 612], [227, 613], [228, 614], [229, 615], [230, 616], [231, 617], [232, 618], [233, 619], [234, 620], [235, 621], [236, 622]]);
var n15 = t([[0, 0], [1, 1], [2, 623], [3, 624], [4, 625], [5, 626], [6, 627], [7, 628], [8, 629], [9, 630], [10, 631], [11, 632], [12, 633], [13, 634], [14, 635], [15, 636], [16, 637], [17, 638], [18, 639], [19, 640], [20, 641], [21, 642], [22, 643], [23, 644], [24, 639], [25, 639], [26, 639], [27, 644], [28, 629], [29, 628], [30, 630], [31, 630], [32, 629], [33, 631], [34, 630], [35, 631], [36, 632], [37, 636], [38, 640], [224, 645], [225, 646], [226, 647], [227, 648], [228, 649], [229, 650], [230, 651], [231, 652], [232, 653], [233, 654], [234, 655], [235, 656], [236, 657]]);
var n16 = t([[0, 0], [1, 1], [2, 658], [3, 659], [4, 660], [5, 661], [6, 662], [7, 663], [8, 664], [9, 665], [10, 13], [11, 666], [12, 667], [13, 668], [14, 197], [15, 669], [16, 670], [17, 671], [18, 672], [19, 673], [20, 674], [21, 675], [22, 676], [23, 677], [24, 672], [25, 672], [26, 672], [27, 677], [28, 664], [29, 663], [30, 665], [31, 665], [32, 664], [33, 13], [34, 665], [35, 13], [36, 666], [37, 669], [38, 673], [224, 678], [225, 679], [226, 680], [227, 681], [228, 682], [229, 683], [230, 684], [231, 685], [232, 686], [233, 687], [234, 688], [235, 689], [236, 690]]);
var n17 = t([[0, 16], [1, 9], [2, 212], [3, 213], [4, 214], [5, 215], [6, 216], [7, 193], [8, 194], [9, 0], [10, 17], [11, 16], [12, 195], [13, 196], [14, 197], [15, 198], [16, 1], [17, 11], [18, 7], [19, 2], [20, 217], [21, 218], [22, 219], [23, 220], [24, 7], [25, 220], [26, 7], [27, 11], [28, 194], [29, 0], [30, 193], [31, 0], [32, 194], [33, 17], [34, 16], [35, 17], [36, 0], [37, 198], [38, 2], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [236, 338]]);
var n18 = t([[0, 16], [1, 9], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20], [21, 21], [22, 22], [23, 23], [24, 18], [25, 23], [26, 18], [27, 17], [28, 8], [29, 9], [30, 7], [31, 9], [32, 8], [33, 10], [34, 11], [35, 10], [36, 9], [37, 15], [38, 19], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [236, 211]]);
var n19 = t([[0, 16], [1, 9], [2, 691], [3, 692], [4, 693], [5, 694], [6, 695], [7, 696], [8, 0], [9, 359], [10, 697], [11, 698], [12, 699], [13, 700], [14, 671], [15, 701], [16, 702], [17, 703], [18, 9], [19, 704], [20, 705], [21, 706], [22, 707], [23, 708], [24, 9], [25, 708], [26, 9], [27, 703], [28, 0], [29, 359], [30, 696], [31, 359], [32, 0], [33, 697], [34, 698], [35, 697], [36, 359], [37, 701], [38, 704], [224, 709], [225, 710], [226, 711], [227, 712], [228, 713], [229, 714], [230, 715], [231, 716], [232, 717], [233, 718], [234, 719], [235, 720], [236, 721]]);
var n20 = t([[0, 16], [1, 9], [2, 722], [3, 723], [4, 724], [5, 725], [6, 726], [7, 727], [8, 728], [9, 729], [10, 730], [11, 731], [12, 732], [13, 733], [14, 734], [15, 391], [16, 735], [17, 736], [18, 737], [19, 738], [20, 739], [21, 740], [22, 741], [23, 742], [24, 737], [25, 742], [26, 737], [27, 736], [28, 728], [29, 729], [30, 727], [31, 729], [32, 728], [33, 730], [34, 731], [35, 730], [36, 729], [37, 391], [38, 738], [224, 743], [225, 744], [226, 745], [227, 746], [228, 747], [229, 748], [230, 749], [231, 750], [232, 751], [233, 752], [234, 753], [235, 754], [236, 755]]);
var n21 = t([[0, 16], [1, 9], [2, 756], [3, 757], [4, 758], [5, 759], [6, 760], [7, 761], [8, 762], [9, 763], [10, 764], [11, 765], [12, 766], [13, 767], [14, 768], [15, 426], [16, 769], [17, 770], [18, 771], [19, 772], [20, 773], [21, 774], [22, 775], [23, 776], [24, 771], [25, 776], [26, 771], [27, 770], [28, 762], [29, 763], [30, 761], [31, 763], [32, 762], [33, 764], [34, 765], [35, 764], [36, 763], [37, 426], [38, 772], [224, 777], [225, 778], [226, 779], [227, 780], [228, 781], [229, 782], [230, 783], [231, 784], [232, 785], [233, 786], [234, 787], [235, 788], [236, 789]]);
var n22 = t([[0, 16], [1, 9], [2, 790], [3, 791], [4, 792], [5, 793], [6, 794], [7, 795], [8, 796], [9, 797], [10, 798], [11, 799], [12, 800], [13, 801], [14, 802], [15, 461], [16, 803], [17, 804], [18, 805], [19, 806], [20, 807], [21, 808], [22, 809], [23, 810], [24, 805], [25, 810], [26, 805], [27, 804], [28, 796], [29, 797], [30, 795], [31, 797], [32, 796], [33, 798], [34, 799], [35, 798], [36, 797], [37, 461], [38, 806], [224, 811], [225, 812], [226, 813], [227, 814], [228, 815], [229, 816], [230, 817], [231, 818], [232, 819], [233, 820], [234, 821], [235, 822], [236, 823]]);
var n23 = t([[0, 16], [1, 9], [2, 824], [3, 825], [4, 826], [5, 827], [6, 828], [7, 829], [8, 830], [9, 831], [10, 832], [11, 833], [12, 834], [13, 835], [14, 836], [15, 496], [16, 837], [17, 838], [18, 839], [19, 840], [20, 841], [21, 842], [22, 843], [23, 844], [24, 839], [25, 844], [26, 839], [27, 838], [28, 830], [29, 831], [30, 829], [31, 831], [32, 830], [33, 832], [34, 833], [35, 832], [36, 831], [37, 496], [38, 840], [224, 845], [225, 846], [226, 847], [227, 848], [228, 849], [229, 850], [230, 851], [231, 852], [232, 853], [233, 854], [234, 855], [235, 856], [236, 857]]);
var n24 = t([[0, 16], [1, 9], [2, 858], [3, 859], [4, 860], [5, 861], [6, 862], [7, 863], [8, 864], [9, 865], [10, 866], [11, 867], [12, 868], [13, 869], [14, 870], [15, 531], [16, 871], [17, 872], [18, 873], [19, 874], [20, 875], [21, 876], [22, 877], [23, 878], [24, 873], [25, 878], [26, 873], [27, 872], [28, 864], [29, 865], [30, 863], [31, 865], [32, 864], [33, 866], [34, 867], [35, 866], [36, 865], [37, 531], [38, 874], [224, 879], [225, 880], [226, 881], [227, 882], [228, 883], [229, 884], [230, 885], [231, 886], [232, 887], [233, 888], [234, 889], [235, 890], [236, 891]]);
var n25 = t([[0, 16], [1, 9], [2, 892], [3, 893], [4, 894], [5, 895], [6, 896], [7, 897], [8, 898], [9, 899], [10, 900], [11, 901], [12, 902], [13, 903], [14, 904], [15, 566], [16, 905], [17, 906], [18, 907], [19, 908], [20, 909], [21, 910], [22, 911], [23, 912], [24, 907], [25, 912], [26, 907], [27, 906], [28, 898], [29, 899], [30, 897], [31, 899], [32, 898], [33, 900], [34, 901], [35, 900], [36, 899], [37, 566], [38, 908], [224, 913], [225, 914], [226, 915], [227, 916], [228, 917], [229, 918], [230, 919], [231, 920], [232, 921], [233, 922], [234, 923], [235, 924], [236, 925]]);
var n26 = t([[0, 16], [1, 9], [2, 926], [3, 927], [4, 928], [5, 929], [6, 930], [7, 931], [8, 932], [9, 933], [10, 934], [11, 935], [12, 936], [13, 937], [14, 938], [15, 601], [16, 939], [17, 940], [18, 941], [19, 942], [20, 943], [21, 944], [22, 945], [23, 946], [24, 941], [25, 946], [26, 941], [27, 940], [28, 932], [29, 933], [30, 931], [31, 933], [32, 932], [33, 934], [34, 935], [35, 934], [36, 933], [37, 601], [38, 942], [224, 947], [225, 948], [226, 949], [227, 950], [228, 951], [229, 952], [230, 953], [231, 954], [232, 955], [233, 956], [234, 957], [235, 958], [236, 959]]);
var n27 = t([[0, 16], [1, 9], [2, 960], [3, 961], [4, 962], [5, 963], [6, 964], [7, 965], [8, 966], [9, 967], [10, 968], [11, 969], [12, 970], [13, 971], [14, 972], [15, 636], [16, 973], [17, 974], [18, 975], [19, 976], [20, 977], [21, 978], [22, 979], [23, 980], [24, 975], [25, 980], [26, 975], [27, 974], [28, 966], [29, 967], [30, 965], [31, 967], [32, 966], [33, 968], [34, 969], [35, 968], [36, 967], [37, 636], [38, 976], [224, 981], [225, 982], [226, 983], [227, 984], [228, 985], [229, 986], [230, 987], [231, 988], [232, 989], [233, 990], [234, 991], [235, 992], [236, 993]]);
var n28 = t([[0, 16], [1, 9], [2, 658], [3, 659], [4, 660], [5, 661], [6, 662], [7, 663], [8, 664], [9, 665], [10, 13], [11, 666], [12, 667], [13, 668], [14, 197], [15, 669], [16, 670], [17, 671], [18, 672], [19, 673], [20, 674], [21, 675], [22, 676], [23, 677], [24, 672], [25, 677], [26, 672], [27, 671], [28, 664], [29, 665], [30, 663], [31, 665], [32, 664], [33, 13], [34, 666], [35, 13], [36, 665], [37, 669], [38, 673], [224, 678], [225, 679], [226, 680], [227, 681], [228, 682], [229, 683], [230, 684], [231, 685], [232, 686], [233, 687], [234, 688], [235, 689], [236, 690]]);
var n29 = t([[24, 17], [25, 17], [26, 17], [27, 18], [28, 9], [29, 8], [30, 10], [31, 11], [32, 9], [33, 11], [34, 10], [35, 11], [36, 12], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n30 = t([[24, 17], [25, 17], [26, 17], [27, 18], [28, 10], [29, 9], [30, 11], [31, 13], [32, 10], [33, 12], [34, 11], [35, 12], [36, 13], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n31 = t([[24, 11], [25, 7], [26, 11], [27, 1], [28, 0], [29, 17], [30, 194], [31, 16], [32, 0], [33, 16], [34, 195], [35, 16], [36, 17], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 213], [4, 214], [5, 215], [6, 216], [236, 338]]);
var n32 = t([[24, 11], [25, 7], [26, 11], [27, 1], [28, 17], [29, 16], [30, 0], [31, 196], [32, 17], [33, 195], [34, 196], [35, 195], [36, 16], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 213], [4, 214], [5, 215], [6, 216], [236, 338]]);
var n33 = t([[0, 1], [1, 0], [2, 2], [3, 213], [4, 214], [5, 215], [6, 216], [7, 7], [8, 11], [9, 1], [10, 198], [11, 197], [12, 196], [13, 195], [14, 16], [15, 17], [16, 0], [17, 194], [18, 193], [19, 212], [20, 339], [21, 340], [22, 341], [23, 342], [24, 193], [25, 193], [26, 193], [27, 342], [28, 11], [29, 7], [30, 1], [31, 1], [32, 11], [33, 198], [34, 1], [35, 198], [36, 197], [37, 17], [38, 212], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [236, 338]]);
var n34 = t([[24, 11], [25, 11], [26, 11], [27, 7], [28, 0], [29, 194], [30, 17], [31, 16], [32, 0], [33, 16], [34, 17], [35, 16], [36, 195], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 213], [4, 214], [5, 215], [6, 216], [236, 338]]);
var n35 = t([[24, 11], [25, 11], [26, 11], [27, 7], [28, 17], [29, 0], [30, 16], [31, 196], [32, 17], [33, 195], [34, 16], [35, 195], [36, 196], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 213], [4, 214], [5, 215], [6, 216], [236, 338]]);
var n36 = t([[0, 1], [1, 0], [2, 360], [3, 344], [4, 345], [5, 346], [6, 347], [7, 359], [8, 358], [9, 357], [10, 356], [11, 355], [12, 354], [13, 353], [14, 352], [15, 351], [16, 350], [17, 349], [18, 348], [19, 343], [20, 994], [21, 995], [22, 996], [23, 997], [24, 348], [25, 348], [26, 348], [27, 997], [28, 358], [29, 359], [30, 357], [31, 357], [32, 358], [33, 356], [34, 357], [35, 356], [36, 355], [37, 351], [38, 343], [224, 365], [225, 366], [226, 367], [227, 368], [228, 369], [229, 370], [230, 371], [231, 372], [232, 373], [233, 374], [234, 375], [235, 376], [236, 377]]);
var n37 = t([[24, 358], [25, 358], [26, 358], [27, 359], [28, 350], [29, 349], [30, 351], [31, 352], [32, 350], [33, 352], [34, 351], [35, 352], [36, 353], [224, 365], [225, 366], [226, 367], [227, 368], [228, 369], [229, 370], [230, 371], [231, 372], [232, 373], [233, 374], [234, 375], [235, 376], [3, 344], [4, 345], [5, 346], [6, 347], [236, 377]]);
var n38 = t([[24, 358], [25, 358], [26, 358], [27, 359], [28, 351], [29, 350], [30, 352], [31, 354], [32, 351], [33, 353], [34, 352], [35, 353], [36, 354], [224, 365], [225, 366], [226, 367], [227, 368], [228, 369], [229, 370], [230, 371], [231, 372], [232, 373], [233, 374], [234, 375], [235, 376], [3, 344], [4, 345], [5, 346], [6, 347], [236, 377]]);
var n39 = t([[0, 1], [1, 0], [2, 395], [3, 379], [4, 380], [5, 381], [6, 382], [7, 394], [8, 393], [9, 392], [10, 391], [11, 390], [12, 389], [13, 388], [14, 387], [15, 386], [16, 385], [17, 384], [18, 383], [19, 378], [20, 998], [21, 999], [22, 1e3], [23, 1001], [24, 383], [25, 383], [26, 383], [27, 1001], [28, 393], [29, 394], [30, 392], [31, 392], [32, 393], [33, 391], [34, 392], [35, 391], [36, 390], [37, 386], [38, 378], [224, 400], [225, 401], [226, 402], [227, 403], [228, 404], [229, 405], [230, 406], [231, 407], [232, 408], [233, 409], [234, 410], [235, 411], [236, 412]]);
var n40 = t([[24, 393], [25, 393], [26, 393], [27, 394], [28, 385], [29, 384], [30, 386], [31, 387], [32, 385], [33, 387], [34, 386], [35, 387], [36, 388], [224, 400], [225, 401], [226, 402], [227, 403], [228, 404], [229, 405], [230, 406], [231, 407], [232, 408], [233, 409], [234, 410], [235, 411], [3, 379], [4, 380], [5, 381], [6, 382], [236, 412]]);
var n41 = t([[24, 393], [25, 393], [26, 393], [27, 394], [28, 386], [29, 385], [30, 387], [31, 389], [32, 386], [33, 388], [34, 387], [35, 388], [36, 389], [224, 400], [225, 401], [226, 402], [227, 403], [228, 404], [229, 405], [230, 406], [231, 407], [232, 408], [233, 409], [234, 410], [235, 411], [3, 379], [4, 380], [5, 381], [6, 382], [236, 412]]);
var n42 = t([[0, 1], [1, 0], [2, 430], [3, 414], [4, 415], [5, 416], [6, 417], [7, 429], [8, 428], [9, 427], [10, 426], [11, 425], [12, 424], [13, 423], [14, 422], [15, 421], [16, 420], [17, 419], [18, 418], [19, 413], [20, 1002], [21, 1003], [22, 1004], [23, 1005], [24, 418], [25, 418], [26, 418], [27, 1005], [28, 428], [29, 429], [30, 427], [31, 427], [32, 428], [33, 426], [34, 427], [35, 426], [36, 425], [37, 421], [38, 413], [224, 435], [225, 436], [226, 437], [227, 438], [228, 439], [229, 440], [230, 441], [231, 442], [232, 443], [233, 444], [234, 445], [235, 446], [236, 447]]);
var n43 = t([[24, 428], [25, 428], [26, 428], [27, 429], [28, 420], [29, 419], [30, 421], [31, 422], [32, 420], [33, 422], [34, 421], [35, 422], [36, 423], [224, 435], [225, 436], [226, 437], [227, 438], [228, 439], [229, 440], [230, 441], [231, 442], [232, 443], [233, 444], [234, 445], [235, 446], [3, 414], [4, 415], [5, 416], [6, 417], [236, 447]]);
var n44 = t([[24, 428], [25, 428], [26, 428], [27, 429], [28, 421], [29, 420], [30, 422], [31, 424], [32, 421], [33, 423], [34, 422], [35, 423], [36, 424], [224, 435], [225, 436], [226, 437], [227, 438], [228, 439], [229, 440], [230, 441], [231, 442], [232, 443], [233, 444], [234, 445], [235, 446], [3, 414], [4, 415], [5, 416], [6, 417], [236, 447]]);
var n45 = t([[0, 1], [1, 0], [2, 465], [3, 449], [4, 450], [5, 451], [6, 452], [7, 464], [8, 463], [9, 462], [10, 461], [11, 460], [12, 459], [13, 458], [14, 457], [15, 456], [16, 455], [17, 454], [18, 453], [19, 448], [20, 1006], [21, 1007], [22, 1008], [23, 1009], [24, 453], [25, 453], [26, 453], [27, 1009], [28, 463], [29, 464], [30, 462], [31, 462], [32, 463], [33, 461], [34, 462], [35, 461], [36, 460], [37, 456], [38, 448], [224, 470], [225, 471], [226, 472], [227, 473], [228, 474], [229, 475], [230, 476], [231, 477], [232, 478], [233, 479], [234, 480], [235, 481], [236, 482]]);
var n46 = t([[24, 463], [25, 463], [26, 463], [27, 464], [28, 455], [29, 454], [30, 456], [31, 457], [32, 455], [33, 457], [34, 456], [35, 457], [36, 458], [224, 470], [225, 471], [226, 472], [227, 473], [228, 474], [229, 475], [230, 476], [231, 477], [232, 478], [233, 479], [234, 480], [235, 481], [3, 449], [4, 450], [5, 451], [6, 452], [236, 482]]);
var n47 = t([[24, 463], [25, 463], [26, 463], [27, 464], [28, 456], [29, 455], [30, 457], [31, 459], [32, 456], [33, 458], [34, 457], [35, 458], [36, 459], [224, 470], [225, 471], [226, 472], [227, 473], [228, 474], [229, 475], [230, 476], [231, 477], [232, 478], [233, 479], [234, 480], [235, 481], [3, 449], [4, 450], [5, 451], [6, 452], [236, 482]]);
var n48 = t([[0, 1], [1, 0], [2, 500], [3, 484], [4, 485], [5, 486], [6, 487], [7, 499], [8, 498], [9, 497], [10, 496], [11, 495], [12, 494], [13, 493], [14, 492], [15, 491], [16, 490], [17, 489], [18, 488], [19, 483], [20, 1010], [21, 1011], [22, 1012], [23, 1013], [24, 488], [25, 488], [26, 488], [27, 1013], [28, 498], [29, 499], [30, 497], [31, 497], [32, 498], [33, 496], [34, 497], [35, 496], [36, 495], [37, 491], [38, 483], [224, 505], [225, 506], [226, 507], [227, 508], [228, 509], [229, 510], [230, 511], [231, 512], [232, 513], [233, 514], [234, 515], [235, 516], [236, 517]]);
var n49 = t([[24, 498], [25, 498], [26, 498], [27, 499], [28, 490], [29, 489], [30, 491], [31, 492], [32, 490], [33, 492], [34, 491], [35, 492], [36, 493], [224, 505], [225, 506], [226, 507], [227, 508], [228, 509], [229, 510], [230, 511], [231, 512], [232, 513], [233, 514], [234, 515], [235, 516], [3, 484], [4, 485], [5, 486], [6, 487], [236, 517]]);
var n50 = t([[24, 498], [25, 498], [26, 498], [27, 499], [28, 491], [29, 490], [30, 492], [31, 494], [32, 491], [33, 493], [34, 492], [35, 493], [36, 494], [224, 505], [225, 506], [226, 507], [227, 508], [228, 509], [229, 510], [230, 511], [231, 512], [232, 513], [233, 514], [234, 515], [235, 516], [3, 484], [4, 485], [5, 486], [6, 487], [236, 517]]);
var n51 = t([[0, 1], [1, 0], [2, 535], [3, 519], [4, 520], [5, 521], [6, 522], [7, 534], [8, 533], [9, 532], [10, 531], [11, 530], [12, 529], [13, 528], [14, 527], [15, 526], [16, 525], [17, 524], [18, 523], [19, 518], [20, 1014], [21, 1015], [22, 1016], [23, 1017], [24, 523], [25, 523], [26, 523], [27, 1017], [28, 533], [29, 534], [30, 532], [31, 532], [32, 533], [33, 531], [34, 532], [35, 531], [36, 530], [37, 526], [38, 518], [224, 540], [225, 541], [226, 542], [227, 543], [228, 544], [229, 545], [230, 546], [231, 547], [232, 548], [233, 549], [234, 550], [235, 551], [236, 552]]);
var n52 = t([[24, 533], [25, 533], [26, 533], [27, 534], [28, 525], [29, 524], [30, 526], [31, 527], [32, 525], [33, 527], [34, 526], [35, 527], [36, 528], [224, 540], [225, 541], [226, 542], [227, 543], [228, 544], [229, 545], [230, 546], [231, 547], [232, 548], [233, 549], [234, 550], [235, 551], [3, 519], [4, 520], [5, 521], [6, 522], [236, 552]]);
var n53 = t([[24, 533], [25, 533], [26, 533], [27, 534], [28, 526], [29, 525], [30, 527], [31, 529], [32, 526], [33, 528], [34, 527], [35, 528], [36, 529], [224, 540], [225, 541], [226, 542], [227, 543], [228, 544], [229, 545], [230, 546], [231, 547], [232, 548], [233, 549], [234, 550], [235, 551], [3, 519], [4, 520], [5, 521], [6, 522], [236, 552]]);
var n54 = t([[0, 1], [1, 0], [2, 570], [3, 554], [4, 555], [5, 556], [6, 557], [7, 569], [8, 568], [9, 567], [10, 566], [11, 565], [12, 564], [13, 563], [14, 562], [15, 561], [16, 560], [17, 559], [18, 558], [19, 553], [20, 1018], [21, 1019], [22, 1020], [23, 1021], [24, 558], [25, 558], [26, 558], [27, 1021], [28, 568], [29, 569], [30, 567], [31, 567], [32, 568], [33, 566], [34, 567], [35, 566], [36, 565], [37, 561], [38, 553], [224, 575], [225, 576], [226, 577], [227, 578], [228, 579], [229, 580], [230, 581], [231, 582], [232, 583], [233, 584], [234, 585], [235, 586], [236, 587]]);
var n55 = t([[24, 568], [25, 568], [26, 568], [27, 569], [28, 560], [29, 559], [30, 561], [31, 562], [32, 560], [33, 562], [34, 561], [35, 562], [36, 563], [224, 575], [225, 576], [226, 577], [227, 578], [228, 579], [229, 580], [230, 581], [231, 582], [232, 583], [233, 584], [234, 585], [235, 586], [3, 554], [4, 555], [5, 556], [6, 557], [236, 587]]);
var n56 = t([[24, 568], [25, 568], [26, 568], [27, 569], [28, 561], [29, 560], [30, 562], [31, 564], [32, 561], [33, 563], [34, 562], [35, 563], [36, 564], [224, 575], [225, 576], [226, 577], [227, 578], [228, 579], [229, 580], [230, 581], [231, 582], [232, 583], [233, 584], [234, 585], [235, 586], [3, 554], [4, 555], [5, 556], [6, 557], [236, 587]]);
var n57 = t([[0, 1], [1, 0], [2, 605], [3, 589], [4, 590], [5, 591], [6, 592], [7, 604], [8, 603], [9, 602], [10, 601], [11, 600], [12, 599], [13, 598], [14, 597], [15, 596], [16, 595], [17, 594], [18, 593], [19, 588], [20, 1022], [21, 1023], [22, 1024], [23, 1025], [24, 593], [25, 593], [26, 593], [27, 1025], [28, 603], [29, 604], [30, 602], [31, 602], [32, 603], [33, 601], [34, 602], [35, 601], [36, 600], [37, 596], [38, 588], [224, 610], [225, 611], [226, 612], [227, 613], [228, 614], [229, 615], [230, 616], [231, 617], [232, 618], [233, 619], [234, 620], [235, 621], [236, 622]]);
var n58 = t([[24, 603], [25, 603], [26, 603], [27, 604], [28, 595], [29, 594], [30, 596], [31, 597], [32, 595], [33, 597], [34, 596], [35, 597], [36, 598], [224, 610], [225, 611], [226, 612], [227, 613], [228, 614], [229, 615], [230, 616], [231, 617], [232, 618], [233, 619], [234, 620], [235, 621], [3, 589], [4, 590], [5, 591], [6, 592], [236, 622]]);
var n59 = t([[24, 603], [25, 603], [26, 603], [27, 604], [28, 596], [29, 595], [30, 597], [31, 599], [32, 596], [33, 598], [34, 597], [35, 598], [36, 599], [224, 610], [225, 611], [226, 612], [227, 613], [228, 614], [229, 615], [230, 616], [231, 617], [232, 618], [233, 619], [234, 620], [235, 621], [3, 589], [4, 590], [5, 591], [6, 592], [236, 622]]);
var n60 = t([[0, 1], [1, 0], [2, 640], [3, 624], [4, 625], [5, 626], [6, 627], [7, 639], [8, 638], [9, 637], [10, 636], [11, 635], [12, 634], [13, 633], [14, 632], [15, 631], [16, 630], [17, 629], [18, 628], [19, 623], [20, 1026], [21, 1027], [22, 1028], [23, 1029], [24, 628], [25, 628], [26, 628], [27, 1029], [28, 638], [29, 639], [30, 637], [31, 637], [32, 638], [33, 636], [34, 637], [35, 636], [36, 635], [37, 631], [38, 623], [224, 645], [225, 646], [226, 647], [227, 648], [228, 649], [229, 650], [230, 651], [231, 652], [232, 653], [233, 654], [234, 655], [235, 656], [236, 657]]);
var n61 = t([[24, 638], [25, 638], [26, 638], [27, 639], [28, 630], [29, 629], [30, 631], [31, 632], [32, 630], [33, 632], [34, 631], [35, 632], [36, 633], [224, 645], [225, 646], [226, 647], [227, 648], [228, 649], [229, 650], [230, 651], [231, 652], [232, 653], [233, 654], [234, 655], [235, 656], [3, 624], [4, 625], [5, 626], [6, 627], [236, 657]]);
var n62 = t([[24, 638], [25, 638], [26, 638], [27, 639], [28, 631], [29, 630], [30, 632], [31, 634], [32, 631], [33, 633], [34, 632], [35, 633], [36, 634], [224, 645], [225, 646], [226, 647], [227, 648], [228, 649], [229, 650], [230, 651], [231, 652], [232, 653], [233, 654], [234, 655], [235, 656], [3, 624], [4, 625], [5, 626], [6, 627], [236, 657]]);
var n63 = t([[0, 1], [1, 0], [2, 673], [3, 659], [4, 660], [5, 661], [6, 662], [7, 672], [8, 671], [9, 670], [10, 669], [11, 197], [12, 668], [13, 667], [14, 666], [15, 13], [16, 665], [17, 664], [18, 663], [19, 658], [20, 1030], [21, 1031], [22, 1032], [23, 1033], [24, 663], [25, 663], [26, 663], [27, 1033], [28, 671], [29, 672], [30, 670], [31, 670], [32, 671], [33, 669], [34, 670], [35, 669], [36, 197], [37, 13], [38, 658], [224, 678], [225, 679], [226, 680], [227, 681], [228, 682], [229, 683], [230, 684], [231, 685], [232, 686], [233, 687], [234, 688], [235, 689], [236, 690]]);
var n64 = t([[24, 671], [25, 671], [26, 671], [27, 672], [28, 665], [29, 664], [30, 13], [31, 666], [32, 665], [33, 666], [34, 13], [35, 666], [36, 667], [224, 678], [225, 679], [226, 680], [227, 681], [228, 682], [229, 683], [230, 684], [231, 685], [232, 686], [233, 687], [234, 688], [235, 689], [3, 659], [4, 660], [5, 661], [6, 662], [236, 690]]);
var n65 = t([[24, 671], [25, 671], [26, 671], [27, 672], [28, 13], [29, 665], [30, 666], [31, 668], [32, 13], [33, 667], [34, 666], [35, 667], [36, 668], [224, 678], [225, 679], [226, 680], [227, 681], [228, 682], [229, 683], [230, 684], [231, 685], [232, 686], [233, 687], [234, 688], [235, 689], [3, 659], [4, 660], [5, 661], [6, 662], [236, 690]]);
var n66 = t([[0, 9], [1, 16], [2, 19], [3, 3], [4, 4], [5, 5], [6, 6], [7, 18], [8, 17], [9, 16], [10, 15], [11, 14], [12, 13], [13, 12], [14, 11], [15, 10], [16, 9], [17, 8], [18, 7], [19, 2], [20, 217], [21, 218], [22, 219], [23, 220], [24, 7], [25, 220], [26, 7], [27, 8], [28, 17], [29, 16], [30, 18], [31, 16], [32, 17], [33, 15], [34, 14], [35, 15], [36, 16], [37, 10], [38, 2], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [236, 211]]);
var n67 = t([[24, 17], [25, 18], [26, 17], [27, 16], [28, 9], [29, 10], [30, 8], [31, 11], [32, 9], [33, 11], [34, 12], [35, 11], [36, 10], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n68 = t([[24, 17], [25, 18], [26, 17], [27, 16], [28, 10], [29, 11], [30, 9], [31, 13], [32, 10], [33, 12], [34, 13], [35, 12], [36, 11], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n69 = t([[0, 9], [1, 16], [2, 704], [3, 692], [4, 693], [5, 694], [6, 695], [7, 9], [8, 703], [9, 702], [10, 701], [11, 671], [12, 700], [13, 699], [14, 698], [15, 697], [16, 359], [17, 0], [18, 696], [19, 691], [20, 1034], [21, 1035], [22, 1036], [23, 1037], [24, 696], [25, 1037], [26, 696], [27, 0], [28, 703], [29, 702], [30, 9], [31, 702], [32, 703], [33, 701], [34, 671], [35, 701], [36, 702], [37, 697], [38, 691], [224, 709], [225, 710], [226, 711], [227, 712], [228, 713], [229, 714], [230, 715], [231, 716], [232, 717], [233, 718], [234, 719], [235, 720], [236, 721]]);
var n70 = t([[24, 703], [25, 9], [26, 703], [27, 702], [28, 359], [29, 697], [30, 0], [31, 698], [32, 359], [33, 698], [34, 699], [35, 698], [36, 697], [224, 709], [225, 710], [226, 711], [227, 712], [228, 713], [229, 714], [230, 715], [231, 716], [232, 717], [233, 718], [234, 719], [235, 720], [3, 692], [4, 693], [5, 694], [6, 695], [236, 721]]);
var n71 = t([[24, 703], [25, 9], [26, 703], [27, 702], [28, 697], [29, 698], [30, 359], [31, 700], [32, 697], [33, 699], [34, 700], [35, 699], [36, 698], [224, 709], [225, 710], [226, 711], [227, 712], [228, 713], [229, 714], [230, 715], [231, 716], [232, 717], [233, 718], [234, 719], [235, 720], [3, 692], [4, 693], [5, 694], [6, 695], [236, 721]]);
var n72 = t([[0, 9], [1, 16], [2, 738], [3, 723], [4, 724], [5, 725], [6, 726], [7, 737], [8, 736], [9, 735], [10, 391], [11, 734], [12, 733], [13, 732], [14, 731], [15, 730], [16, 729], [17, 728], [18, 727], [19, 722], [20, 1038], [21, 1039], [22, 1040], [23, 1041], [24, 727], [25, 1041], [26, 727], [27, 728], [28, 736], [29, 735], [30, 737], [31, 735], [32, 736], [33, 391], [34, 734], [35, 391], [36, 735], [37, 730], [38, 722], [224, 743], [225, 744], [226, 745], [227, 746], [228, 747], [229, 748], [230, 749], [231, 750], [232, 751], [233, 752], [234, 753], [235, 754], [236, 755]]);
var n73 = t([[24, 736], [25, 737], [26, 736], [27, 735], [28, 729], [29, 730], [30, 728], [31, 731], [32, 729], [33, 731], [34, 732], [35, 731], [36, 730], [224, 743], [225, 744], [226, 745], [227, 746], [228, 747], [229, 748], [230, 749], [231, 750], [232, 751], [233, 752], [234, 753], [235, 754], [3, 723], [4, 724], [5, 725], [6, 726], [236, 755]]);
var n74 = t([[24, 736], [25, 737], [26, 736], [27, 735], [28, 730], [29, 731], [30, 729], [31, 733], [32, 730], [33, 732], [34, 733], [35, 732], [36, 731], [224, 743], [225, 744], [226, 745], [227, 746], [228, 747], [229, 748], [230, 749], [231, 750], [232, 751], [233, 752], [234, 753], [235, 754], [3, 723], [4, 724], [5, 725], [6, 726], [236, 755]]);
var n75 = t([[0, 9], [1, 16], [2, 772], [3, 757], [4, 758], [5, 759], [6, 760], [7, 771], [8, 770], [9, 769], [10, 426], [11, 768], [12, 767], [13, 766], [14, 765], [15, 764], [16, 763], [17, 762], [18, 761], [19, 756], [20, 1042], [21, 1043], [22, 1044], [23, 1045], [24, 761], [25, 1045], [26, 761], [27, 762], [28, 770], [29, 769], [30, 771], [31, 769], [32, 770], [33, 426], [34, 768], [35, 426], [36, 769], [37, 764], [38, 756], [224, 777], [225, 778], [226, 779], [227, 780], [228, 781], [229, 782], [230, 783], [231, 784], [232, 785], [233, 786], [234, 787], [235, 788], [236, 789]]);
var n76 = t([[24, 770], [25, 771], [26, 770], [27, 769], [28, 763], [29, 764], [30, 762], [31, 765], [32, 763], [33, 765], [34, 766], [35, 765], [36, 764], [224, 777], [225, 778], [226, 779], [227, 780], [228, 781], [229, 782], [230, 783], [231, 784], [232, 785], [233, 786], [234, 787], [235, 788], [3, 757], [4, 758], [5, 759], [6, 760], [236, 789]]);
var n77 = t([[24, 770], [25, 771], [26, 770], [27, 769], [28, 764], [29, 765], [30, 763], [31, 767], [32, 764], [33, 766], [34, 767], [35, 766], [36, 765], [224, 777], [225, 778], [226, 779], [227, 780], [228, 781], [229, 782], [230, 783], [231, 784], [232, 785], [233, 786], [234, 787], [235, 788], [3, 757], [4, 758], [5, 759], [6, 760], [236, 789]]);
var n78 = t([[0, 9], [1, 16], [2, 806], [3, 791], [4, 792], [5, 793], [6, 794], [7, 805], [8, 804], [9, 803], [10, 461], [11, 802], [12, 801], [13, 800], [14, 799], [15, 798], [16, 797], [17, 796], [18, 795], [19, 790], [20, 1046], [21, 1047], [22, 1048], [23, 1049], [24, 795], [25, 1049], [26, 795], [27, 796], [28, 804], [29, 803], [30, 805], [31, 803], [32, 804], [33, 461], [34, 802], [35, 461], [36, 803], [37, 798], [38, 790], [224, 811], [225, 812], [226, 813], [227, 814], [228, 815], [229, 816], [230, 817], [231, 818], [232, 819], [233, 820], [234, 821], [235, 822], [236, 823]]);
var n79 = t([[24, 804], [25, 805], [26, 804], [27, 803], [28, 797], [29, 798], [30, 796], [31, 799], [32, 797], [33, 799], [34, 800], [35, 799], [36, 798], [224, 811], [225, 812], [226, 813], [227, 814], [228, 815], [229, 816], [230, 817], [231, 818], [232, 819], [233, 820], [234, 821], [235, 822], [3, 791], [4, 792], [5, 793], [6, 794], [236, 823]]);
var n80 = t([[24, 804], [25, 805], [26, 804], [27, 803], [28, 798], [29, 799], [30, 797], [31, 801], [32, 798], [33, 800], [34, 801], [35, 800], [36, 799], [224, 811], [225, 812], [226, 813], [227, 814], [228, 815], [229, 816], [230, 817], [231, 818], [232, 819], [233, 820], [234, 821], [235, 822], [3, 791], [4, 792], [5, 793], [6, 794], [236, 823]]);
var n81 = t([[0, 9], [1, 16], [2, 840], [3, 825], [4, 826], [5, 827], [6, 828], [7, 839], [8, 838], [9, 837], [10, 496], [11, 836], [12, 835], [13, 834], [14, 833], [15, 832], [16, 831], [17, 830], [18, 829], [19, 824], [20, 1050], [21, 1051], [22, 1052], [23, 1053], [24, 829], [25, 1053], [26, 829], [27, 830], [28, 838], [29, 837], [30, 839], [31, 837], [32, 838], [33, 496], [34, 836], [35, 496], [36, 837], [37, 832], [38, 824], [224, 845], [225, 846], [226, 847], [227, 848], [228, 849], [229, 850], [230, 851], [231, 852], [232, 853], [233, 854], [234, 855], [235, 856], [236, 857]]);
var n82 = t([[24, 838], [25, 839], [26, 838], [27, 837], [28, 831], [29, 832], [30, 830], [31, 833], [32, 831], [33, 833], [34, 834], [35, 833], [36, 832], [224, 845], [225, 846], [226, 847], [227, 848], [228, 849], [229, 850], [230, 851], [231, 852], [232, 853], [233, 854], [234, 855], [235, 856], [3, 825], [4, 826], [5, 827], [6, 828], [236, 857]]);
var n83 = t([[24, 838], [25, 839], [26, 838], [27, 837], [28, 832], [29, 833], [30, 831], [31, 835], [32, 832], [33, 834], [34, 835], [35, 834], [36, 833], [224, 845], [225, 846], [226, 847], [227, 848], [228, 849], [229, 850], [230, 851], [231, 852], [232, 853], [233, 854], [234, 855], [235, 856], [3, 825], [4, 826], [5, 827], [6, 828], [236, 857]]);
var n84 = t([[0, 9], [1, 16], [2, 874], [3, 859], [4, 860], [5, 861], [6, 862], [7, 873], [8, 872], [9, 871], [10, 531], [11, 870], [12, 869], [13, 868], [14, 867], [15, 866], [16, 865], [17, 864], [18, 863], [19, 858], [20, 1054], [21, 1055], [22, 1056], [23, 1057], [24, 863], [25, 1057], [26, 863], [27, 864], [28, 872], [29, 871], [30, 873], [31, 871], [32, 872], [33, 531], [34, 870], [35, 531], [36, 871], [37, 866], [38, 858], [224, 879], [225, 880], [226, 881], [227, 882], [228, 883], [229, 884], [230, 885], [231, 886], [232, 887], [233, 888], [234, 889], [235, 890], [236, 891]]);
var n85 = t([[24, 872], [25, 873], [26, 872], [27, 871], [28, 865], [29, 866], [30, 864], [31, 867], [32, 865], [33, 867], [34, 868], [35, 867], [36, 866], [224, 879], [225, 880], [226, 881], [227, 882], [228, 883], [229, 884], [230, 885], [231, 886], [232, 887], [233, 888], [234, 889], [235, 890], [3, 859], [4, 860], [5, 861], [6, 862], [236, 891]]);
var n86 = t([[24, 872], [25, 873], [26, 872], [27, 871], [28, 866], [29, 867], [30, 865], [31, 869], [32, 866], [33, 868], [34, 869], [35, 868], [36, 867], [224, 879], [225, 880], [226, 881], [227, 882], [228, 883], [229, 884], [230, 885], [231, 886], [232, 887], [233, 888], [234, 889], [235, 890], [3, 859], [4, 860], [5, 861], [6, 862], [236, 891]]);
var n87 = t([[0, 9], [1, 16], [2, 908], [3, 893], [4, 894], [5, 895], [6, 896], [7, 907], [8, 906], [9, 905], [10, 566], [11, 904], [12, 903], [13, 902], [14, 901], [15, 900], [16, 899], [17, 898], [18, 897], [19, 892], [20, 1058], [21, 1059], [22, 1060], [23, 1061], [24, 897], [25, 1061], [26, 897], [27, 898], [28, 906], [29, 905], [30, 907], [31, 905], [32, 906], [33, 566], [34, 904], [35, 566], [36, 905], [37, 900], [38, 892], [224, 913], [225, 914], [226, 915], [227, 916], [228, 917], [229, 918], [230, 919], [231, 920], [232, 921], [233, 922], [234, 923], [235, 924], [236, 925]]);
var n88 = t([[24, 906], [25, 907], [26, 906], [27, 905], [28, 899], [29, 900], [30, 898], [31, 901], [32, 899], [33, 901], [34, 902], [35, 901], [36, 900], [224, 913], [225, 914], [226, 915], [227, 916], [228, 917], [229, 918], [230, 919], [231, 920], [232, 921], [233, 922], [234, 923], [235, 924], [3, 893], [4, 894], [5, 895], [6, 896], [236, 925]]);
var n89 = t([[24, 906], [25, 907], [26, 906], [27, 905], [28, 900], [29, 901], [30, 899], [31, 903], [32, 900], [33, 902], [34, 903], [35, 902], [36, 901], [224, 913], [225, 914], [226, 915], [227, 916], [228, 917], [229, 918], [230, 919], [231, 920], [232, 921], [233, 922], [234, 923], [235, 924], [3, 893], [4, 894], [5, 895], [6, 896], [236, 925]]);
var n90 = t([[0, 9], [1, 16], [2, 942], [3, 927], [4, 928], [5, 929], [6, 930], [7, 941], [8, 940], [9, 939], [10, 601], [11, 938], [12, 937], [13, 936], [14, 935], [15, 934], [16, 933], [17, 932], [18, 931], [19, 926], [20, 1062], [21, 1063], [22, 1064], [23, 1065], [24, 931], [25, 1065], [26, 931], [27, 932], [28, 940], [29, 939], [30, 941], [31, 939], [32, 940], [33, 601], [34, 938], [35, 601], [36, 939], [37, 934], [38, 926], [224, 947], [225, 948], [226, 949], [227, 950], [228, 951], [229, 952], [230, 953], [231, 954], [232, 955], [233, 956], [234, 957], [235, 958], [236, 959]]);
var n91 = t([[24, 940], [25, 941], [26, 940], [27, 939], [28, 933], [29, 934], [30, 932], [31, 935], [32, 933], [33, 935], [34, 936], [35, 935], [36, 934], [224, 947], [225, 948], [226, 949], [227, 950], [228, 951], [229, 952], [230, 953], [231, 954], [232, 955], [233, 956], [234, 957], [235, 958], [3, 927], [4, 928], [5, 929], [6, 930], [236, 959]]);
var n92 = t([[24, 940], [25, 941], [26, 940], [27, 939], [28, 934], [29, 935], [30, 933], [31, 937], [32, 934], [33, 936], [34, 937], [35, 936], [36, 935], [224, 947], [225, 948], [226, 949], [227, 950], [228, 951], [229, 952], [230, 953], [231, 954], [232, 955], [233, 956], [234, 957], [235, 958], [3, 927], [4, 928], [5, 929], [6, 930], [236, 959]]);
var n93 = t([[0, 9], [1, 16], [2, 976], [3, 961], [4, 962], [5, 963], [6, 964], [7, 975], [8, 974], [9, 973], [10, 636], [11, 972], [12, 971], [13, 970], [14, 969], [15, 968], [16, 967], [17, 966], [18, 965], [19, 960], [20, 1066], [21, 1067], [22, 1068], [23, 1069], [24, 965], [25, 1069], [26, 965], [27, 966], [28, 974], [29, 973], [30, 975], [31, 973], [32, 974], [33, 636], [34, 972], [35, 636], [36, 973], [37, 968], [38, 960], [224, 981], [225, 982], [226, 983], [227, 984], [228, 985], [229, 986], [230, 987], [231, 988], [232, 989], [233, 990], [234, 991], [235, 992], [236, 993]]);
var n94 = t([[24, 974], [25, 975], [26, 974], [27, 973], [28, 967], [29, 968], [30, 966], [31, 969], [32, 967], [33, 969], [34, 970], [35, 969], [36, 968], [224, 981], [225, 982], [226, 983], [227, 984], [228, 985], [229, 986], [230, 987], [231, 988], [232, 989], [233, 990], [234, 991], [235, 992], [3, 961], [4, 962], [5, 963], [6, 964], [236, 993]]);
var n95 = t([[24, 974], [25, 975], [26, 974], [27, 973], [28, 968], [29, 969], [30, 967], [31, 971], [32, 968], [33, 970], [34, 971], [35, 970], [36, 969], [224, 981], [225, 982], [226, 983], [227, 984], [228, 985], [229, 986], [230, 987], [231, 988], [232, 989], [233, 990], [234, 991], [235, 992], [3, 961], [4, 962], [5, 963], [6, 964], [236, 993]]);
var n96 = t([[0, 9], [1, 16], [2, 673], [3, 659], [4, 660], [5, 661], [6, 662], [7, 672], [8, 671], [9, 670], [10, 669], [11, 197], [12, 668], [13, 667], [14, 666], [15, 13], [16, 665], [17, 664], [18, 663], [19, 658], [20, 1030], [21, 1031], [22, 1032], [23, 1033], [24, 663], [25, 1033], [26, 663], [27, 664], [28, 671], [29, 670], [30, 672], [31, 670], [32, 671], [33, 669], [34, 197], [35, 669], [36, 670], [37, 13], [38, 658], [224, 678], [225, 679], [226, 680], [227, 681], [228, 682], [229, 683], [230, 684], [231, 685], [232, 686], [233, 687], [234, 688], [235, 689], [236, 690]]);
var n97 = t([[24, 671], [25, 672], [26, 671], [27, 670], [28, 665], [29, 13], [30, 664], [31, 666], [32, 665], [33, 666], [34, 667], [35, 666], [36, 13], [224, 678], [225, 679], [226, 680], [227, 681], [228, 682], [229, 683], [230, 684], [231, 685], [232, 686], [233, 687], [234, 688], [235, 689], [3, 659], [4, 660], [5, 661], [6, 662], [236, 690]]);
var n98 = t([[24, 671], [25, 672], [26, 671], [27, 670], [28, 13], [29, 666], [30, 665], [31, 668], [32, 13], [33, 667], [34, 668], [35, 667], [36, 666], [224, 678], [225, 679], [226, 680], [227, 681], [228, 682], [229, 683], [230, 684], [231, 685], [232, 686], [233, 687], [234, 688], [235, 689], [3, 659], [4, 660], [5, 661], [6, 662], [236, 690]]);
var n99 = t([[24, 17], [25, 17], [26, 17], [27, 18], [28, 12], [29, 11], [30, 13], [31, 17], [32, 12], [33, 14], [34, 13], [35, 14], [36, 15], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n100 = t([[24, 11], [25, 7], [26, 11], [27, 1], [28, 195], [29, 196], [30, 16], [31, 11], [32, 195], [33, 197], [34, 198], [35, 197], [36, 196], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 213], [4, 214], [5, 215], [6, 216], [236, 338]]);
var n101 = t([[24, 11], [25, 11], [26, 11], [27, 7], [28, 195], [29, 16], [30, 196], [31, 11], [32, 195], [33, 197], [34, 196], [35, 197], [36, 198], [224, 326], [225, 327], [226, 328], [227, 329], [228, 330], [229, 331], [230, 332], [231, 333], [232, 334], [233, 335], [234, 336], [235, 337], [3, 213], [4, 214], [5, 215], [6, 216], [236, 338]]);
var n102 = t([[24, 358], [25, 358], [26, 358], [27, 359], [28, 353], [29, 352], [30, 354], [31, 358], [32, 353], [33, 355], [34, 354], [35, 355], [36, 356], [224, 365], [225, 366], [226, 367], [227, 368], [228, 369], [229, 370], [230, 371], [231, 372], [232, 373], [233, 374], [234, 375], [235, 376], [3, 344], [4, 345], [5, 346], [6, 347], [236, 377]]);
var n103 = t([[24, 393], [25, 393], [26, 393], [27, 394], [28, 388], [29, 387], [30, 389], [31, 393], [32, 388], [33, 390], [34, 389], [35, 390], [36, 391], [224, 400], [225, 401], [226, 402], [227, 403], [228, 404], [229, 405], [230, 406], [231, 407], [232, 408], [233, 409], [234, 410], [235, 411], [3, 379], [4, 380], [5, 381], [6, 382], [236, 412]]);
var n104 = t([[24, 428], [25, 428], [26, 428], [27, 429], [28, 423], [29, 422], [30, 424], [31, 428], [32, 423], [33, 425], [34, 424], [35, 425], [36, 426], [224, 435], [225, 436], [226, 437], [227, 438], [228, 439], [229, 440], [230, 441], [231, 442], [232, 443], [233, 444], [234, 445], [235, 446], [3, 414], [4, 415], [5, 416], [6, 417], [236, 447]]);
var n105 = t([[24, 463], [25, 463], [26, 463], [27, 464], [28, 458], [29, 457], [30, 459], [31, 463], [32, 458], [33, 460], [34, 459], [35, 460], [36, 461], [224, 470], [225, 471], [226, 472], [227, 473], [228, 474], [229, 475], [230, 476], [231, 477], [232, 478], [233, 479], [234, 480], [235, 481], [3, 449], [4, 450], [5, 451], [6, 452], [236, 482]]);
var n106 = t([[24, 498], [25, 498], [26, 498], [27, 499], [28, 493], [29, 492], [30, 494], [31, 498], [32, 493], [33, 495], [34, 494], [35, 495], [36, 496], [224, 505], [225, 506], [226, 507], [227, 508], [228, 509], [229, 510], [230, 511], [231, 512], [232, 513], [233, 514], [234, 515], [235, 516], [3, 484], [4, 485], [5, 486], [6, 487], [236, 517]]);
var n107 = t([[24, 533], [25, 533], [26, 533], [27, 534], [28, 528], [29, 527], [30, 529], [31, 533], [32, 528], [33, 530], [34, 529], [35, 530], [36, 531], [224, 540], [225, 541], [226, 542], [227, 543], [228, 544], [229, 545], [230, 546], [231, 547], [232, 548], [233, 549], [234, 550], [235, 551], [3, 519], [4, 520], [5, 521], [6, 522], [236, 552]]);
var n108 = t([[24, 568], [25, 568], [26, 568], [27, 569], [28, 563], [29, 562], [30, 564], [31, 568], [32, 563], [33, 565], [34, 564], [35, 565], [36, 566], [224, 575], [225, 576], [226, 577], [227, 578], [228, 579], [229, 580], [230, 581], [231, 582], [232, 583], [233, 584], [234, 585], [235, 586], [3, 554], [4, 555], [5, 556], [6, 557], [236, 587]]);
var n109 = t([[24, 603], [25, 603], [26, 603], [27, 604], [28, 598], [29, 597], [30, 599], [31, 603], [32, 598], [33, 600], [34, 599], [35, 600], [36, 601], [224, 610], [225, 611], [226, 612], [227, 613], [228, 614], [229, 615], [230, 616], [231, 617], [232, 618], [233, 619], [234, 620], [235, 621], [3, 589], [4, 590], [5, 591], [6, 592], [236, 622]]);
var n110 = t([[24, 638], [25, 638], [26, 638], [27, 639], [28, 633], [29, 632], [30, 634], [31, 638], [32, 633], [33, 635], [34, 634], [35, 635], [36, 636], [224, 645], [225, 646], [226, 647], [227, 648], [228, 649], [229, 650], [230, 651], [231, 652], [232, 653], [233, 654], [234, 655], [235, 656], [3, 624], [4, 625], [5, 626], [6, 627], [236, 657]]);
var n111 = t([[24, 671], [25, 671], [26, 671], [27, 672], [28, 667], [29, 666], [30, 668], [31, 671], [32, 667], [33, 197], [34, 668], [35, 197], [36, 669], [224, 678], [225, 679], [226, 680], [227, 681], [228, 682], [229, 683], [230, 684], [231, 685], [232, 686], [233, 687], [234, 688], [235, 689], [3, 659], [4, 660], [5, 661], [6, 662], [236, 690]]);
var n112 = t([[24, 17], [25, 18], [26, 17], [27, 16], [28, 12], [29, 13], [30, 11], [31, 17], [32, 12], [33, 14], [34, 15], [35, 14], [36, 13], [224, 199], [225, 200], [226, 201], [227, 202], [228, 203], [229, 204], [230, 205], [231, 206], [232, 207], [233, 208], [234, 209], [235, 210], [3, 3], [4, 4], [5, 5], [6, 6], [236, 211]]);
var n113 = t([[24, 703], [25, 9], [26, 703], [27, 702], [28, 699], [29, 700], [30, 698], [31, 703], [32, 699], [33, 671], [34, 701], [35, 671], [36, 700], [224, 709], [225, 710], [226, 711], [227, 712], [228, 713], [229, 714], [230, 715], [231, 716], [232, 717], [233, 718], [234, 719], [235, 720], [3, 692], [4, 693], [5, 694], [6, 695], [236, 721]]);
var n114 = t([[24, 736], [25, 737], [26, 736], [27, 735], [28, 732], [29, 733], [30, 731], [31, 736], [32, 732], [33, 734], [34, 391], [35, 734], [36, 733], [224, 743], [225, 744], [226, 745], [227, 746], [228, 747], [229, 748], [230, 749], [231, 750], [232, 751], [233, 752], [234, 753], [235, 754], [3, 723], [4, 724], [5, 725], [6, 726], [236, 755]]);
var n115 = t([[24, 770], [25, 771], [26, 770], [27, 769], [28, 766], [29, 767], [30, 765], [31, 770], [32, 766], [33, 768], [34, 426], [35, 768], [36, 767], [224, 777], [225, 778], [226, 779], [227, 780], [228, 781], [229, 782], [230, 783], [231, 784], [232, 785], [233, 786], [234, 787], [235, 788], [3, 757], [4, 758], [5, 759], [6, 760], [236, 789]]);
var n116 = t([[24, 804], [25, 805], [26, 804], [27, 803], [28, 800], [29, 801], [30, 799], [31, 804], [32, 800], [33, 802], [34, 461], [35, 802], [36, 801], [224, 811], [225, 812], [226, 813], [227, 814], [228, 815], [229, 816], [230, 817], [231, 818], [232, 819], [233, 820], [234, 821], [235, 822], [3, 791], [4, 792], [5, 793], [6, 794], [236, 823]]);
var n117 = t([[24, 838], [25, 839], [26, 838], [27, 837], [28, 834], [29, 835], [30, 833], [31, 838], [32, 834], [33, 836], [34, 496], [35, 836], [36, 835], [224, 845], [225, 846], [226, 847], [227, 848], [228, 849], [229, 850], [230, 851], [231, 852], [232, 853], [233, 854], [234, 855], [235, 856], [3, 825], [4, 826], [5, 827], [6, 828], [236, 857]]);
var n118 = t([[24, 872], [25, 873], [26, 872], [27, 871], [28, 868], [29, 869], [30, 867], [31, 872], [32, 868], [33, 870], [34, 531], [35, 870], [36, 869], [224, 879], [225, 880], [226, 881], [227, 882], [228, 883], [229, 884], [230, 885], [231, 886], [232, 887], [233, 888], [234, 889], [235, 890], [3, 859], [4, 860], [5, 861], [6, 862], [236, 891]]);
var n119 = t([[24, 906], [25, 907], [26, 906], [27, 905], [28, 902], [29, 903], [30, 901], [31, 906], [32, 902], [33, 904], [34, 566], [35, 904], [36, 903], [224, 913], [225, 914], [226, 915], [227, 916], [228, 917], [229, 918], [230, 919], [231, 920], [232, 921], [233, 922], [234, 923], [235, 924], [3, 893], [4, 894], [5, 895], [6, 896], [236, 925]]);
var n120 = t([[24, 940], [25, 941], [26, 940], [27, 939], [28, 936], [29, 937], [30, 935], [31, 940], [32, 936], [33, 938], [34, 601], [35, 938], [36, 937], [224, 947], [225, 948], [226, 949], [227, 950], [228, 951], [229, 952], [230, 953], [231, 954], [232, 955], [233, 956], [234, 957], [235, 958], [3, 927], [4, 928], [5, 929], [6, 930], [236, 959]]);
var n121 = t([[24, 974], [25, 975], [26, 974], [27, 973], [28, 970], [29, 971], [30, 969], [31, 974], [32, 970], [33, 972], [34, 636], [35, 972], [36, 971], [224, 981], [225, 982], [226, 983], [227, 984], [228, 985], [229, 986], [230, 987], [231, 988], [232, 989], [233, 990], [234, 991], [235, 992], [3, 961], [4, 962], [5, 963], [6, 964], [236, 993]]);
var n122 = t([[24, 671], [25, 672], [26, 671], [27, 670], [28, 667], [29, 668], [30, 666], [31, 671], [32, 667], [33, 197], [34, 669], [35, 197], [36, 668], [224, 678], [225, 679], [226, 680], [227, 681], [228, 682], [229, 683], [230, 684], [231, 685], [232, 686], [233, 687], [234, 688], [235, 689], [3, 659], [4, 660], [5, 661], [6, 662], [236, 690]]);
var themes = {
  light: n1,
  dark: n2,
  light_accent: n3,
  light_white_accent: n3,
  dark_accent: n4,
  dark_black_accent: n4,
  light_black: n5,
  light_white: n6,
  light_gray: n7,
  light_blue: n8,
  light_red: n9,
  light_yellow: n10,
  light_green: n11,
  light_orange: n12,
  light_pink: n13,
  light_purple: n14,
  light_teal: n15,
  light_neutral: n16,
  dark_black: n17,
  dark_white: n18,
  dark_gray: n19,
  dark_blue: n20,
  dark_red: n21,
  dark_yellow: n22,
  dark_green: n23,
  dark_orange: n24,
  dark_pink: n25,
  dark_purple: n26,
  dark_teal: n27,
  dark_neutral: n28,
  light_surface1: n29,
  light_white_surface1: n29,
  light_Input: n29,
  light_Progress: n29,
  light_Slider: n29,
  light_Switch: n29,
  light_TextArea: n29,
  light_white_Input: n29,
  light_white_Progress: n29,
  light_white_Slider: n29,
  light_white_Switch: n29,
  light_white_TextArea: n29,
  light_surface2: n30,
  light_white_surface2: n30,
  light_SliderThumb: n30,
  light_white_SliderThumb: n30,
  dark_surface1: n31,
  dark_black_surface1: n31,
  dark_Input: n31,
  dark_Progress: n31,
  dark_Slider: n31,
  dark_Switch: n31,
  dark_TextArea: n31,
  dark_black_Input: n31,
  dark_black_Progress: n31,
  dark_black_Slider: n31,
  dark_black_Switch: n31,
  dark_black_TextArea: n31,
  dark_surface2: n32,
  dark_black_surface2: n32,
  dark_SliderThumb: n32,
  dark_black_SliderThumb: n32,
  light_black_accent: n33,
  light_black_surface1: n34,
  light_black_Input: n34,
  light_black_Progress: n34,
  light_black_Slider: n34,
  light_black_Switch: n34,
  light_black_TextArea: n34,
  light_black_surface2: n35,
  light_black_SliderThumb: n35,
  light_gray_accent: n36,
  light_gray_surface1: n37,
  light_gray_Input: n37,
  light_gray_Progress: n37,
  light_gray_Slider: n37,
  light_gray_Switch: n37,
  light_gray_TextArea: n37,
  light_gray_surface2: n38,
  light_gray_SliderThumb: n38,
  light_blue_accent: n39,
  light_blue_surface1: n40,
  light_blue_Input: n40,
  light_blue_Progress: n40,
  light_blue_Slider: n40,
  light_blue_Switch: n40,
  light_blue_TextArea: n40,
  light_blue_surface2: n41,
  light_blue_SliderThumb: n41,
  light_red_accent: n42,
  light_red_surface1: n43,
  light_red_Input: n43,
  light_red_Progress: n43,
  light_red_Slider: n43,
  light_red_Switch: n43,
  light_red_TextArea: n43,
  light_red_surface2: n44,
  light_red_SliderThumb: n44,
  light_yellow_accent: n45,
  light_yellow_surface1: n46,
  light_yellow_Input: n46,
  light_yellow_Progress: n46,
  light_yellow_Slider: n46,
  light_yellow_Switch: n46,
  light_yellow_TextArea: n46,
  light_yellow_surface2: n47,
  light_yellow_SliderThumb: n47,
  light_green_accent: n48,
  light_green_surface1: n49,
  light_green_Input: n49,
  light_green_Progress: n49,
  light_green_Slider: n49,
  light_green_Switch: n49,
  light_green_TextArea: n49,
  light_green_surface2: n50,
  light_green_SliderThumb: n50,
  light_orange_accent: n51,
  light_orange_surface1: n52,
  light_orange_Input: n52,
  light_orange_Progress: n52,
  light_orange_Slider: n52,
  light_orange_Switch: n52,
  light_orange_TextArea: n52,
  light_orange_surface2: n53,
  light_orange_SliderThumb: n53,
  light_pink_accent: n54,
  light_pink_surface1: n55,
  light_pink_Input: n55,
  light_pink_Progress: n55,
  light_pink_Slider: n55,
  light_pink_Switch: n55,
  light_pink_TextArea: n55,
  light_pink_surface2: n56,
  light_pink_SliderThumb: n56,
  light_purple_accent: n57,
  light_purple_surface1: n58,
  light_purple_Input: n58,
  light_purple_Progress: n58,
  light_purple_Slider: n58,
  light_purple_Switch: n58,
  light_purple_TextArea: n58,
  light_purple_surface2: n59,
  light_purple_SliderThumb: n59,
  light_teal_accent: n60,
  light_teal_surface1: n61,
  light_teal_Input: n61,
  light_teal_Progress: n61,
  light_teal_Slider: n61,
  light_teal_Switch: n61,
  light_teal_TextArea: n61,
  light_teal_surface2: n62,
  light_teal_SliderThumb: n62,
  light_neutral_accent: n63,
  light_neutral_surface1: n64,
  light_neutral_Input: n64,
  light_neutral_Progress: n64,
  light_neutral_Slider: n64,
  light_neutral_Switch: n64,
  light_neutral_TextArea: n64,
  light_neutral_surface2: n65,
  light_neutral_SliderThumb: n65,
  dark_white_accent: n66,
  dark_white_surface1: n67,
  dark_white_Input: n67,
  dark_white_Progress: n67,
  dark_white_Slider: n67,
  dark_white_Switch: n67,
  dark_white_TextArea: n67,
  dark_white_surface2: n68,
  dark_white_SliderThumb: n68,
  dark_gray_accent: n69,
  dark_gray_surface1: n70,
  dark_gray_Input: n70,
  dark_gray_Progress: n70,
  dark_gray_Slider: n70,
  dark_gray_Switch: n70,
  dark_gray_TextArea: n70,
  dark_gray_surface2: n71,
  dark_gray_SliderThumb: n71,
  dark_blue_accent: n72,
  dark_blue_surface1: n73,
  dark_blue_Input: n73,
  dark_blue_Progress: n73,
  dark_blue_Slider: n73,
  dark_blue_Switch: n73,
  dark_blue_TextArea: n73,
  dark_blue_surface2: n74,
  dark_blue_SliderThumb: n74,
  dark_red_accent: n75,
  dark_red_surface1: n76,
  dark_red_Input: n76,
  dark_red_Progress: n76,
  dark_red_Slider: n76,
  dark_red_Switch: n76,
  dark_red_TextArea: n76,
  dark_red_surface2: n77,
  dark_red_SliderThumb: n77,
  dark_yellow_accent: n78,
  dark_yellow_surface1: n79,
  dark_yellow_Input: n79,
  dark_yellow_Progress: n79,
  dark_yellow_Slider: n79,
  dark_yellow_Switch: n79,
  dark_yellow_TextArea: n79,
  dark_yellow_surface2: n80,
  dark_yellow_SliderThumb: n80,
  dark_green_accent: n81,
  dark_green_surface1: n82,
  dark_green_Input: n82,
  dark_green_Progress: n82,
  dark_green_Slider: n82,
  dark_green_Switch: n82,
  dark_green_TextArea: n82,
  dark_green_surface2: n83,
  dark_green_SliderThumb: n83,
  dark_orange_accent: n84,
  dark_orange_surface1: n85,
  dark_orange_Input: n85,
  dark_orange_Progress: n85,
  dark_orange_Slider: n85,
  dark_orange_Switch: n85,
  dark_orange_TextArea: n85,
  dark_orange_surface2: n86,
  dark_orange_SliderThumb: n86,
  dark_pink_accent: n87,
  dark_pink_surface1: n88,
  dark_pink_Input: n88,
  dark_pink_Progress: n88,
  dark_pink_Slider: n88,
  dark_pink_Switch: n88,
  dark_pink_TextArea: n88,
  dark_pink_surface2: n89,
  dark_pink_SliderThumb: n89,
  dark_purple_accent: n90,
  dark_purple_surface1: n91,
  dark_purple_Input: n91,
  dark_purple_Progress: n91,
  dark_purple_Slider: n91,
  dark_purple_Switch: n91,
  dark_purple_TextArea: n91,
  dark_purple_surface2: n92,
  dark_purple_SliderThumb: n92,
  dark_teal_accent: n93,
  dark_teal_surface1: n94,
  dark_teal_Input: n94,
  dark_teal_Progress: n94,
  dark_teal_Slider: n94,
  dark_teal_Switch: n94,
  dark_teal_TextArea: n94,
  dark_teal_surface2: n95,
  dark_teal_SliderThumb: n95,
  dark_neutral_accent: n96,
  dark_neutral_surface1: n97,
  dark_neutral_Input: n97,
  dark_neutral_Progress: n97,
  dark_neutral_Slider: n97,
  dark_neutral_Switch: n97,
  dark_neutral_TextArea: n97,
  dark_neutral_surface2: n98,
  dark_neutral_SliderThumb: n98,
  light_Button: n99,
  light_ProgressIndicator: n99,
  light_SliderActive: n99,
  light_Tooltip: n99,
  light_SwitchThumb: n99,
  light_white_Button: n99,
  light_white_ProgressIndicator: n99,
  light_white_SliderActive: n99,
  light_white_Tooltip: n99,
  light_white_SwitchThumb: n99,
  dark_Button: n100,
  dark_ProgressIndicator: n100,
  dark_SliderActive: n100,
  dark_Tooltip: n100,
  dark_SwitchThumb: n100,
  dark_black_Button: n100,
  dark_black_ProgressIndicator: n100,
  dark_black_SliderActive: n100,
  dark_black_Tooltip: n100,
  dark_black_SwitchThumb: n100,
  light_black_Button: n101,
  light_black_ProgressIndicator: n101,
  light_black_SliderActive: n101,
  light_black_Tooltip: n101,
  light_black_SwitchThumb: n101,
  light_gray_Button: n102,
  light_gray_ProgressIndicator: n102,
  light_gray_SliderActive: n102,
  light_gray_Tooltip: n102,
  light_gray_SwitchThumb: n102,
  light_blue_Button: n103,
  light_blue_ProgressIndicator: n103,
  light_blue_SliderActive: n103,
  light_blue_Tooltip: n103,
  light_blue_SwitchThumb: n103,
  light_red_Button: n104,
  light_red_ProgressIndicator: n104,
  light_red_SliderActive: n104,
  light_red_Tooltip: n104,
  light_red_SwitchThumb: n104,
  light_yellow_Button: n105,
  light_yellow_ProgressIndicator: n105,
  light_yellow_SliderActive: n105,
  light_yellow_Tooltip: n105,
  light_yellow_SwitchThumb: n105,
  light_green_Button: n106,
  light_green_ProgressIndicator: n106,
  light_green_SliderActive: n106,
  light_green_Tooltip: n106,
  light_green_SwitchThumb: n106,
  light_orange_Button: n107,
  light_orange_ProgressIndicator: n107,
  light_orange_SliderActive: n107,
  light_orange_Tooltip: n107,
  light_orange_SwitchThumb: n107,
  light_pink_Button: n108,
  light_pink_ProgressIndicator: n108,
  light_pink_SliderActive: n108,
  light_pink_Tooltip: n108,
  light_pink_SwitchThumb: n108,
  light_purple_Button: n109,
  light_purple_ProgressIndicator: n109,
  light_purple_SliderActive: n109,
  light_purple_Tooltip: n109,
  light_purple_SwitchThumb: n109,
  light_teal_Button: n110,
  light_teal_ProgressIndicator: n110,
  light_teal_SliderActive: n110,
  light_teal_Tooltip: n110,
  light_teal_SwitchThumb: n110,
  light_neutral_Button: n111,
  light_neutral_ProgressIndicator: n111,
  light_neutral_SliderActive: n111,
  light_neutral_Tooltip: n111,
  light_neutral_SwitchThumb: n111,
  dark_white_Button: n112,
  dark_white_ProgressIndicator: n112,
  dark_white_SliderActive: n112,
  dark_white_Tooltip: n112,
  dark_white_SwitchThumb: n112,
  dark_gray_Button: n113,
  dark_gray_ProgressIndicator: n113,
  dark_gray_SliderActive: n113,
  dark_gray_Tooltip: n113,
  dark_gray_SwitchThumb: n113,
  dark_blue_Button: n114,
  dark_blue_ProgressIndicator: n114,
  dark_blue_SliderActive: n114,
  dark_blue_Tooltip: n114,
  dark_blue_SwitchThumb: n114,
  dark_red_Button: n115,
  dark_red_ProgressIndicator: n115,
  dark_red_SliderActive: n115,
  dark_red_Tooltip: n115,
  dark_red_SwitchThumb: n115,
  dark_yellow_Button: n116,
  dark_yellow_ProgressIndicator: n116,
  dark_yellow_SliderActive: n116,
  dark_yellow_Tooltip: n116,
  dark_yellow_SwitchThumb: n116,
  dark_green_Button: n117,
  dark_green_ProgressIndicator: n117,
  dark_green_SliderActive: n117,
  dark_green_Tooltip: n117,
  dark_green_SwitchThumb: n117,
  dark_orange_Button: n118,
  dark_orange_ProgressIndicator: n118,
  dark_orange_SliderActive: n118,
  dark_orange_Tooltip: n118,
  dark_orange_SwitchThumb: n118,
  dark_pink_Button: n119,
  dark_pink_ProgressIndicator: n119,
  dark_pink_SliderActive: n119,
  dark_pink_Tooltip: n119,
  dark_pink_SwitchThumb: n119,
  dark_purple_Button: n120,
  dark_purple_ProgressIndicator: n120,
  dark_purple_SliderActive: n120,
  dark_purple_Tooltip: n120,
  dark_purple_SwitchThumb: n120,
  dark_teal_Button: n121,
  dark_teal_ProgressIndicator: n121,
  dark_teal_SliderActive: n121,
  dark_teal_Tooltip: n121,
  dark_teal_SwitchThumb: n121,
  dark_neutral_Button: n122,
  dark_neutral_ProgressIndicator: n122,
  dark_neutral_SliderActive: n122,
  dark_neutral_Tooltip: n122,
  dark_neutral_SwitchThumb: n122
};

// ../../node_modules/.pnpm/@tamagui+themes@2.0.0-rc.0__7a3bd2383ffd4867a2dd6d13917ae8c2/node_modules/@tamagui/themes/dist/esm/v5-templates.mjs
var objectFromEntries3 = /* @__PURE__ */ __name((entries) => Object.fromEntries(entries), "objectFromEntries");
var objectKeys2 = /* @__PURE__ */ __name((obj) => Object.keys(obj), "objectKeys");
var getTemplates2 = /* @__PURE__ */ __name(() => {
  const lightTemplates = getBaseTemplates2("light"), darkTemplates = getBaseTemplates2("dark");
  return {
    ...objectFromEntries3(objectKeys2(lightTemplates).map((name) => [`light_${name}`, lightTemplates[name]])),
    ...objectFromEntries3(objectKeys2(darkTemplates).map((name) => [`dark_${name}`, darkTemplates[name]]))
  };
}, "getTemplates");
var getBaseTemplates2 = /* @__PURE__ */ __name((scheme) => {
  const isLight = scheme === "light", lighten = isLight ? -1 : 1, darken = -lighten, background = PALETTE_BACKGROUND_OFFSET, borderColor = background + 2, color = -background, makeSurface = /* @__PURE__ */ __name((offset, colorOffset = 0) => {
    const clr = color - colorOffset, bg = background + offset, brdr = borderColor + offset;
    return {
      color: clr,
      colorHover: clr + (isLight ? 0 : lighten),
      colorPress: clr,
      colorFocus: clr + darken,
      background: bg,
      // hover lightens always
      backgroundHover: bg + lighten,
      // press darkens always
      backgroundPress: bg + darken,
      // focus: lightens in dark mode, darkens in light
      backgroundFocus: bg + offset,
      backgroundActive: bg,
      borderColor: brdr,
      borderColorHover: brdr + lighten,
      borderColorFocus: brdr,
      borderColorPress: brdr + darken
    };
  }, "makeSurface"), base = {
    accentBackground: 0,
    accentColor: -0,
    background0: 1,
    background02: 2,
    background04: 3,
    background06: 4,
    background08: 5,
    color1: background,
    color2: background + 1,
    color3: background + 2,
    color4: background + 3,
    color5: background + 4,
    color6: background + 5,
    color7: background + 6,
    color8: background + 7,
    color9: background + 8,
    color10: background + 9,
    color11: background + 10,
    color12: background + 11,
    color0: -1,
    color02: -2,
    color04: -3,
    color06: -4,
    color08: -5,
    // v5 = we make this actually 1 up (surface1 technically from before)
    // this way "generics" are automatically differentiated from base bg
    ...makeSurface(1),
    placeholderColor: color - 3,
    colorTransparent: -1
  }, surface1 = makeSurface(2, 1), surface2 = makeSurface(3, 1), surface3 = makeSurface(5, 1), accent = Object.fromEntries(Object.entries(base).map(([key, index]) => [key, -index]));
  return {
    base,
    surface1,
    surface2,
    surface3,
    accent
  };
}, "getBaseTemplates");
var v5Templates = getTemplates2();

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/dark/blue.mjs
var blue = {
  blue1: "#0d1520",
  blue2: "#111927",
  blue3: "#0d2847",
  blue4: "#003362",
  blue5: "#004074",
  blue6: "#104d87",
  blue7: "#205d9e",
  blue8: "#2870bd",
  blue9: "#0090ff",
  blue10: "#3b9eff",
  blue11: "#70b8ff",
  blue12: "#c2e6ff"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/dark/gray.mjs
var gray = {
  gray1: "#111111",
  gray2: "#191919",
  gray3: "#222222",
  gray4: "#2a2a2a",
  gray5: "#313131",
  gray6: "#3a3a3a",
  gray7: "#484848",
  gray8: "#606060",
  gray9: "#6e6e6e",
  gray10: "#7b7b7b",
  gray11: "#b4b4b4",
  gray12: "#eeeeee"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/dark/green.mjs
var green = {
  green1: "#0e1512",
  green2: "#121b17",
  green3: "#132d21",
  green4: "#113b29",
  green5: "#174933",
  green6: "#20573e",
  green7: "#28684a",
  green8: "#2f7c57",
  green9: "#30a46c",
  green10: "#33b074",
  green11: "#3dd68c",
  green12: "#b1f1cb"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/dark/orange.mjs
var orange = {
  orange1: "#17120e",
  orange2: "#1e160f",
  orange3: "#331e0b",
  orange4: "#462100",
  orange5: "#562800",
  orange6: "#66350c",
  orange7: "#7e451d",
  orange8: "#a35829",
  orange9: "#f76b15",
  orange10: "#ff801f",
  orange11: "#ffa057",
  orange12: "#ffe0c2"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/dark/pink.mjs
var pink = {
  pink1: "#191117",
  pink2: "#21121d",
  pink3: "#37172f",
  pink4: "#4b143d",
  pink5: "#591c47",
  pink6: "#692955",
  pink7: "#833869",
  pink8: "#a84885",
  pink9: "#d6409f",
  pink10: "#de51a8",
  pink11: "#ff8dcc",
  pink12: "#fdd1ea"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/dark/purple.mjs
var purple = {
  purple1: "#18111b",
  purple2: "#1e1523",
  purple3: "#301c3b",
  purple4: "#3d224e",
  purple5: "#48295c",
  purple6: "#54346b",
  purple7: "#664282",
  purple8: "#8457aa",
  purple9: "#8e4ec6",
  purple10: "#9a5cd0",
  purple11: "#d19dff",
  purple12: "#ecd9fa"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/dark/red.mjs
var red = {
  red1: "#191111",
  red2: "#201314",
  red3: "#3b1219",
  red4: "#500f1c",
  red5: "#611623",
  red6: "#72232d",
  red7: "#8c333a",
  red8: "#b54548",
  red9: "#e5484d",
  red10: "#ec5d5e",
  red11: "#ff9592",
  red12: "#ffd1d9"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/dark/teal.mjs
var teal = {
  teal1: "#0d1514",
  teal2: "#111c1b",
  teal3: "#0d2d2a",
  teal4: "#023b37",
  teal5: "#084843",
  teal6: "#145750",
  teal7: "#1c6961",
  teal8: "#207e73",
  teal9: "#12a594",
  teal10: "#0eb39e",
  teal11: "#0bd8b6",
  teal12: "#adf0dd"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/dark/yellow.mjs
var yellow = {
  yellow1: "#14120b",
  yellow2: "#1b180f",
  yellow3: "#2d2305",
  yellow4: "#362b00",
  yellow5: "#433500",
  yellow6: "#524202",
  yellow7: "#665417",
  yellow8: "#836a21",
  yellow9: "#ffe629",
  yellow10: "#ffff57",
  yellow11: "#f5e147",
  yellow12: "#f6eeb4"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/light/blue.mjs
var blue2 = {
  blue1: "#fbfdff",
  blue2: "#f4faff",
  blue3: "#e6f4fe",
  blue4: "#d5efff",
  blue5: "#c2e5ff",
  blue6: "#acd8fc",
  blue7: "#8ec8f6",
  blue8: "#5eb1ef",
  blue9: "#0090ff",
  blue10: "#0588f0",
  blue11: "#0d74ce",
  blue12: "#113264"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/light/gray.mjs
var gray2 = {
  gray1: "#fcfcfc",
  gray2: "#f9f9f9",
  gray3: "#f0f0f0",
  gray4: "#e8e8e8",
  gray5: "#e0e0e0",
  gray6: "#d9d9d9",
  gray7: "#cecece",
  gray8: "#bbbbbb",
  gray9: "#8d8d8d",
  gray10: "#838383",
  gray11: "#646464",
  gray12: "#202020"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/light/green.mjs
var green2 = {
  green1: "#fbfefc",
  green2: "#f4fbf6",
  green3: "#e6f6eb",
  green4: "#d6f1df",
  green5: "#c4e8d1",
  green6: "#adddc0",
  green7: "#8eceaa",
  green8: "#5bb98b",
  green9: "#30a46c",
  green10: "#2b9a66",
  green11: "#218358",
  green12: "#193b2d"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/light/orange.mjs
var orange2 = {
  orange1: "#fefcfb",
  orange2: "#fff7ed",
  orange3: "#ffefd6",
  orange4: "#ffdfb5",
  orange5: "#ffd19a",
  orange6: "#ffc182",
  orange7: "#f5ae73",
  orange8: "#ec9455",
  orange9: "#f76b15",
  orange10: "#ef5f00",
  orange11: "#cc4e00",
  orange12: "#582d1d"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/light/pink.mjs
var pink2 = {
  pink1: "#fffcfe",
  pink2: "#fef7fb",
  pink3: "#fee9f5",
  pink4: "#fbdcef",
  pink5: "#f6cee7",
  pink6: "#efbfdd",
  pink7: "#e7acd0",
  pink8: "#dd93c2",
  pink9: "#d6409f",
  pink10: "#cf3897",
  pink11: "#c2298a",
  pink12: "#651249"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/light/purple.mjs
var purple2 = {
  purple1: "#fefcfe",
  purple2: "#fbf7fe",
  purple3: "#f7edfe",
  purple4: "#f2e2fc",
  purple5: "#ead5f9",
  purple6: "#e0c4f4",
  purple7: "#d1afec",
  purple8: "#be93e4",
  purple9: "#8e4ec6",
  purple10: "#8347b9",
  purple11: "#8145b5",
  purple12: "#402060"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/light/red.mjs
var red2 = {
  red1: "#fffcfc",
  red2: "#fff7f7",
  red3: "#feebec",
  red4: "#ffdbdc",
  red5: "#ffcdce",
  red6: "#fdbdbe",
  red7: "#f4a9aa",
  red8: "#eb8e90",
  red9: "#e5484d",
  red10: "#dc3e42",
  red11: "#ce2c31",
  red12: "#641723"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/light/teal.mjs
var teal2 = {
  teal1: "#fafefd",
  teal2: "#f3fbf9",
  teal3: "#e0f8f3",
  teal4: "#ccf3ea",
  teal5: "#b8eae0",
  teal6: "#a1ded2",
  teal7: "#83cdc1",
  teal8: "#53b9ab",
  teal9: "#12a594",
  teal10: "#0d9b8a",
  teal11: "#008573",
  teal12: "#0d3d38"
};

// ../../node_modules/.pnpm/@tamagui+colors@2.0.0-rc.0/node_modules/@tamagui/colors/dist/esm/light/yellow.mjs
var yellow2 = {
  yellow1: "#fdfdf9",
  yellow2: "#fefce9",
  yellow3: "#fffab8",
  yellow4: "#fff394",
  yellow5: "#ffe770",
  yellow6: "#f3d768",
  yellow7: "#e4c767",
  yellow8: "#d5ae39",
  yellow9: "#ffe629",
  yellow10: "#ffdc00",
  yellow11: "#9e6c00",
  yellow12: "#473b1f"
};

// ../../node_modules/.pnpm/@tamagui+themes@2.0.0-rc.0__7a3bd2383ffd4867a2dd6d13917ae8c2/node_modules/@tamagui/themes/dist/esm/opacify.mjs
function opacify(color, opacity = 0.1) {
  if (typeof color != "string") return color;
  if (color.startsWith("hsl")) {
    const match = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
    if (match) {
      const [, h, s, l] = match;
      return `hsla(${h}, ${s}%, ${l}%, ${opacity})`;
    }
  }
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3 && (hex = hex.split("").map((c) => c + c).join("")), hex.length === 6 || hex.length === 8) {
      const alphaHex = Math.round(opacity * 255).toString(16).padStart(2, "0");
      return `#${hex.slice(0, 6)}${alphaHex}`;
    }
  }
  return color;
}
__name(opacify, "opacify");

// ../../node_modules/.pnpm/@tamagui+themes@2.0.0-rc.0__7a3bd2383ffd4867a2dd6d13917ae8c2/node_modules/@tamagui/themes/dist/esm/v5-themes.mjs
var V5_BG_OFFSET = 7;
var v5ComponentThemes = {
  Button: {
    template: "surface3"
  },
  Input: {
    template: "surface1"
  },
  Progress: {
    template: "surface1"
  },
  ProgressIndicator: {
    template: "surface3"
  },
  Slider: {
    template: "surface1"
  },
  SliderActive: {
    template: "surface3"
  },
  SliderThumb: {
    template: "surface2"
  },
  Switch: {
    template: "surface1"
  },
  TextArea: {
    template: "surface1"
  },
  Tooltip: {
    template: "surface3"
  },
  SwitchThumb: {
    template: "surface3"
  }
};
var v5ComponentThemesWithInverses = {
  ...v5ComponentThemes,
  ProgressIndicator: {
    template: "accent"
  },
  SliderThumb: {
    template: "accent"
  },
  SwitchThumb: {
    template: "accent"
  },
  Tooltip: {
    template: "accent"
  }
};
var v5GrandchildrenThemes = {
  accent: {
    template: "accent"
  },
  surface1: {
    template: "surface1"
  },
  surface2: {
    template: "surface2"
  }
};
function paletteToNamedColors(name, palette) {
  return Object.fromEntries(palette.map((color, i) => [`${name}${i + 1}`, color]));
}
__name(paletteToNamedColors, "paletteToNamedColors");
var darkPalette = ["#090909", "#151515", "#191919", "#232323", "#333", "#444", "#666", "#777", "#858585", "#aaa", "#ccc", "#ffffff"];
var lightPalette = ["#fff", "#f8f8f8", "hsl(0, 0%, 93%)", "hsl(0, 0%, 87%)", "hsl(0, 0%, 80%)", "hsl(0, 0%, 70%)", "hsl(0, 0%, 59%)", "hsl(0, 0%, 45%)", "hsl(0, 0%, 30%)", "hsl(0, 0%, 20%)", "hsl(0, 0%, 14%)", "hsl(0, 0%, 2%)"];
var neutralPalette = ["hsl(0, 0%, 68%)", "hsl(0, 0%, 65%)", "hsl(0, 0%, 62%)", "hsl(0, 0%, 59%)", "hsl(0, 0%, 56%)", "hsl(0, 0%, 53%)", "hsl(0, 0%, 50%)", "hsl(0, 0%, 47%)", "hsl(0, 0%, 44%)", "hsl(0, 0%, 41%)", "hsl(0, 0%, 38%)", "hsl(0, 0%, 32%)"];
var neutral = paletteToNamedColors("neutral", neutralPalette);
var whiteBlack = {
  white: "rgba(255,255,255,1)",
  white0: "rgba(255,255,255,0)",
  white02: "rgba(255,255,255,0.2)",
  white04: "rgba(255,255,255,0.4)",
  white06: "rgba(255,255,255,0.6)",
  white08: "rgba(255,255,255,0.8)",
  black: "rgba(0,0,0,1)",
  black0: "rgba(0,0,0,0)",
  black02: "rgba(0,0,0,0.2)",
  black04: "rgba(0,0,0,0.4)",
  black06: "rgba(0,0,0,0.6)",
  black08: "rgba(0,0,0,0.8)"
};
var darkShadows = {
  shadow1: "rgba(0,0,0,0.1)",
  shadow2: "rgba(0,0,0,0.2)",
  shadow3: "rgba(0,0,0,0.3)",
  shadow4: "rgba(0,0,0,0.45)",
  shadow5: "rgba(0,0,0,0.65)",
  shadow6: "rgba(0,0,0,0.85)",
  shadow7: "rgba(0,0,0,0.95)",
  shadow8: "rgba(0,0,0,1)"
};
var lightShadows = {
  shadow1: "rgba(0,0,0,0.05)",
  shadow2: "rgba(0,0,0,0.1)",
  shadow3: "rgba(0,0,0,0.15)",
  shadow4: "rgba(0,0,0,0.3)",
  shadow5: "rgba(0,0,0,0.4)",
  shadow6: "rgba(0,0,0,0.55)",
  shadow7: "rgba(0,0,0,0.7)",
  shadow8: "rgba(0,0,0,0.85)"
};
var darkHighlights = {
  highlight1: "rgba(255,255,255,0.1)",
  highlight2: "rgba(255,255,255,0.2)",
  highlight3: "rgba(255,255,255,0.3)",
  highlight4: "rgba(255,255,255,0.45)",
  highlight5: "rgba(255,255,255,0.65)",
  highlight6: "rgba(255,255,255,0.85)",
  highlight7: "rgba(255,255,255,0.95)",
  highlight8: "rgba(255,255,255,1)"
};
var lightHighlights = {
  highlight1: "rgba(255,255,255,0.05)",
  highlight2: "rgba(255,255,255,0.1)",
  highlight3: "rgba(255,255,255,0.15)",
  highlight4: "rgba(255,255,255,0.3)",
  highlight5: "rgba(255,255,255,0.4)",
  highlight6: "rgba(255,255,255,0.55)",
  highlight7: "rgba(255,255,255,0.7)",
  highlight8: "rgba(255,255,255,0.85)"
};
var defaultChildrenThemes = {
  gray: {
    light: gray2,
    dark: gray
  },
  blue: {
    light: blue2,
    dark: blue
  },
  red: {
    light: red2,
    dark: red
  },
  yellow: {
    light: yellow2,
    dark: yellow
  },
  green: {
    light: green2,
    dark: green
  },
  orange: {
    light: orange2,
    dark: orange
  },
  pink: {
    light: pink2,
    dark: pink
  },
  purple: {
    light: purple2,
    dark: purple
  },
  teal: {
    light: teal2,
    dark: teal
  },
  neutral: {
    light: neutral,
    dark: neutral
  }
};
function createV5Theme(options = {}) {
  const {
    darkPalette: customDarkPalette = darkPalette,
    lightPalette: customLightPalette = lightPalette,
    childrenThemes = defaultChildrenThemes,
    grandChildrenThemes = v5GrandchildrenThemes,
    componentThemes: customComponentThemes = v5ComponentThemes
  } = options, blackColors = paletteToNamedColors("black", customDarkPalette), whiteColors = paletteToNamedColors("white", customLightPalette), extraBase = {
    ...blackColors,
    ...whiteColors,
    ...whiteBlack
  }, lightExtraBase = {
    ...extraBase,
    ...lightShadows,
    ...lightHighlights,
    shadowColor: lightShadows.shadow3
  }, darkExtraBase = {
    ...extraBase,
    ...darkShadows,
    ...darkHighlights,
    shadowColor: darkShadows.shadow3
  }, lightExtra = {
    ...lightExtraBase
  }, darkExtra = {
    ...darkExtraBase
  };
  for (const theme of Object.values(childrenThemes)) theme.light && Object.assign(lightExtra, theme.light), theme.dark && Object.assign(darkExtra, theme.dark);
  const childrenWithPalettes = {
    // Always include black/white for theme generation
    black: {
      palette: {
        dark: Object.values(blackColors),
        light: Object.values(blackColors)
      }
    },
    white: {
      palette: {
        dark: Object.values(whiteColors),
        light: Object.values(whiteColors)
      }
    },
    ...Object.fromEntries(Object.entries(childrenThemes).map(([name, theme]) => [name, {
      palette: {
        light: Object.values(theme.light),
        dark: Object.values(theme.dark)
      }
    }]))
  };
  return createThemes({
    // componentThemes: false disables them, undefined/truthy values enable them
    componentThemes: customComponentThemes,
    templates: v5Templates,
    base: {
      palette: {
        dark: customDarkPalette,
        light: customLightPalette
      },
      extra: {
        light: lightExtra,
        dark: darkExtra
      }
    },
    accent: {
      palette: {
        dark: customLightPalette,
        light: customDarkPalette
      }
    },
    childrenThemes: childrenWithPalettes,
    grandChildrenThemes,
    // Add computed colors to ALL themes based on each theme's palette
    getTheme: /* @__PURE__ */ __name(({
      palette,
      scheme
    }) => {
      if (!palette || palette.length < 3) throw new Error(`invalid palette: ${JSON.stringify(palette)}`);
      const bgColor = palette[V5_BG_OFFSET], fgColor = palette[palette.length - 2];
      return {
        // Opacity variants of foreground color
        color01: opacify(fgColor, 0.1),
        color0075: opacify(fgColor, 0.075),
        color005: opacify(fgColor, 0.05),
        color0025: opacify(fgColor, 0.025),
        color002: opacify(fgColor, 0.02),
        color001: opacify(fgColor, 0.01),
        // Opacity variants of background color
        background01: opacify(bgColor, 0.1),
        background0075: opacify(bgColor, 0.075),
        background005: opacify(bgColor, 0.05),
        background0025: opacify(bgColor, 0.025),
        background002: opacify(bgColor, 0.02),
        background001: opacify(bgColor, 0.01),
        background02: opacify(bgColor, 0.2),
        background04: opacify(bgColor, 0.4),
        background06: opacify(bgColor, 0.6),
        background08: opacify(bgColor, 0.8),
        // a slightly stronger but translucent color
        outlineColor: opacify(palette[V5_BG_OFFSET + 4], 0.6)
      };
    }, "getTheme")
  });
}
__name(createV5Theme, "createV5Theme");
var themes2 = createV5Theme();
themes2.dark.background0075;
themes2.dark_yellow.background0075;
themes2.dark.background;
themes2.dark.accent1;
themes2.dark.nonValid;

// ../../node_modules/.pnpm/@tamagui+themes@2.0.0-rc.0__7a3bd2383ffd4867a2dd6d13917ae8c2/node_modules/@tamagui/themes/dist/esm/utils.mjs
function sizeToSpace(v) {
  return v === 0 ? 0 : v === 2 ? 0.5 : v === 4 ? 1 : v === 8 ? 1.5 : v <= 16 ? Math.round(v * 0.333) : Math.floor(v * 0.7 - 12);
}
__name(sizeToSpace, "sizeToSpace");

// ../../node_modules/.pnpm/@tamagui+themes@2.0.0-rc.0__7a3bd2383ffd4867a2dd6d13917ae8c2/node_modules/@tamagui/themes/dist/esm/v5-tokens.mjs
var size = {
  $0: 0,
  "$0.25": 2,
  "$0.5": 4,
  "$0.75": 8,
  $1: 20,
  "$1.5": 24,
  $2: 28,
  "$2.5": 32,
  $3: 36,
  "$3.5": 40,
  $4: 44,
  $true: 44,
  "$4.5": 48,
  $5: 52,
  $6: 64,
  $7: 74,
  $8: 84,
  $9: 94,
  $10: 104,
  $11: 124,
  $12: 144,
  $13: 164,
  $14: 184,
  $15: 204,
  $16: 224,
  $17: 224,
  $18: 244,
  $19: 264,
  $20: 284
};
var spaces = Object.entries(size).map(([k, v]) => [k, sizeToSpace(v)]);
var spacesNegative = spaces.slice(1).map(([k, v]) => [`-${k.slice(1)}`, -v]);
var space = {
  ...Object.fromEntries(spaces),
  ...Object.fromEntries(spacesNegative)
};
var zIndex = {
  0: 0,
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 500
};
var radius = {
  0: 0,
  1: 3,
  2: 5,
  3: 7,
  4: 9,
  true: 9,
  5: 10,
  6: 16,
  7: 19,
  8: 22,
  9: 26,
  10: 34,
  11: 42,
  12: 50
};
var tokens = {
  radius,
  zIndex,
  space,
  size
};

// ../../node_modules/.pnpm/@tamagui+shorthands@2.0.0-r_bc62a881f50dd288c2a57b402517476e/node_modules/@tamagui/shorthands/dist/esm/v4.mjs
var shorthands = {
  // text
  text: "textAlign",
  // view
  b: "bottom",
  bg: "backgroundColor",
  content: "alignContent",
  grow: "flexGrow",
  items: "alignItems",
  justify: "justifyContent",
  l: "left",
  m: "margin",
  maxH: "maxHeight",
  maxW: "maxWidth",
  mb: "marginBottom",
  minH: "minHeight",
  minW: "minWidth",
  ml: "marginLeft",
  mr: "marginRight",
  mt: "marginTop",
  mx: "marginHorizontal",
  my: "marginVertical",
  p: "padding",
  pb: "paddingBottom",
  pl: "paddingLeft",
  pr: "paddingRight",
  pt: "paddingTop",
  px: "paddingHorizontal",
  py: "paddingVertical",
  r: "right",
  rounded: "borderRadius",
  select: "userSelect",
  self: "alignSelf",
  shrink: "flexShrink",
  t: "top",
  z: "zIndex"
};

// ../../node_modules/.pnpm/@tamagui+config@2.0.0-rc.0__4ff2adbbf617ecf566c21655fa489bcb/node_modules/@tamagui/config/dist/esm/v5-fonts.mjs
var import_core = require("@tamagui/core");
var isWeb = true;
var isNative = false;
var webSizes = {
  1: 12,
  2: 13,
  3: 14,
  4: 15,
  true: 15,
  5: 16,
  6: 18,
  7: 22,
  8: 26,
  9: 30,
  10: 40,
  11: 46,
  12: 52,
  13: 60,
  14: 70,
  15: 85,
  16: 100
};
var nativeSizes = {
  1: 11,
  2: 12,
  3: 15,
  4: 17,
  true: 17,
  5: 20,
  6: 22,
  7: 24,
  8: 28,
  9: 32,
  10: 40,
  11: 46,
  12: 52,
  13: 60,
  14: 70,
  15: 85,
  16: 100
};
var defaultSizes = isNative ? nativeSizes : webSizes;
var defaultLineHeight = /* @__PURE__ */ __name((size2) => Math.round(isNative ? size2 * 1.25 : size2 * 1.05 + 8), "defaultLineHeight");
var createSystemFont = /* @__PURE__ */ __name(({
  font = {},
  sizeLineHeight = defaultLineHeight,
  sizeSize = /* @__PURE__ */ __name((size2) => Math.round(size2), "sizeSize")
} = {}) => {
  const size2 = Object.fromEntries(Object.entries({
    ...defaultSizes,
    ...font.size
  }).map(([k, v]) => [k, sizeSize(+v)]));
  return (0, import_core.createFont)({
    family: isWeb ? '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' : "System",
    lineHeight: Object.fromEntries(Object.entries(size2).map(([k, v]) => [k, sizeLineHeight((0, import_core.getVariableValue)(v))])),
    weight: {
      1: "400"
    },
    letterSpacing: {
      4: 0
    },
    ...font,
    size: size2
  });
}, "createSystemFont");
var headingLineHeight = /* @__PURE__ */ __name((size2) => Math.round(isNative ? size2 * 1.2 : size2 * 1.12 + 5), "headingLineHeight");
var fonts = {
  body: createSystemFont(),
  heading: createSystemFont({
    font: {
      weight: {
        0: "600",
        6: "700",
        9: "800"
      }
    },
    sizeLineHeight: headingLineHeight
  })
};

// ../../node_modules/.pnpm/@tamagui+config@2.0.0-rc.0__4ff2adbbf617ecf566c21655fa489bcb/node_modules/@tamagui/config/dist/esm/v5-media.mjs
var breakpoints = {
  xxxs: 260,
  xxs: 340,
  xs: 460,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
};
var media = {
  pointerTouch: {
    pointer: "coarse"
  },
  // Height-based queries (min-height, mobile-first)
  "height-xxxs": {
    minHeight: breakpoints.xxxs
  },
  "height-xxs": {
    minHeight: breakpoints.xxs
  },
  "height-xs": {
    minHeight: breakpoints.xs
  },
  "height-sm": {
    minHeight: breakpoints.sm
  },
  "height-md": {
    minHeight: breakpoints.md
  },
  "height-lg": {
    minHeight: breakpoints.lg
  },
  // Max-width queries (desktop-first, ordered large-to-small so smaller wins)
  "max-xxl": {
    maxWidth: breakpoints.xxl
  },
  "max-xl": {
    maxWidth: breakpoints.xl
  },
  "max-lg": {
    maxWidth: breakpoints.lg
  },
  "max-md": {
    maxWidth: breakpoints.md
  },
  "max-sm": {
    maxWidth: breakpoints.sm
  },
  "max-xs": {
    maxWidth: breakpoints.xs
  },
  "max-xxs": {
    maxWidth: breakpoints.xxs
  },
  "max-xxxs": {
    maxWidth: breakpoints.xxxs
  },
  // Min-width queries (mobile-first)
  xxxs: {
    minWidth: breakpoints.xxxs
  },
  xxs: {
    minWidth: breakpoints.xxs
  },
  xs: {
    minWidth: breakpoints.xs
  },
  sm: {
    minWidth: breakpoints.sm
  },
  md: {
    minWidth: breakpoints.md
  },
  lg: {
    minWidth: breakpoints.lg
  },
  xl: {
    minWidth: breakpoints.xl
  },
  xxl: {
    minWidth: breakpoints.xxl
  }
};
var mediaQueryDefaultActive = {
  pointerTouch: false,
  // Height queries
  "height-xxxs": true,
  "height-xxs": true,
  "height-xs": true,
  "height-sm": false,
  "height-md": false,
  "height-lg": false,
  // Max queries (ordered large-to-small to match media object)
  "max-xxl": true,
  "max-xl": true,
  "max-lg": true,
  "max-md": true,
  "max-sm": true,
  "max-xs": true,
  "max-xxs": false,
  "max-xxxs": false,
  // Min queries
  xxxs: true,
  xxs: true,
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  xxl: false
};

// ../../node_modules/.pnpm/@tamagui+config@2.0.0-rc.0__4ff2adbbf617ecf566c21655fa489bcb/node_modules/@tamagui/config/dist/esm/v5-base.mjs
var selectionStyles = /* @__PURE__ */ __name((theme) => theme.color5 ? {
  backgroundColor: theme.color5,
  color: theme.color11
} : null, "selectionStyles");
var settings = {
  mediaQueryDefaultActive,
  defaultFont: "body",
  fastSchemeChange: true,
  shouldAddPrefersColorThemes: true,
  allowedStyleValues: "somewhat-strict-web",
  addThemeClassName: "html",
  onlyAllowShorthands: true,
  styleCompat: "react-native"
};
var defaultConfig = {
  media,
  shorthands,
  themes,
  tokens,
  fonts,
  selectionStyles,
  settings
};

// src/lib/themes.ts
var darkPalette2 = [
  "hsla(260, 45%, 10%, 1)",
  // 1 - background (visible violet-black)
  "hsla(260, 40%, 14%, 1)",
  // 2 - surface
  "hsla(260, 35%, 18%, 1)",
  // 3
  "hsla(260, 32%, 22%, 1)",
  // 4
  "hsla(260, 30%, 27%, 1)",
  // 5
  "hsla(260, 28%, 32%, 1)",
  // 6
  "hsla(260, 26%, 38%, 1)",
  // 7
  "hsla(260, 24%, 45%, 1)",
  // 8
  "hsla(260, 22%, 52%, 1)",
  // 9
  "hsla(260, 25%, 62%, 1)",
  // 10
  "hsla(260, 30%, 82%, 1)",
  // 11 - muted text
  "hsla(260, 40%, 95%, 1)"
  // 12 - primary text
];
var lightPalette2 = [
  "hsla(260, 35%, 99%, 1)",
  // 1 - background
  "hsla(260, 20%, 96%, 1)",
  // 2
  "hsla(260, 15%, 92%, 1)",
  // 3
  "hsla(260, 12%, 86%, 1)",
  // 4
  "hsla(260, 10%, 78%, 1)",
  // 5
  "hsla(260, 10%, 70%, 1)",
  // 6
  "hsla(260, 10%, 60%, 1)",
  // 7
  "hsla(260, 10%, 50%, 1)",
  // 8
  "hsla(260, 10%, 40%, 1)",
  // 9
  "hsla(260, 12%, 30%, 1)",
  // 10
  "hsla(260, 15%, 15%, 1)",
  // 11
  "hsla(260, 20%, 4%, 1)"
  // 12 - primary text
];
var accentLight = {
  accent1: "hsla(262, 70%, 30%, 1)",
  accent2: "hsla(262, 72%, 35%, 1)",
  accent3: "hsla(262, 75%, 40%, 1)",
  accent4: "hsla(262, 78%, 45%, 1)",
  accent5: "hsla(262, 80%, 50%, 1)",
  accent6: "hsla(262, 83%, 55%, 1)",
  accent7: "hsla(262, 85%, 60%, 1)",
  accent8: "hsla(262, 88%, 65%, 1)",
  accent9: "hsla(262, 90%, 70%, 1)",
  accent10: "hsla(262, 91%, 76%, 1)",
  // #a78bfa
  accent11: "hsla(262, 50%, 20%, 1)",
  accent12: "hsla(262, 60%, 15%, 1)"
};
var accentDark = {
  accent1: "hsla(262, 50%, 15%, 1)",
  accent2: "hsla(262, 55%, 20%, 1)",
  accent3: "hsla(262, 60%, 25%, 1)",
  accent4: "hsla(262, 65%, 30%, 1)",
  accent5: "hsla(262, 70%, 35%, 1)",
  accent6: "hsla(262, 75%, 42%, 1)",
  accent7: "hsla(262, 80%, 50%, 1)",
  accent8: "hsla(262, 85%, 58%, 1)",
  accent9: "hsla(262, 88%, 66%, 1)",
  accent10: "hsla(262, 91%, 76%, 1)",
  // #a78bfa - your main accent
  accent11: "hsla(262, 80%, 85%, 1)",
  accent12: "hsla(262, 70%, 93%, 1)"
};
var starLight = {
  accent1: "hsla(292, 70%, 35%, 1)",
  accent2: "hsla(292, 72%, 40%, 1)",
  accent3: "hsla(292, 75%, 45%, 1)",
  accent4: "hsla(292, 78%, 50%, 1)",
  accent5: "hsla(292, 80%, 55%, 1)",
  accent6: "hsla(292, 82%, 60%, 1)",
  accent7: "hsla(292, 85%, 65%, 1)",
  accent8: "hsla(292, 87%, 70%, 1)",
  accent9: "hsla(292, 89%, 76%, 1)",
  accent10: "hsla(292, 91%, 83%, 1)",
  // #f0abfc
  accent11: "hsla(292, 50%, 25%, 1)",
  accent12: "hsla(292, 60%, 15%, 1)"
};
var starDark = {
  accent1: "hsla(292, 50%, 18%, 1)",
  accent2: "hsla(292, 55%, 24%, 1)",
  accent3: "hsla(292, 60%, 30%, 1)",
  accent4: "hsla(292, 65%, 38%, 1)",
  accent5: "hsla(292, 70%, 45%, 1)",
  accent6: "hsla(292, 75%, 52%, 1)",
  accent7: "hsla(292, 80%, 60%, 1)",
  accent8: "hsla(292, 85%, 68%, 1)",
  accent9: "hsla(292, 88%, 76%, 1)",
  accent10: "hsla(292, 91%, 83%, 1)",
  // #f0abfc - your star color
  accent11: "hsla(292, 80%, 90%, 1)",
  accent12: "hsla(292, 70%, 95%, 1)"
};
var builtThemes = createV5Theme({
  darkPalette: darkPalette2,
  lightPalette: lightPalette2,
  componentThemes: v5ComponentThemes,
  childrenThemes: {
    // Include default color themes (blue, red, green, yellow, etc.)
    ...defaultChildrenThemes,
    // Your custom accent color
    accent: {
      light: accentLight,
      dark: accentDark
    },
    // Semantic color themes for warnings, errors, and success states
    warning: {
      light: yellow2,
      dark: yellow
    },
    error: {
      light: red2,
      dark: red
    },
    success: {
      light: green2,
      dark: green
    },
    star: {
      light: starLight,
      dark: starDark
    }
  }
});
var themes3 = builtThemes;

// ../../node_modules/.pnpm/tamagui@2.0.0-rc.0_react-do_61d1e7091b1dd9d7bb12572a769677c7/node_modules/tamagui/dist/esm/createTamagui.mjs
var import_core2 = require("@tamagui/core");
var createTamagui = process.env.NODE_ENV !== "development" ? import_core2.createTamagui : (conf) => {
  const sizeTokenKeys = ["$true"], hasKeys = /* @__PURE__ */ __name((expectedKeys, obj) => expectedKeys.every((k) => typeof obj[k] < "u"), "hasKeys"), tamaguiConfig2 = (0, import_core2.createTamagui)(conf);
  for (const name of ["size", "space"]) {
    const tokenSet = tamaguiConfig2.tokensParsed[name];
    if (!tokenSet) throw new Error(`Expected tokens for "${name}" in ${Object.keys(tamaguiConfig2.tokensParsed).join(", ")}`);
    if (!hasKeys(sizeTokenKeys, tokenSet)) throw new Error(`
createTamagui() missing expected tokens.${name}:

Received: ${Object.keys(tokenSet).join(", ")}

Expected: ${sizeTokenKeys.join(", ")}

Tamagui expects a "true" key that is the same value as your default size. This is so 
it can size things up or down from the defaults without assuming which keys you use.

Please define a "true" or "$true" key on your size and space tokens like so (example):

size: {
  sm: 2,
  md: 10,
  true: 10, // this means "md" is your default size
  lg: 20,
}

`);
  }
  const expected = Object.keys(tamaguiConfig2.tokensParsed.size);
  for (const name of ["radius", "zIndex"]) {
    const tokenSet = tamaguiConfig2.tokensParsed[name], received = Object.keys(tokenSet);
    if (!received.some((rk) => expected.includes(rk))) throw new Error(`
createTamagui() invalid tokens.${name}:

Received: ${received.join(", ")}

Expected a subset of: ${expected.join(", ")}

`);
  }
  return tamaguiConfig2;
};

// tamagui.config.ts
var tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes: themes3,
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false
  }
});
var tamagui_config_default = tamaguiConfig;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  tamaguiConfig
});
