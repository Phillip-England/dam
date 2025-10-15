import { AppDir } from "../src/dam/AppDir"
import { Cmd } from "../src/grub/Cmd"
import path from 'path'

let cmd = new Cmd()

cmd.setOperation(async () => {
  console.log('building project..')
  let appDir = await AppDir.load(path.join(process.cwd(), 'app'))
  console.log(appDir.files.read(appDir.routesFilePath))
  console.log('building project complete!')
})

 
export default cmd;