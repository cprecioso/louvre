import xs from "xstream"
import { PipelineNode, streamSymbol } from "./Base"

export class MergeNode extends PipelineNode {
  constructor(...nodes: PipelineNode[]) {
    super(xs.merge(...nodes.map(node => node[streamSymbol])))
  }
}
