import { hasFlag } from "../src/grub/args"
import { Cmd } from "../src/grub/Cmd"
import path from 'path';
import { AppDir } from "../src/dam/AppDir";

let cmd = new Cmd()

cmd.setOperation(async () => {
  console.log('initalizing a new project..')
  let appDir = await AppDir.new(path.join(process.cwd(), 'app'), hasFlag('-r'))
  console.log('initalization complete!')
})
 
export default cmd;