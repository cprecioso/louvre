import { File, PipelineNode, streamSymbol } from "./Base"

export class FilterNode extends PipelineNode {
  constructor(prevNode: PipelineNode, fn: (file: File) => boolean) {
    super(prevNode[streamSymbol].filter(fn))
  }
}
