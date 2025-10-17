import { argIsNumber, Cmd, getArgByPos } from "grub"
import { $, sleep } from "bun"
import { AppDir } from "./AppDir"
import path from 'path'
import { watch } from 'fs';
import { opBuild } from "./cmdBuild";


export const cmdServe = new Cmd("serve")

cmdServe.setOperation(async () => {
  let port = getArgByPos(3)
  if (port == '') {
    throw new Error(`must provide a <PORT> in: dam serve <PORT>`)
  }
  if (!argIsNumber(3)) {
    throw new Error(`dam serve ${port} is invalid, must provide a number`)
  }
  let app = await AppDir.load(path.join(process.cwd(), 'app'))
  let targetPath = path.join(app.buildDirPath, '**', '*.html')
  console.log(`serving on ${port} out of ${targetPath}`)
  await onChange(port, targetPath)
  // const watcher = watch(app.buildDirPath, {recursive: true}, async (eventType, filename) => {
  //   await onChange(port, targetPath);
  // })
  // watcher.close();
})

async function onChange(port: string, targetPath: string) {
  await opBuild()
  await kill(port)
  await serve(port, targetPath)
}

async function kill(port: string) {
  try {
    await $`kill -9 $(lsof -ti:${port})`
  } catch (err: any) {
    // ...
  }
}

async function serve(port: string, targetPath: string) {
  await $`bun --port ${port} '${targetPath}'`
}
