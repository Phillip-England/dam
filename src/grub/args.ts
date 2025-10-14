

export function getArgByNumber(num: number): string {
  let args = Bun.argv;
  let selectedArg = args[num];
  if (selectedArg) {
    return selectedArg;
  }
  return '';
}

export function hasFlag(flag: string): boolean {
  let args = Bun.argv;
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (arg == flag) {
      return true;
    }
  }
  return false;
}