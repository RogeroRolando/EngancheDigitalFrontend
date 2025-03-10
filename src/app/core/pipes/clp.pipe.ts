import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clp',
  standalone: true
})
export class ClpPipe implements PipeTransform {
  transform(value: number): string {
    // Redondear a número entero
    const valueInt = Math.round(value);
    
    // Formatear con separadores de miles
    const formatted = valueInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    // Retornar con el símbolo de peso chileno
    return `$ ${formatted}`;
  }
}
