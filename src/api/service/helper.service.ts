import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class HelperService {
  public generateId(length = 6): string {
    const timestamp = +new Date();

    const _getRandomInt = (min, max): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const ts = timestamp.toString();
    const parts = ts.split('').reverse();
    let id = '';

    for (let i = 0; i < length; ++i) {
      const index = _getRandomInt(0, parts.length - 1);
      id += parts[index];
    }

    return id;
  }

  public getTempPassword(): string {
    return Math.random().toString(36).slice(-12);
  }

  public uploadFile(file: FileUpload, id, path): Promise<String> {
    const { createReadStream, filename } = file;
    const files = filename?.split('.');
    const fname = `${id}.${files[1]}`;
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(`./assets/${path}/${fname}`))
        .on('finish', () => resolve(fname))
        .on('error', () => reject(false)),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public changeObjKeys(obj: unknown, replaceStr): any {
    const data = Object.keys(obj).map((key) => {
      return { [key.replace(replaceStr, '')]: obj[key] };
    });
    return data;
  }

  public getCurrentDate(format = 'YYYY-MM-DD'): Date {
    return new Date(moment().format(format));
  }
}
