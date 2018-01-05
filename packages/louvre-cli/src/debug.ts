import chalk from "chalk"

export default function debugFn(module: string, submodule?: string) {
  return (...logs: any[]) => {
    console.log(chalk`{bold [${module}${submodule ? ":" + submodule : ""}]}`, ...logs)
  }
}
