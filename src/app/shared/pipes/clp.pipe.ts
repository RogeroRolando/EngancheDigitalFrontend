import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clp',
  standalone: true
})
export class ClpPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return '$0';
    }

    // Si el valor ya es una cadena y comienza con $, devolverlo tal cual
    if (typeof value === 'string' && value.startsWith('$')) {
      return value;
    }

    // Convertir a número si es una cadena
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    // Formatear el número como moneda CLP
    return `$${numericValue}`;
  }
}
