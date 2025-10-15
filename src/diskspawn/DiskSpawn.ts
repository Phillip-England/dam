import { mkdir, writeFile, readFile } from 'fs/promises'
import path from 'path'
import { dirExists } from '../floss/floss';

export enum DiskType {
  File,
  Dir,
}

export class DiskRecord {
  path: string;
  diskType: DiskType;
  content: string;
  
  constructor(path: string, diskType: DiskType, content: string = "") {
    this.path = path;
    this.diskType = diskType;
    this.content = content;
  }
  
  static dir(path: string): DiskRecord {
    return new DiskRecord(path, DiskType.Dir, "");
  }
  
  static file(path: string, content: string): DiskRecord {
    return new DiskRecord(path, DiskType.File, content);
  }
}

export class DiskSpawn {
  records: DiskRecord[];
  
  constructor(records: DiskRecord[]) {
    this.records = records;
  }
  
  async writeToDisk() {
    for (const record of this.records) {
      if (record.diskType === DiskType.Dir) {
        await mkdir(record.path, { recursive: true });
      } else if (record.diskType === DiskType.File) {
        await mkdir(path.dirname(record.path), { recursive: true });
        await writeFile(record.path, record.content, 'utf-8');
      }
    }
  }
}

export class DiskPull {
  records: Map<string, DiskRecord>;
  
  constructor() {
    this.records = new Map();
  }
  
  static dir(path: string): DiskPullRequest {
    return new DiskPullRequest(path, DiskType.Dir);
  }
  
  static file(path: string): DiskPullRequest {
    return new DiskPullRequest(path, DiskType.File);
  }
  
  async loadFromDisk(requests: DiskPullRequest[]) {
    for (const request of requests) {
      if (request.diskType === DiskType.Dir) {
        if (await dirExists(request.path)) {
          this.records.set(request.path, new DiskRecord(request.path, DiskType.Dir, ""));
        } else {
          throw new Error(`Directory not found: ${request.path}`);
        }
      } else if (request.diskType === DiskType.File) {
        try {
          const content = await readFile(request.path, 'utf-8');
          this.records.set(request.path, new DiskRecord(request.path, DiskType.File, content));
        } catch (error) {
          throw new Error(`Failed to read file: ${request.path}`);
        }
      }
    }
  }
  
  get(path: string): DiskRecord | undefined {
    return this.records.get(path);
  }
  
  read(path: string): string | undefined {
    return this.records.get(path)?.content;
  }
  
  has(path: string): boolean {
    return this.records.has(path);
  }
  
  getAllPaths(): string[] {
    return Array.from(this.records.keys());
  }
}

export class DiskPullRequest {
  path: string;
  diskType: DiskType;
  
  constructor(path: string, diskType: DiskType) {
    this.path = path;
    this.diskType = diskType;
  }
}