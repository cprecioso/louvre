const louvre = require("louvre")

const src =
  louvre("src/**/*")

src.dest("lib-noop")

module.exports = [src.dest("lib")]
