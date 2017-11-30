import { SrcOptions, DestOptions } from "vinyl-fs"
import { Files, Transform, destTransform, sourceTransform } from "./Transform"
import * as most from "most"

class Pipeline implements PromiseLike<void> {

  protected readonly _observable: Files

  constructor(observable: Files = most.never()) {
    this._observable = observable
  }

  then = ((...args: any[]) => this._observable.drain().then(...args)) as (typeof Promise.prototype.then)
  catch = ((...args: any[]) => this._observable.drain().catch(...args)) as (typeof Promise.prototype.catch)

  transform(...fns: Transform[]): Pipeline {
    const newObservable = [...fns].reduce((obs, fn) => fn(obs), this._observable)
    return new Pipeline(newObservable)
  }

  merge(...pipelines: Pipeline[]): Pipeline {
    const observables = [...pipelines].map(p => p._observable)
    return this.transform(initial => most.mergeArray([initial, ...observables]))
  }

  src(globs: string | string[], options?: SrcOptions): Pipeline {
    if (globs.length === 0) return this
    return this.transform(sourceTransform(globs, options))
  }

  dest(folder: string, options?: DestOptions): Pipeline {
    return this.transform(destTransform(folder, options))
  }

  exec(): Promise<void> {
    return this._observable.drain()
  }

  static empty() {
    return new this()
  }

}

export default Pipeline
