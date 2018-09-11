#!/usr/bin/env node

import Pipeline from "@louvre/core/lib/Pipeline"
import chalk from "chalk"
import { ChildProcess } from "child_process"
import { jsVariants } from "interpret"
import Liftoff from "liftoff"
import minimist from "minimist"
import { Semver } from "sver-compat"
import V8Flags from "v8flags"
import pkg from "../package.json"
import debugFn from "./debug"

const debug = debugFn(pkg.name)

const argv = minimist(process.argv.slice(2))

new Liftoff({
  name: "louvre",
  configName: "louvrefile",
  extensions: jsVariants,
  v8flags: V8Flags
})
  .on("require", (name: string) => debug("Loading", name))
  .on("requireFail", (name: string) => debug("Unable to load", name))
  .on("respawn", (flags: V8Flags.Flags, child: ChildProcess) => {
    debug("Detected node flags:", flags)
    debug("Respawned to PID:", child.pid)
  })
  .launch(
    {
      cwd: argv.cwd,
      configPath: argv.louvrefile,
      require: argv.require
    },
    async function(env) {
      if (process.cwd() !== env.cwd) {
        process.chdir(env.cwd)
        debug("Working directory changed to", env.cwd)
      }

      if (!env.modulePath || !env.modulePackage) {
        debug(`Local ${this.moduleName} module not found in`, env.cwd)
        process.exit(1)
      }

      const cliVersion = new Semver(pkg.version as string)
      const localVersion = new Semver((env.modulePackage as any)
        .version as string)
      if (!cliVersion.eq(localVersion)) {
        debug(`local louvre version is ${localVersion}`)
        debug(`global louvre-cli version is ${cliVersion}`)
        debug(
          `Please bring them in sync. If not possible, use the locally installed louvre-cli.`
        )
        if (cliVersion.major === localVersion.major) {
          debug(`Trying to proceeed...`)
        } else process.exit(1)
      }

      debug(`Starting...`)

      try {
        const [louvre, pipeline] = await Promise.all([
          import(env.modulePath!) as Promise<typeof import("@louvre/core")>,
          import(env.configPath!) as Promise<Pipeline>
        ])

        await louvre(pipeline).exec()

        debug(`Done!`)
      } catch (err) {
        debug(chalk`{red Error!}`)
        debug(err)
        throw err
      }
    }
  )
