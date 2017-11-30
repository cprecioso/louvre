const louvre = require("./..")

const src =
  louvre("src/**/*")

src.dest("lib-noop")

module.exports = [src.dest("lib")]
