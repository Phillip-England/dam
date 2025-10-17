import { hasFlag, Cmd } from 'grub';
import path from 'path';
import { AppDir } from "./AppDir";

export const cmdInit = new Cmd("init")

cmdInit.setOperation(async () => {
  console.log('💦 initalizing..')
  let appDir = await AppDir.create(path.join(process.cwd(), 'app'), hasFlag('-r'))
  console.log('👍 complete!')
})
 