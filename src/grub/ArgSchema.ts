

type ArgType = string;

export class ArgSchema {
  argType: ArgType
  position: number
  constructor(argType: ArgType, position: number) {
    this.position = position
    switch (argType) {
      case 'string': {
        this.argType = argType;
        return;
      }
      case 'number': {
        this.argType = argType;
        return
      }
      default: {
        throw new Error(`ArgScheme of type ${argType} is not valid\n'string', 'number', 'flag' are all valid`)
      }
    }
  }
}

export function argString(position: number) {
  return new ArgSchema('string', position)
}

export function argNumber(position: number) {
  return new ArgSchema('number', position)
}
