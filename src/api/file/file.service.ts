import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlink, writeFile } from 'fs';
import { extname, join, resolve } from 'path';
import { config } from 'src/config';
import { v4 } from 'uuid';

@Injectable()
export class FileService {
  private readonly base_url = `${config.BASE_API}`;

  async createFile(file: Express.Multer.File | any): Promise<string> {
    try {
      const ext = extname(file.orginalname);
      const file_name = `${file.orginalname.split(ext)[0]}__${v4}${ext.toLowerCase()}`;
      const file_path = resolve(__dirname, '..', '..', '..', '..', 'base');
      if (!existsSync(file_path)) {
        mkdirSync(file_path, { recursive: true });
      }
      await new Promise<void>((resolve, reject) => {
        writeFile(join(file_path, file_name), file.buffer, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
      return `${this.base_url}/${file_name}`;
    } catch (error) {
      throw new BadRequestException(`Error on creating file: ${error}`);
    }
  }

  async deleteFile(file_name: string): Promise<void> {
    try {
      const prefix = `${this.base_url}`;
      const file = (file_name as string).replace(prefix, '');
      const file_path = resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'base',
        file,
      );
      if (!existsSync(file_path))
        throw new BadRequestException(`File does not exist: ${file_name}`);
      await new Promise<void>((resolve, reject) => {
        unlink(file_path, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    } catch (error) {
      throw new BadRequestException(`Error on deleting file: ${error}`);
    }
  }

  async existsFile(file_name: string) {
    const file = file_name.replace(this.base_url, '');
    const file_path = resolve(__dirname, '..', '..', '..', '..', 'base', file);
    if (existsSync(file_path)) return true;
    return false;
  }
}
