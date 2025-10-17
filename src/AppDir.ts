import path from "path";
import { dirExists } from "floss";
import { rm } from "fs/promises";
import { VirtualAsset, VirtualFS } from "hoist";

export class AppDir {
  path: string;
  shouldReset: boolean;
  componentsDirPath: string;
  componentsFilePath: string;
  layoutsDirPath: string;
  layoutsFilePath: string;
  staticDirPath: string;
  staticCssFilePath: string;
  routesDirPath: string;
  routesFilePath: string;
  buildDirPath: string;
  vfs: VirtualFS | undefined;
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
    this.buildDirPath = path.join(this.path, 'build');
    this.vfs = undefined
  }

  static async create(path: string, shouldReset: boolean): Promise<AppDir> {
    let appDir = new AppDir(path, shouldReset)
    await appDir.checkForReset()
    await appDir.ensureDoesntExist()
    await appDir.spawnToDisk()
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
  async ensureDoesntExist() {
    if (await dirExists(this.path)) {
      throw new Error(`${this.path} already exists, cannot overide existing project, using flag -r to reset (WARNING THIS WILL DELETE YOUR PROJECT)`)
    }
  }
  async spawnToDisk() {
    let vfs = await VirtualFS.create(this.path, {
      [this.path]: VirtualAsset.rootDir(),
      [this.componentsDirPath]: VirtualAsset.dir(),
      [this.layoutsDirPath]: VirtualAsset.dir(),
      [this.staticDirPath]: VirtualAsset.dir(),
      [this.routesDirPath]: VirtualAsset.dir(),
      [this.buildDirPath]: VirtualAsset.dir(),
      [this.componentsFilePath]: VirtualAsset.file(`export const Header = () => {
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
      [this.layoutsFilePath]: VirtualAsset.file(`import type { JSX } from "react"
      
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
      [this.routesFilePath]: VirtualAsset.file(`import { GuestLayout } from "../layouts/layouts"
          
export let html = <GuestLayout title="HomePage">
  <h1>Your content here</h1>
</GuestLayout>
`),
      [this.staticCssFilePath]: VirtualAsset.file(`@import 'tailwindcss'`)
    })
    this.vfs = vfs;
  }

  
static async load(appDirPath: string): Promise<AppDir> {
  const appDir = new AppDir(appDirPath, false);
  let vfs = await VirtualFS.load(appDir.path)
  appDir.vfs = vfs;
  return appDir;
}

}

