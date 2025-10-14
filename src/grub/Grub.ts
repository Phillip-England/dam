import { CliDir } from "./CliDir";
import path from 'path';

export class Grub {
  cliDirAbsPath: string
  errFunc: (err: any) => Promise<void>
  constructor(cliDirAbsPath: string) {
    this.cliDirAbsPath = cliDirAbsPath;
    this.errFunc = async (err: any) => {
      console.error(err.message);
    }
  }
  onErr(errFunc: (err: any) => Promise<void>) {
    this.errFunc = errFunc;
  }
  async run() {
    try {
      let cliDir = await CliDir.new(path.join(process.cwd(), "cli"))
      let cmd = await cliDir.getCmd();
      cmd.enforceSchema()
      await cmd.operation() 
    } catch (err: any) {
      await this.errFunc(err)
    }  
  }
}