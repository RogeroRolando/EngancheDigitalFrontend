import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ClpPipe } from '@core/pipes/clp.pipe';
import { BaseDialogComponent } from '@core/components/base-dialog/base-dialog.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ElementRef, ViewChild } from '@angular/core';
import { EngancheService, Cliente, Transferencia } from '@core/services/enganche.service';

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
    BaseDialogComponent
  ],
  templateUrl: './agregar-transferencia-dialog.component.html',
  styleUrls: ['./agregar-transferencia-dialog.component.scss']
})
export class AgregarTransferenciaDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AgregarTransferenciaDialogComponent>);
  private fb = inject(FormBuilder);
  private engancheService = inject(EngancheService);

  @ViewChild('clienteInput') clienteInput!: ElementRef;

  form: FormGroup;
  selectedFileName: string = '';
  clientes: Cliente[] = [];
  filteredClientes$: Observable<Cliente[]>;
  modoEdicion: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.modoEdicion = data?.modo === 'editar';
    
    this.form = this.fb.group({
      cliente: [null, Validators.required],
      importe: [null, [Validators.required, Validators.min(1)]],
      comprobante: [null, this.modoEdicion ? null : Validators.required]
    });

    // Inicializar los clientes
    this.engancheService.getClientes().subscribe(clientes => {
      this.clientes = clientes.filter(cliente => cliente.activo);
      
      // Si estamos en modo edición y tenemos una transferencia, buscamos el cliente
      if (this.modoEdicion && data?.transferencia) {
        const transferencia = data.transferencia; // Guardamos referencia local para evitar accesos undefined
        const clienteEncontrado = clientes.find(c => c.nombre === transferencia.cliente);
        if (clienteEncontrado) {
          this.form.patchValue({
            cliente: clienteEncontrado,
            importe: transferencia.importe
          });
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
        return nombre ? this._filter(nombre) : this.clientes.slice();
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
    setTimeout(() => {
      if (this.clienteInput) {
        this.clienteInput.nativeElement.blur();
      }
    });
  }

  displayFn(cliente: Cliente): string {
    return cliente ? `${cliente.nombre} - ${cliente.rut}` : '';
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFileName = file.name;
      this.form.patchValue({
        comprobante: file
      });
      this.form.get('comprobante')?.markAsTouched();
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

  guardar() {
    if (this.form.valid) {
      const formValue = this.form.value;
      formValue.importe = Math.round(formValue.importe);
      
      if (this.modoEdicion) {
        // En modo edición, solo enviamos los campos que han sido modificados
        const cambios: Partial<Transferencia> = {};
        
        if (this.form.get('cliente')?.dirty) {
          cambios.cliente = formValue.cliente.nombre;
        }
        
        if (this.form.get('importe')?.dirty) {
          cambios.importe = formValue.importe;
        }

        if (formValue.comprobante) {
          cambios.comprobante = URL.createObjectURL(formValue.comprobante);
        }

        // Solo cerramos el diálogo si hay cambios
        if (Object.keys(cambios).length > 0) {
          this.dialogRef.close({
            modo: 'editar',
            id: this.data?.transferencia?.id,
            cambios
          });
        }
      } else {
        // En modo creación, enviamos todos los campos
        this.dialogRef.close({
          modo: 'crear',
          datos: formValue
        });
      }
    }
  }
}
