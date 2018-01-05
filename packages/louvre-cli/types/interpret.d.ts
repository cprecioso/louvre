declare module "interpret" {
  export type Interpreter = null | string | {
    module: string,
    register: (module: any) => void
  }
  export type Extensions = {
    [extension: string]: Interpreter | Interpreter[]
  }
  export const extensions: Extensions
  export const jsVariants: Extensions
}
