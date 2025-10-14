import { Cmd } from "../src/grub/Cmd"
import { argString } from "../src/grub/ArgSchema";
import path from 'path';
import { rmdir, mkdir } from "fs/promises";
import { dirExists, walkDir } from "../src/floss/floss";
import { TsxFile } from "../src/dam/TsxFile";

let cmd = new Cmd()

cmd.setOperation(async () => {
  console.log('building project..')
  let routesDirPath = path.join(process.cwd(), 'routes')
  if (await dirExists(routesDirPath)) {
    await rmdir(routesDirPath);
  }
  await mkdir(routesDirPath);
  let appDirPath = path.join(process.cwd(), 'app');
  let tsxFiles = [];
  walkDir(appDirPath, (path, isDir) => {
    if (isDir) {
      return;
    }
    let file = new TsxFile(path)
    console.log(file)
  })
})

 
export default cmd;