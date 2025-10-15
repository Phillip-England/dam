
import path from 'path';
import { Grub } from './src/grub/Grub';

let cli = new Grub(path.join(process.cwd(), "cli"))
await cli.run()
