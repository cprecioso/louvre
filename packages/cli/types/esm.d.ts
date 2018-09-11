declare module "esm" {
  function esm(
    module: NodeModule,
    options?: esm.Options & esm.DevOptions
  ): NodeRequire
  namespace esm {
    interface Options {
      await?: boolean
      cjs?: boolean | CjsOptions
      force?: boolean
      mainFields?: string[]
      mode?: "auto" | "all" | "strict"
    }
    interface DevOptions {
      cache?: boolean
      sourceMap?: boolean
    }
    interface CjsOptions {
      cache?: boolean
      extensions?: boolean
      interop?: boolean
      mutableNamespace?: boolean
      namedExports?: boolean
      paths?: boolean
      vars?: boolean
    }
  }
  export = esm
}
