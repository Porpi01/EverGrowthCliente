import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimDate'
})
export class TrimDatePipe implements PipeTransform {

  transform(textToTrim: string | Date, longitud: number = 20): string {
    if (!textToTrim) {
      return '';
    }

    const text = textToTrim instanceof Date ? textToTrim.toISOString() : textToTrim.toString();
    return text.length > longitud ? text.substring(0, longitud) + "" : text;
  }

}
