declare module "v8flags" {
  namespace V8Flags {
    export type Flags = string[]

    export const configfile: string
    export const configPath: string
  }

  function V8Flags(cb: (err: any, flags?: V8Flags.Flags) => void): void

  export = V8Flags
}
