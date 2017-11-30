import { List } from "immutable"
import { SrcOptions, DestOptions } from "vinyl-fs"
import { Files, Transform, destTransform, sourceTransform } from "./Transform"
import { isArray } from "util"

export type PipelineFromInput = (Pipeline | string | string[])[] | string

export class Pipeline {

  constructor(protected readonly _transforms = List<Transform>()) {}

  transform(fn: Transform) {
    return new Pipeline(this._transforms.push(fn))
  }

    const transforms = [...pipelines].reduce((acc, pipeline) => {
      return acc.concat(pipeline._transforms)
    }, this._transforms)
    return new Pipeline(transforms)
  merge(...pipelines: Pipeline[]): Pipeline {
  }

  source(globs: string | string[], options?: SrcOptions) {
    return this.transform(sourceTransform(globs, options))
  }

  dest(folder: string, options?: DestOptions) {
    return this.transform(destTransform(folder, options))
  }

  async exec() {
    await this._transforms.reduce((result, transform) => result.then(transform), Promise.resolve(<Files>List()))
  }

  static empty() {
    return new this()
  }

  static from(input: PipelineFromInput, options?: SrcOptions) {
    const inputArray = isArray(input) ? [...input] : [ input ]
    return (inputArray.reduce((pipeline: Pipeline, arg) => {
      if (arg instanceof Pipeline) return pipeline.concat(arg)
      return pipeline.source(arg, options)
    }, this.empty()))
  }

}

export default Pipeline
