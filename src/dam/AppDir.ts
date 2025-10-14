import path from "path";
import { dirExists } from "../floss/floss";
import { rm, mkdir } from "fs/promises";
import { IndexTsxFile } from "./IndexTsxFile";

export class AppDir {
  path: string;
  shouldReset: boolean;
  indexTsxFilePath: string
  constructor(appDirPath: string, shouldReset: boolean) {
    this.path = appDirPath;
    this.shouldReset = shouldReset;
    this.indexTsxFilePath = path.join(this.path, "index.tsx")
  }

  static async new(path: string, shouldReset: boolean): Promise<AppDir> {
    let appDir = new AppDir(path, shouldReset)
    await appDir.checkForReset()
    await appDir.ensureAppDirDoesntExist()
    await appDir.makeAppDir()
    await appDir.writeIndexTsxFile()
    return appDir;
  }

  async checkForReset() {
    if (this.shouldReset) {
      if (await dirExists(this.path)) {
        await rm(this.path, {
          recursive: true,
        })
      }
    }
  }
  async ensureAppDirDoesntExist() {
    if (await dirExists(this.path)) {
      throw new Error(`${this.path} already exists, please create your project in a new directory`)
    }
  }

  async makeAppDir() {
    await mkdir(this.path)
  }

  async writeIndexTsxFile() {
    let file = new IndexTsxFile(this.indexTsxFilePath)
    await file.write()
  }

  static async load() {
    
  }

}



