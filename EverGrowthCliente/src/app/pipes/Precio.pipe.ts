import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Precio'
})
export class PrecioPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (value === undefined) {
      return ''; // O podrías devolver '0.00' u otro valor por defecto
    }
    return value.toFixed(2);
  }

}
