import { resolve } from "path"
import * as louvre from "."

async function main() {
  const base = process.cwd()
  const louvrefile = resolve(base, "louvrefile.js")
  const pipeline = louvre(await import(louvrefile))
  await pipeline.exec()
}

main()
.catch(err => {
  debugger
  console.log("ERROR!", err)
})
