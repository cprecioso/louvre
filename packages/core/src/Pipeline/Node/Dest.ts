import { PassThrough } from "stream"
import { dest, DestOptions } from "vinyl-fs"
import { writableStreamToListener } from "../../util"
import { PipelineNode, streamSymbol } from "./Base"

const id = <T>(x: T) => x

export declare namespace DestNode {
  export type Options = DestOptions
}

export class DestNode extends PipelineNode {
  constructor(
    prevNode: PipelineNode,
    folder: string,
    options?: DestNode.Options
  ) {
    const vinylStream = dest(folder, options) as PassThrough
    const internalStream = prevNode[streamSymbol].map(id)
    internalStream.setDebugListener(writableStreamToListener(vinylStream))
    const externalStream = internalStream.map(id)
    super(externalStream)
  }
}
