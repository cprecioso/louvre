import {
  DestNode,
  File,
  FileStream,
  MapNode,
  MergeNode,
  PipelineNode,
  SrcNode
} from "./Node"

const nodeSymbol = Symbol("PipelineNode")

class Pipeline {
  /**
   * The internal observable stream of files
   */
  protected readonly [nodeSymbol]: PipelineNode

  /**
   * This constructor is protected. Please use the exposed factories.
   */
  protected constructor(node: PipelineNode) {
    this[nodeSymbol] = node
  }

  /**
   * Creates a new `Pipeline` applying transforms to the observable.
   *
   * Good for arbitrary transforms.
   */
  compose(fn: (prev: FileStream) => FileStream): Pipeline {
    return new Pipeline(this[nodeSymbol].compose(fn))
  }

  /**
   * Transforms the given `File`s one by one, into one or many files.
   *
   * Good for one-to-one and one-to-many transforms, sync or async.
   */
  map(fn: (file: File) => MapNode.AcceptableResults): Pipeline {
    return new Pipeline(new MapNode(this[nodeSymbol], fn))
  }

  /**
   * Simultaneously combines the output of the given `Pipeline`s.
   */
  static merge(pipelines: Pipeline[]): Pipeline {
    return new Pipeline(
      new MergeNode(...pipelines.map(pipeline => pipeline[nodeSymbol]))
    )
  }

  /**
   * Starts the Pipeline, returns an `Promise`d array of `File`s
   */
  exec(): Promise<File[]> {
    return this[nodeSymbol].exec()
  }

  /**
   * Create a new `Pipeline` from the given files
   * @param options An optional object of the `vinyl-fs` options
   */
  static src(globs: string | string[], options?: SrcNode.Options): Pipeline {
    return new Pipeline(new SrcNode(globs, options))
  }

  /**
   * Writes the `File`s in the `Pipeline` to a folder
   * @param options An optional object of the `vinyl-fs` options
   */
  dest(folder: string, options?: DestNode.Options): Pipeline {
    return new Pipeline(new DestNode(this[nodeSymbol], folder, options))
  }

  /**
   * Checks if a given object is a `Pipeline` instance
   */
  static isPipeline(value: any): value is Pipeline {
    return value instanceof Pipeline
  }
}

export default Pipeline
