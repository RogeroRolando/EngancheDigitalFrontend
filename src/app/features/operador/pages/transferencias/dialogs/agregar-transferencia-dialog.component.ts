import { Component, inject, OnInit, Inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseDialogComponent } from '@core/components/base-dialog/base-dialog.component';
import { Observable } from 'rxjs';
import { startWith, map, finalize, catchError } from 'rxjs/operators';
import { ElementRef, ViewChild } from '@angular/core';
import { EngancheService, Cliente, Transferencia } from '@core/services/enganche.service';
import { DecimalPipe } from '@angular/common';

interface DialogData {
  transferencia?: Transferencia;
  modo: 'crear' | 'editar';
}

@Component({
  selector: 'app-agregar-transferencia-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    BaseDialogComponent
  ],
  providers: [DecimalPipe],
  templateUrl: './agregar-transferencia-dialog.component.html',
  styleUrls: ['./agregar-transferencia-dialog.component.scss']
})
export class AgregarTransferenciaDialogComponent implements OnInit, AfterViewInit {
  private dialogRef = inject(MatDialogRef<AgregarTransferenciaDialogComponent>);
  private fb = inject(FormBuilder);
  private engancheService = inject(EngancheService);
  private decimalPipe = inject(DecimalPipe);

  @ViewChild('clienteInput') clienteInput!: ElementRef;
  @ViewChild('importeInput') importeInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  form: FormGroup;
  selectedFileName: string = '';
  clientes: Cliente[] = [];
  filteredClientes$: Observable<Cliente[]>;
  modoEdicion: boolean;
  isLoading = false;
  isDragOver = false;
  error: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.modoEdicion = data?.modo === 'editar';
    
    this.form = this.fb.group({
      cliente: [null, Validators.required],
      importe: [null, [Validators.required, Validators.min(1)]],
      comprobante: [null, this.modoEdicion ? null : Validators.required],
      fecha: [new Date(), Validators.required],
      estado: ['pendiente', Validators.required]
    });

    // Inicializar los clientes
    this.engancheService.getClientes().subscribe(clientes => {
      this.clientes = clientes.filter(cliente => cliente.activo);
      
      // Si estamos en modo edición y tenemos una transferencia, buscamos el cliente
      if (this.modoEdicion && data?.transferencia) {
        const transferencia = data.transferencia;
        const clienteEncontrado = clientes.find(c => c.nombre === transferencia.cliente);
        if (clienteEncontrado) {
          this.form.patchValue({
            cliente: clienteEncontrado,
            importe: transferencia.importe,
            fecha: transferencia.fecha,
            estado: transferencia.estado
          });

          // Actualizar el input de importe con el valor formateado
          if (this.importeInput) {
            this.importeInput.nativeElement.value = this.formatearImporte(transferencia.importe);
          }
        }
        
        if (transferencia.comprobante) {
          this.selectedFileName = 'Comprobante actual';
        }
      }
    });

    this.filteredClientes$ = this.form.get('cliente')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const nombre = typeof value === 'string' ? value : value?.nombre;
        return nombre ? this._filter(nombre) : [];
      })
    );
  }

  private _filter(nombre: string): Cliente[] {
    const filterValue = nombre.toLowerCase();
    return this.clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(filterValue) || 
      cliente.rut?.toLowerCase().includes(filterValue)
    );
  }

  ngOnInit() {
    // No es necesario hacer nada aquí
  }

  ngAfterViewInit() {
    // Si hay un valor inicial de importe, formatearlo
    const importeInicial = this.form.get('importe')?.value;
    if (importeInicial && this.importeInput) {
      this.importeInput.nativeElement.value = this.formatearImporte(importeInicial);
    }
  }

  displayFn(cliente: Cliente): string {
    return cliente ? `${cliente.nombre} - ${cliente.rut}` : '';
  }

  limpiarCliente(event: Event) {
    event.stopPropagation();
    this.form.patchValue({ cliente: null });
    this.clienteInput.nativeElement.focus();
  }

  private formatearImporte(valor: number | null): string {
    if (!valor || isNaN(valor)) {
      return '$ 0';
    }
    const numeroFormateado = this.decimalPipe.transform(valor, '1.0-0');
    return `$ ${numeroFormateado}`;
  }

  onImporteInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    
    // Eliminar cualquier carácter que no sea número
    value = value.replace(/[^\d]/g, '');
    
    // Mantener solo los primeros 15 dígitos para evitar problemas con números muy grandes
    value = value.slice(0, 15);
    
    // Convertir a número
    const numero = parseInt(value, 10);
    
    // Actualizar el valor en el formulario sin emitir evento para evitar loop
    this.form.patchValue({
      importe: isNaN(numero) ? null : numero
    }, { emitEvent: false });

    // Formatear el valor en el input
    input.value = this.formatearImporte(numero);

    // Marcar el campo como tocado para mostrar errores si es necesario
    this.form.get('importe')?.markAsTouched();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedFileName = file.name;
      // Convertir el archivo a una URL de datos
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64String = e.target?.result as string;
        this.form.patchValue({
          comprobante: base64String
        });
        this.form.get('comprobante')?.markAsTouched();
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFileName = file.name;
      // Convertir el archivo a una URL de datos
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64String = e.target?.result as string;
        this.form.patchValue({
          comprobante: base64String
        });
        this.form.get('comprobante')?.markAsTouched();
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFileName = '';
    this.form.patchValue({
      comprobante: null
    });
    this.form.get('comprobante')?.markAsTouched();
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  guardar() {
    if (this.form.valid) {
      this.isLoading = true;
      this.error = null;
      const formValue = this.form.value;
      
      // Asegurar que el importe sea un número
      formValue.importe = Number(formValue.importe);
      
      if (this.modoEdicion) {
        // En modo edición, enviar todos los campos modificados
        const cambios: Partial<Transferencia> = {
          cliente: formValue.cliente.nombre,
          importe: formValue.importe,
          estado: formValue.estado
        };

        // Solo incluir el comprobante si se seleccionó uno nuevo
        if (formValue.comprobante) {
          cambios.comprobante = formValue.comprobante;
        }

        if (formValue.fecha) {
          cambios.fecha = formValue.fecha;
        }

        this.engancheService.editarTransferencia(this.data.transferencia!.id, cambios)
          .pipe(
            catchError(error => {
              this.error = 'Error al actualizar la transferencia. Por favor, intente nuevamente.';
              this.isLoading = false;
              throw error;
            })
          )
          .subscribe(() => {
            this.isLoading = false;
            this.dialogRef.close(true);
          });
      } else {
        const nuevaTransferencia: Omit<Transferencia, 'id'> = {
          cliente: formValue.cliente.nombre,
          importe: formValue.importe,
          comprobante: formValue.comprobante,
          estado: 'Pendiente',
          fecha: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };

        this.engancheService.agregarTransferencia(nuevaTransferencia)
          .pipe(
            catchError(error => {
              this.error = 'Error al crear la transferencia. Por favor, intente nuevamente.';
              this.isLoading = false;
              throw error;
            })
          )
          .subscribe(() => {
            this.isLoading = false;
            this.dialogRef.close(true);
          });
      }
    }
  }
}
