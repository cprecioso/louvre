import { SrcOptions } from "vinyl-fs"
import { merge, src } from "./factories"
import Pipeline from "./Pipeline"
import { unAoV } from "./util"

export const isPipeline: typeof Pipeline.isPipeline = Pipeline.isPipeline.bind(
  Pipeline
)

const isString = (v => typeof v === "string") as (v: any) => v is string

/**
 * Creates a `Pipeline` with the files selected by the given glob
 * @param options An optional object of `vinyl-fs` options
 */
function louvre(glob: string, options?: SrcOptions): Pipeline

/**
 * Creates a `Pipeline` with the files selected by the given globs
 * @param options An optional object of `vinyl-fs` options
 */
function louvre(globs: string[], options?: SrcOptions): Pipeline

/**
 * Creates a `Pipeline` from the output of another one
 * @param options An optional object of `vinyl-fs` options
 */
function louvre(pipeline: Pipeline): Pipeline

/**
 * Creates a `Pipeline` by merging the given ones
 * @param options An optional object of `vinyl-fs` options
 */
function louvre(pipelines: Pipeline[]): Pipeline

function louvre(
  input: string | Pipeline | (string | Pipeline)[],
  options?: SrcOptions
): Pipeline {
  const arr = unAoV(input)
  const globs = arr.filter(isString)
  const source = src(globs, options)
  const pipelines = arr.filter(isPipeline).concat([source])
  return merge(pipelines)
}

export { louvre }
export default louvre
