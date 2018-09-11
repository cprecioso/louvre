import * as most from "most"
import File from "vinyl"
import * as vfs from "vinyl-fs"
import { fromObservable, toObservable } from "./stream-helpers"
import { PoV, unPoV } from "./util"

class Pipeline {
  /**
   * The internal observable stream of files
   */
  protected readonly _observable: most.Stream<File>

  /**
   * This constructor is protected. Please use the exposed factories.
   */
  protected constructor(observable: Pipeline["_observable"]) {
    this._observable = observable
  }

  /**
   * Creates an empty `Pipeline`
   */
  static empty(): Pipeline {
    return new Pipeline(most.never())
  }

  /**
   * Creates a new `Pipeline` applying transforms to the observable.
   *
   * Good for arbitrary transforms.
   */
  compose(
    ...fns: ((files: most.Stream<File>) => most.Stream<PoV<File>>)[]
  ): Pipeline {
    const newObservable = fns.reduce(
      (obs, fn) =>
        fn(obs)
          .map(unPoV)
          .awaitPromises(),
      this._observable
    )
    return new Pipeline(newObservable)
  }

  /**
   * Simultaneously combines the output of the given `Pipeline`s.
   */
  static merge(pipelines: Pipeline[]): Pipeline {
    const observable = most.mergeArray(pipelines.map(p => p._observable))
    return new Pipeline(observable)
  }

  /**
   * Starts the Pipeline, returns an `Promise`d array of `File`s
   */
  exec(): Promise<File[]> {
    return this._observable.reduce<File[]>((arr, f) => [...arr, f], [])
  }

  /**
   * Add the given source files to the `Pipeline`
   * @param options An optional object of the `vinyl-fs` options
   */
  src(globs: string | string[], options?: vfs.SrcOptions): Pipeline {
    if (globs.length === 0) return this
    return this.compose(files => {
      const newFiles = toObservable<File>(vfs.src(globs, options))
      return most.merge(files, newFiles)
    })
  }

  /**
   * Create a new `Pipeline` from the given files
   * @param options An optional object of the `vinyl-fs` options
   */
  static src(globs: string | string[], options?: vfs.SrcOptions): Pipeline {
    return Pipeline.empty().src(globs, options)
  }

  /**
   * Writes the `File`s in the `Pipeline` to a folder
   * @param options An optional object of the `vinyl-fs` options
   */
  dest(folder: string, options?: vfs.DestOptions): Pipeline {
    return this.compose(files => {
      const [observable, stream] = fromObservable(files)
      stream.pipe(vfs.dest(folder, options))
      return observable
    })
  }

  /**
   * Checks if a given object is a `Pipeline` instance
   */
  static isPipeline(value: any): value is Pipeline {
    return value instanceof Pipeline
  }
}

export default Pipeline
