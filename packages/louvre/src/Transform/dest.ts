import Transform from "."
import { List } from "immutable"
import * as vfs from "vinyl-fs"
import { obj as intoStream } from "into-stream"
import { array as getStream } from "get-stream"

function destTransform(folder: string, options?: vfs.DestOptions) {
  return (async (files = List()) => {
    const files$ =
      intoStream(files.toJS())
        .pipe(vfs.dest(folder, options))

    await getStream(files$)

    return files
  }) as Transform
}

export default destTransform
