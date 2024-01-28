import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Precio'
})
export class PrecioPipe implements PipeTransform {
  transform(value: number): string {
    return value.toFixed(2);
  }

}
