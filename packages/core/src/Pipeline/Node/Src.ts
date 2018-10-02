import { src, SrcOptions } from "vinyl-fs"
import { readableStreamToStream } from "../../util"
import { File, PipelineNode } from "./Base"

export declare namespace SrcNode {
  export type Options = SrcOptions
}

export class SrcNode extends PipelineNode {
  constructor(globs: string | string[], options?: SrcNode.Options) {
    super(readableStreamToStream<File>(src(globs, options)))
  }
}
