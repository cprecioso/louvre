import * as most from "most"
import File from "vinyl"
import vfs from "vinyl-fs"
import { toObservable, fromObservable } from "./stream-helpers"

export type TransformFunction = (
  files: most.Stream<File>
) => most.Stream<File | Promise<File>>

class Pipeline {
  constructor(
    protected readonly _observable: most.Stream<File> = most.never()
  ) {}

  static empty() {
    return new this()
  }

  compose(this: Pipeline, ...fns: TransformFunction[]): Pipeline {
    const newObservable = fns.reduce(
      (obs, fn) =>
        fn(obs)
          .map(f => Promise.resolve(f))
          .awaitPromises(),
      this._observable
    )
    return new Pipeline(newObservable)
  }

  merge(this: Pipeline, ...pipelines: Pipeline[]): Pipeline {
    const observables = [...pipelines].map(p => p._observable)
    return this.compose(initial => most.mergeArray([initial, ...observables]))
  }

  exec(this: Pipeline): Promise<File[]> {
    return this._observable.reduce<File[]>((arr, f) => [...arr, f], [])
  }

  src(
    this: Pipeline,
    globs: string | string[],
    options?: vfs.SrcOptions
  ): Pipeline {
    if (globs.length === 0) return this
    return this.compose(files => {
      const newFiles = toObservable<File>(vfs.src(globs, options))
      return most.merge(files, newFiles)
    })
  }

  dest(this: Pipeline, folder: string, options?: vfs.DestOptions): Pipeline {
    return this.compose(files => {
      const [observable, stream] = fromObservable(files)
      stream.pipe(vfs.dest(folder, options))
      return observable
    })
  }

}

export default Pipeline
