import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clp',
  standalone: true
})
export class ClpPipe implements PipeTransform {
  transform(value: number | string | null): string {
    if (value === null) return '$ 0';
    
    // Si es string, intentar convertir a número
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Si no es un número válido
    if (isNaN(numValue)) return '$ 0';
    
    const formattedNumber = Math.abs(numValue).toLocaleString('es-CL');
    const sign = numValue < 0 ? '-' : '';
    return `${sign}$ ${formattedNumber}`;
  }
}
