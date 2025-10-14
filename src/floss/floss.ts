import path from 'path';
import { readdir } from 'fs/promises';
import { access, stat } from 'fs/promises';
import { join } from 'path';

export function absPath(...pathsToJoin: string[]): string {
  return path.join(process.cwd(), ...pathsToJoin);
}

export async function walkDir(dirPath: string) {
  const files = await readdir(dirPath, { withFileTypes: true })
  for (const file of files) {
    const path = join(dirPath, file.name);
    if (file.isDirectory()) {
      console.log('DIR:', path);
      await walkDir(path);
    } else {
      console.log('FILE:', path);
    }
  }
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function dirExists(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}