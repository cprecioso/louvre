import { SrcOptions } from "vinyl-fs"
import Pipeline from "./Pipeline"

const isString = (v => typeof v === "string") as (v: any) => v is string
const isPipeline = (v => v instanceof Pipeline) as (v: any) => v is Pipeline

function louvre(glob: string, options?: SrcOptions): Pipeline
function louvre(globs: string[], options?: SrcOptions): Pipeline
function louvre(pipeline: Pipeline): Pipeline
function louvre(pipelines: Pipeline[]): Pipeline

function louvre(
  input: string | Pipeline | (string | Pipeline)[],
  options?: SrcOptions
): Pipeline {
  const arr = !Array.isArray(input) ? [input] : input
  const globs = arr.filter(isString)
  const source = Pipeline.empty().src(globs, options)
  const pipelines = arr.filter(isPipeline).concat([source])
  return Pipeline.empty().merge(...pipelines)
}

export default louvre
