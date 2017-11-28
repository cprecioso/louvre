import Pipeline, { PipelineFromInput } from "./Pipeline"
import { SrcOptions } from "vinyl-fs"

function louvre(input: PipelineFromInput, options?: SrcOptions) {
  return Pipeline.from(input, options)
}

export = louvre
