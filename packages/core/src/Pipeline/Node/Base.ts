import _File from "vinyl"
import { Listener, Stream } from "xstream"

export type File = _File
export type FileStream = Stream<File>

export const streamSymbol = Symbol("FileStream")

export class PipelineNode {
  protected readonly [streamSymbol]: FileStream

  protected constructor(stream: FileStream) {
    this[streamSymbol] = stream
  }

  compose(fn: (stream: FileStream) => FileStream): PipelineNode {
    return new PipelineNode(fn(this[streamSymbol]))
  }

  exec(): Promise<File[]> {
    return new Promise((f, r) => {
      this[streamSymbol].subscribe(new NodeListener(f, r))
    })
  }
}

class NodeListener implements Listener<File> {
  files: File[] = []

  constructor(
    private fulfill: (files: File[]) => void,
    private reject: (err: unknown) => void
  ) {}

  next(file: File) {
    this.files.push(file)
  }
  complete() {
    this.fulfill(this.files)
  }
  error(err: unknown) {
    this.reject(err)
  }
}
