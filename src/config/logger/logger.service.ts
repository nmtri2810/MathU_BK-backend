import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  customLog() {
    this.log('Please feed the cat!');
  }
}
