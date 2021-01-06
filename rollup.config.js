import dts from "rollup-plugin-dts"

export default [{
  input: "./src/java.js",
  external: id => id != "tslib" && !/^(\.?\/|\w:)/.test(id),
  output: [{
    format: "esm",
    file: "./dist/index.js",
    externalLiveBindings: false
  }, {
    format: "cjs",
    file: "./dist/index.cjs"
  }]
}, {
  input: "./src/java.d.ts",
  output: {
    format: "esm",
    file: "./dist/index.d.ts",
  },
  plugins: [dts()],
  onwarn(warning, warn) { if (warning.code != "CIRCULAR_DEPENDENCY") warn(warning) }
}]
