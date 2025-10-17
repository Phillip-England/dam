import { cmdBuild } from "./src/cmdBuild"
import { cmdHelp } from "./src/cmdHelp"
import { cmdInit } from "./src/cmdInit"
import { cmdServe } from "./src/cmdServe"
import { Grub } from "grub"

let cli = new Grub(cmdHelp, cmdInit, cmdBuild, cmdServe)
try {
  await cli.run();
} catch (err: any) {
  console.error(err.message);
}