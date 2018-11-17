import { Pipeline } from "@louvre/core"
import { Env } from "liftoff"

export async function build(env: Env, targets = ["default"]) {
  const louvre = ((await import(env.modulePath!)) as typeof import("@louvre/core"))
    .default
  const pipelines = (await import(env.configPath!)) as {
    [name: string]: Pipeline
  }

  for (const target of targets) {
    if (!(target in pipelines)) throw new Error(`Can't find target ${target}`)
  }

  const runningPipelines = targets.map(target =>
    louvre(pipelines[target]).exec()
  )

  await Promise.all(runningPipelines)
}
