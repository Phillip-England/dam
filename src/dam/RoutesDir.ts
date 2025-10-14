import path from "path";

export class RoutesDir {
  path: string;
  constructor(dirPath: string) {
    this.path = dirPath;
  }

  static async new(dirPath: string): Promise<RoutesDir> {
    let dir = new RoutesDir(dirPath)
    return dir
  }


}



