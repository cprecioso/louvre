declare module "liftoff" {
  import { ChildProcess } from "child_process"
  import { EventEmitter } from "events"
  import { Extensions } from "interpret"
  import { Flags } from "v8flags"

  namespace Liftoff {
    export interface PathArguments {
      path: string
      name?: string
      extensions?: string | string[] | Extensions
      cwd?: string
      findUp?: boolean
    }

    export interface ConstructorOptions {
      name?: string
      moduleName?: string
      configName?: string
      extensions?: Extensions
      v8flags?: Flags | ((cb: (err: any, flags?: Flags) => void) => void)
      processTitle?: string
      completions?: Function
      configFiles?: { [basename: string]: { [name: string]: PathArguments } }
    }

    export interface LaunchOptions {
      cwd?: string
      configPath?: string
      require?: string | string[]
      forcedFlags?: string | Flags | ((env: Env) => string | Flags)
    }

    export interface Env {
      cwd: string
      require: string[]
      configNameSearch: string[]
      configPath?: string
      configBase?: string
      modulePath?: string
      modulePackage?: {}
      configFiles: { [configFile: string]: string | null }
    }

    export interface Events {
      require: (name: string, module: any) => void
      requireFail: (name: string, err: any) => void
      respawn: (flags: Flags, child: ChildProcess) => void
    }
  }

  class Liftoff extends EventEmitter {
    constructor(options: Liftoff.ConstructorOptions)
    launch(
      options: Liftoff.LaunchOptions,
      cb: (this: this, env: Liftoff.Env) => void
    ): void

    name?: string
    moduleName?: string
    configName?: string
    extensions?: Extensions
    v8flags?: Flags | ((cb: (err: any, flags?: Flags) => void) => void)
    processTitle?: string
    completions?: Function
    configFiles?: {
      [basename: string]: { [name: string]: Liftoff.PathArguments }
    }

    on<Event extends keyof Liftoff.Events>(
      event: Event,
      cb: Liftoff.Events[Event]
    ): this
    once<Event extends keyof Liftoff.Events>(
      event: Event,
      cb: Liftoff.Events[Event]
    ): this
    addEventListener<Event extends keyof Liftoff.Events>(
      event: Event,
      cb: Liftoff.Events[Event]
    ): this
  }

  export = Liftoff
}
