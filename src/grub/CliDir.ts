import path from 'path';
import { fileExists } from '../floss/floss';
import { getArgByNumber } from './args';
import { Cmd } from './Cmd';


export class CliDir {
  absDirPath: string;
  absDefaultCmdFilePath: string
  thirdArg: string;
  selectedFilePath: string;
  constructor(absPath: string) {
    this.absDirPath = absPath; 
    this.absDefaultCmdFilePath = path.join(this.absDirPath, 'default.ts')
    this.thirdArg = getArgByNumber(2);
    if (this.thirdArg == '' || this.thirdArg == 'help') {
      this.selectedFilePath = this.absDefaultCmdFilePath;
    } else {
      this.selectedFilePath = path.join(this.absDirPath, this.thirdArg+'.ts')
    }
  }
  static async new(absPath: string): Promise<CliDir> {
    let cliDir = new CliDir(absPath)
    if (!await fileExists(cliDir.absDefaultCmdFilePath)) {
      throw new Error(`default cmd file does not exist at ${cliDir.absDefaultCmdFilePath}`)
    }
    if (!await fileExists(cliDir.selectedFilePath)) {
      throw new Error(`searching for a .ts file at ${cliDir.selectedFilePath} but could not locate one`);
    }
    return cliDir;
  }
  async getCmd(): Promise<Cmd> {
    let importedFile = await import(this.selectedFilePath)
    let defaultImport = importedFile.default;
    if (!defaultImport) {
      throw new Error(`failed to locate a default import at ${this.selectedFilePath}`)
    }
    if (!(defaultImport instanceof Cmd)) {
      throw new Error(`default export at ${this.selectedFilePath} is not an instance of Cmd`)
    }
    return defaultImport as Cmd;
  }
}