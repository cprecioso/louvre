import _Pipeline from "./Pipeline"
import { SrcOptions } from "vinyl-fs"

const isString = (v => typeof v === "string") as (v: any) => v is string
const isPipeline = (v => v instanceof _Pipeline) as (v: any) => v is _Pipeline

function louvre(glob: string, options?: SrcOptions): _Pipeline
function louvre(globs: string[], options?: SrcOptions): _Pipeline
function louvre(pipeline: _Pipeline): _Pipeline
function louvre(pipelines: _Pipeline[]): _Pipeline

function louvre(input: string | _Pipeline | (string | _Pipeline)[], options?: SrcOptions): _Pipeline {
  const arr = (!Array.isArray(input)) ? [input] : input
  const globs = arr.filter(isString)
  const source = _Pipeline.empty().src(globs, options)
  const pipelines = arr.filter(isPipeline).concat([source])
  return _Pipeline.empty().merge(...pipelines)
}

namespace louvre {
  export const Pipeline: (typeof _Pipeline) = _Pipeline
}

export = louvre
