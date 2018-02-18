#!/usr/bin/env node

import * as Liftoff from "liftoff"
import * as minimist from "minimist"
import { jsVariants } from "interpret"
import * as V8Flags from "v8flags"
import { ChildProcess } from "child_process"
import { Semver } from "sver-compat"
import chalk from "chalk"
const pkg = require("../package.json")

import debugFn from "./debug"
const debug = debugFn("gulp-cli")

const argv = minimist(process.argv.slice(2))
const louvre = new Liftoff({
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
    function(env) {
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

      debug(`Starting`)
      Promise.all([
        import(env.modulePath as string),
        import(env.configPath as string)
      ])
        .then(([localLouvre, pipeline]) => localLouvre(pipeline).exec())
        .then(() => debug(`Done`))
        .catch(err => {
          console.log(chalk`{red Error!}`)
          console.log(err)
          throw err
        })
    }
  )
