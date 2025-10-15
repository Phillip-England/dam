import path from "path";
import { dirExists } from "../floss/floss";
import { rm } from "fs/promises";
import { DiskRecord, DiskSpawn, DiskPull } from "../diskspawn/DiskSpawn";

export class AppDir {
  path: string;
  shouldReset: boolean;
  files: DiskPull = new DiskPull();
  componentsDirPath: string;
  componentsFilePath: string;
  layoutsDirPath: string;
  layoutsFilePath: string;
  staticDirPath: string;
  staticCssFilePath: string;
  routesDirPath: string;
  routesFilePath: string;
  constructor(appDirPath: string, shouldReset: boolean) {
    this.path = appDirPath;
    this.shouldReset = shouldReset;
    this.componentsDirPath = path.join(this.path, 'components')
    this.componentsFilePath = path.join(this.componentsDirPath, 'components.tsx')
    this.layoutsDirPath = path.join(this.path, 'layouts')
    this.layoutsFilePath = path.join(this.layoutsDirPath, 'layouts.tsx');
    this.staticDirPath = path.join(this.path, 'static')
    this.staticCssFilePath = path.join(this.staticDirPath, 'input.css');
    this.routesDirPath = path.join(this.path, 'routes')
    this.routesFilePath = path.join(this.routesDirPath, 'index.tsx')
  }

  static async create(path: string, shouldReset: boolean): Promise<AppDir> {
    let appDir = new AppDir(path, shouldReset)
    await appDir.checkForReset()
    await appDir.ensureDoesntExist()
    await appDir.spawnToDisk()
    let loadedAppDir = await AppDir.load(appDir.path)
    return loadedAppDir;
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
  async ensureDoesntExist() {
    if (await dirExists(this.path)) {
      throw new Error(`${this.path} already exists, cannot overide existing project, using flag -r to reset (WARNING THIS WILL DELETE YOUR PROJECT)`)
    }
  }
  async spawnToDisk() {
    let spawn = new DiskSpawn([
      DiskRecord.dir(this.path),
      DiskRecord.dir(this.componentsDirPath),
      DiskRecord.dir(this.layoutsDirPath),
      DiskRecord.dir(this.staticDirPath),
      DiskRecord.dir(this.routesDirPath),
      DiskRecord.file(this.componentsFilePath, `export const Header = () => {
  return (
    <header>
      <h1>Hello, World!</h1>
      <p>Welcome to the Web!</p>
    </header>
  )
}
  
export const Footer = () => {
  return (
    <footer>
      <p>See you later!</p>
    </footer>
  )
}     
`),
      DiskRecord.file(this.layoutsFilePath, `import type { JSX } from "react"
      
export const GuestLayout = ({ children, title }: { 
  children: JSX.Element, 
  title: string 
}) => {
  return (
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
    </head>
    <body>
      <main>{children}</main>
    </body>
    </html>
  )
}
`),
      DiskRecord.file(this.routesFilePath, `import { GuestLayout } from "../layouts/layouts"
          
export let html = <GuestLayout title="HomePage">
  <h1>Your content here</h1>
</GuestLayout>
`),
      DiskRecord.file(this.staticCssFilePath, `@import 'tailwindcss'`)
    ]);
    await spawn.writeToDisk();
  }
  
static async load(appDirPath: string): Promise<AppDir> {
  const appDir = new AppDir(appDirPath, false);
  const puller = new DiskPull();
  await puller.loadFromDisk([
    DiskPull.dir(appDir.path),
    DiskPull.dir(appDir.componentsDirPath),
    DiskPull.dir(appDir.layoutsDirPath),
    DiskPull.dir(appDir.staticDirPath),
    DiskPull.dir(appDir.routesDirPath),
    DiskPull.file(appDir.componentsFilePath),
    DiskPull.file(appDir.layoutsFilePath),
    DiskPull.file(appDir.staticCssFilePath),
    DiskPull.file(appDir.routesFilePath),
  ]);
  appDir.files = puller;
  return appDir;
}

}

