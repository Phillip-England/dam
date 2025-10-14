import { hasFlag } from "../src/grub/args"
import { Cmd } from "../src/grub/Cmd"
import { argString } from "../src/grub/ArgSchema";
import path from 'path';
import { dirExists } from "../src/floss/floss";
import { mkdir, rm } from "fs/promises";
import { writeFile } from 'fs/promises';

let cmd = new Cmd()

cmd.setOperation(async () => {
  console.log('initalizing a new project..')
  let projectPath = path.join(process.cwd(), 'app');
  await checkForReset(projectPath);
  await ensureProjectDoesntExist(projectPath);
  await mkdir(projectPath)
  let indexFilePath = path.join(projectPath, 'index.tsx')
  let file = await writeFile(indexFilePath, `import type { JSX } from "react"

export const HomePage = ({ children, title }: { children: JSX.Element, title: string }) => {
  return (
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
    </head>
    <body>
      {children}
    </body>
    </html>
  )
}  
  `)
})

async function checkForReset(projectPath: string) {
  if (hasFlag('-r')) {
    if (await dirExists(projectPath)) {
      await rm(projectPath, {
        recursive: true,
      })
    }
  }
}

async function ensureProjectDoesntExist(projectPath: string) {
  if (await dirExists(projectPath)) {
    throw new Error(`${projectPath} already exists, please create your project in a new directory`)
  }
}

 
export default cmd;