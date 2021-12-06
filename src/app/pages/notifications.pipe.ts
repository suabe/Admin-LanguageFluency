import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notifications'
})
export class NotificationsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
