import { getArgByNumber } from "./args";
import { ArgSchema } from "./ArgSchema";

export class Cmd {
  operation: () => Promise<void>;
  schemaRecord: Record<string, ArgSchema>
  args: Record<string, string | number>
  constructor() {
    this.operation = async () => {
      throw new Error(`Cmd does not have an operation set, please set it using cmd.setOperation`)
    }
    this.schemaRecord = {};
    this.args = {}
  }
  setSchema(schemaRecord: Record<string, ArgSchema>) {
    this.schemaRecord = schemaRecord
  }
  enforceSchema() {
    for (const [key, value] of Object.entries(this.schemaRecord)) {
      let argType = value.argType;
      let pos = value.position;
      let argStr = getArgByNumber(pos);
      if (argStr == '') {
        throw new Error(`arg <${key}> not found in position ${pos}`)
      }
      switch (argType) {
        case 'string': {
          this.args[key] = argStr;
          break;
        }
        case 'number': {
          const num = Number(argStr);
          if (isNaN(num)) {
            throw new Error(`arg <${key}> at position ${pos} must be a number, got: ${argStr}`);
          }
          this.args[key] = num;
          break;
        }
        default: {
          throw new Error(`Unknown arg type: ${argType}`);
        }
      }
    }
  }
  getArg(name: string): string | number {
    for (const [key, value] of Object.entries(this.args)) {
      if (key == name) {
        return value;
      }
    }
    throw new Error(`failed to located arg named ${name}`)
  }
  setOperation(operation: () => Promise<void>) {
    this.operation = operation;
  }
}