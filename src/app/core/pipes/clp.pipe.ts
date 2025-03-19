import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clp',
  standalone: true
})
export class ClpPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return '$ 0';
    }

    // Si el valor ya incluye el símbolo $, retornarlo tal cual
    if (typeof value === 'string' && value.includes('$')) {
      return value;
    }

    // Convertir a número y redondear a entero
    const valueInt = Math.round(Number(value));
    
    // Si no es un número válido, retornar 0
    if (isNaN(valueInt)) {
      return '$ 0';
    }
    
    // Formatear con separadores de miles
    const formatted = valueInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    // Retornar con el símbolo de peso chileno
    return `$ ${formatted}`;
  }
}
