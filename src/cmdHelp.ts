import { Cmd } from "grub"

export const cmdHelp = new Cmd("help")
cmdHelp.setAsDefault()

cmdHelp.setOperation(async () => {
  console.log(`----------
welcome to the dam web framework..
build on bun..
simplistic in nature..
dam..
----------
features:
----------
help - display the help screen
usage:
  - dam
  - dam help
----------
init - create a new project
usage:
  - dam init projectname
----------
  `)
})
