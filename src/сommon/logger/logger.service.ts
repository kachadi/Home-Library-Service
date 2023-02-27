import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';

const logsPath = `src/application_logs`;
const maxLogFileSize = Number(process.env.MAX_LOG_FILE_SIZE_KB) * 1024;

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  constructor() {
    super();

    const logLevels = this.options.logLevels.slice(
      0,
      +process.env.LOG_LEVEL + 1,
    );

    this.setLogLevels(logLevels);
  }

  async writeLogToFile(message: string, filePath: string, date: Date) {
    const fileName = `${date.toJSON()}.log`;

    const lastLogFileName = await fs.promises
      .readdir(filePath)
      .then((filenames) => {
        if (filenames.length <= 1) {
          return false;
        } else {
          const filesArray = filenames
            .slice(1, filenames.length)
            .map((item) => Number(new Date(item.replace('.log', '')).getTime()))
            .sort((a: number, b: number) => b - a);
          const lastFile = `${new Date(filesArray[0]).toJSON()}.log`;
          return lastFile;
        }
      });

    if (lastLogFileName) {
      const lastLogFile = await fs.promises.stat(
        `${filePath}/${lastLogFileName}`,
      );
      const lastLogFileSize = lastLogFile.size;

      if (lastLogFileSize < maxLogFileSize) {
        await fs.promises.appendFile(
          `${filePath}/${lastLogFileName}`,
          `\n${message}`,
        );
      } else {
        await fs.promises.writeFile(`${filePath}/${fileName}`, message, {});
      }
    } else {
      await fs.promises.writeFile(`${filePath}/${fileName}`, message, {});
    }
  }

  getLogFilePath(isError: boolean) {
    let folder = 'app_logs';
    if (isError) folder = 'errors';

    const filePath = `${logsPath}/${folder}`;
    return filePath;
  }

  async log(message: string, ...args: any[]) {
    const date: Date = args[0];

    if (this.options.logLevels.includes('log')) {
      console.log(this.colorize(message, 'log'));
      const filePath = this.getLogFilePath(false);
      await this.writeLogToFile(message, filePath, date);
    }
  }

  async error(message: string, ...args: any[]) {
    const date: Date = args[0];

    if (this.options.logLevels.includes('error')) {
      console.log(this.colorize(message, 'error'));
      const filePath = this.getLogFilePath(true);
      await this.writeLogToFile(message, filePath, date);
    }
  }

  async warn(message: string, ...args: any[]) {
    const date: Date = args[0];

    if (this.options.logLevels.includes('warn')) {
      console.log(this.colorize(message, 'warn'));
      const filePath = this.getLogFilePath(true);
      await this.writeLogToFile(message, filePath, date);
    }
  }

  debug(message: string) {
    if (this.options.logLevels.includes('debug')) {
      console.log(this.colorize(message, 'debug'));
    }
  }

  verbose(message: string) {
    if (this.options.logLevels.includes('verbose')) {
      console.log(this.colorize(message, 'verbose'));
    }
  }
}
