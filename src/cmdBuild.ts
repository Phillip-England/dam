import { AppDir } from "./AppDir"
import { Cmd } from "grub"
import { VirtualAsset, VirtualFS } from "hoist"
import path from 'path'
import { renderToString } from 'react-dom/server';


export const cmdBuild = new Cmd('build')

cmdBuild.setOperation(async () => {
  await opBuild()
})


export async function opBuild() {
  console.log('🔨 building..')
  let app = await AppDir.load(path.join(process.cwd(), 'app'))
  let routesDir = await VirtualFS.load(app.routesDirPath)
  let buildAssets: Record<string, VirtualAsset> = {};
  await routesDir.iterAssets(async (asset, pth) => {
    const module = await import(asset.path);
    let html = module.html
    let htmlStr = renderToString(html)
    let buildPath = path.join(app.buildDirPath, asset.filename.replace('tsx', 'html'))
    buildAssets[buildPath] = VirtualAsset.file(htmlStr)
  })
  let buildFS = await VirtualFS.overwrite(app.buildDirPath, buildAssets);
  console.log('👍 complete!')
}