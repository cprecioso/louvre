import louvre from "louvre"

const src = louvre("src/**/*")

src.dest("lib-noop")

export default [src.dest("lib")]
