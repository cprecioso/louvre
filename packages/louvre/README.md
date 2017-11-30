# louvre
A new build system that takes the best concepts from [gobble](https://github.com/gobblejs/gobble) and [gulp](https://github.com/gulpjs/gulp).

⚠️⚠️⚠️ **THIS IS _VERY MUCH_ A WORK IN PROGRESS** ⚠️⚠️⚠️

---

Features / wishlist / to-do:
- Imperative instead of declarative
- Simple management of pipelines (join them putting them in the same array, expose them through `module.exports`)
- Flowing pipelines (but streams are too verbose and finicky, let's just use observables and functions)
- Use `vinyl` files and possibility to tap into `gulp`'s ecosystem
- Watch mode and incremental builds
- Simple management of development vs. production transforms
- Separation into tasks, as parallel as possible
- Introspection into the build system by outputting steps to filesystem (but only on debug or on errors!)
- Get out of the way as much as possible, make it easy to create custom transforms or tweak existing ones, and plug the existing build tools ecosystem
- The pipeline objects are immutable (so it's easier to reason about them), fluent (so it's concise), lazy (so we only do things if needed) and async (so a single transform won't lock up other ones).
- And obviously, fast!
