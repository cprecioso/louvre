import { Pipeline } from "@louvre/core"
import { Env } from "liftoff"

export async function build(env: Env) {
  const louvre = ((await import(env.modulePath!)) as typeof import("@louvre/core"))
    .default
  const pipelines = (await import(env.configPath!)) as {
    [name: string]: Pipeline
  }

  await louvre(pipelines.default).exec()
  console.log("hola?")
}
