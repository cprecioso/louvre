import { asAsyncGenerator, asyncIterableToXstream } from "../../util"
import { File, PipelineNode, streamSymbol } from "./Base"

export declare namespace MapNode {
  type AcceptableResults = asAsyncGenerator.AcceptableResults<File>
}

export class MapNode extends PipelineNode {
  constructor(
    prevNode: PipelineNode,
    fn: (file: File) => MapNode.AcceptableResults
  ) {
    super(
      prevNode[streamSymbol]
        .map(file => asyncIterableToXstream(asAsyncGenerator(fn(file))))
        .flatten()
    )
  }
}
