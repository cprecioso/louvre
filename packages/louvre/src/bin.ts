import { resolve } from "path"

async function main() {
  const base = process.cwd()
  const louvrefile = resolve(base, "louvrefile.js")
  const node = await import(louvrefile)
  await node.exec()
}

main()
.catch(err => {
  debugger
})
