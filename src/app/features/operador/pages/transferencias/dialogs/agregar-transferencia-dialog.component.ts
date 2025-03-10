import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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

interface Cliente {
  id: number;
  nombre: string;
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
  template: `
    <app-base-dialog title="Agregar Nueva Transferencia">
      <form [formGroup]="form" class="dialog-form">
        <div class="form-field">
          <label>Cliente*</label>
          <mat-form-field appearance="outline">
            <input matInput
                   [matAutocomplete]="auto"
                   formControlName="cliente"
                   placeholder="Buscar cliente..."
                   (click)="$event.stopPropagation()"
                   #clienteInput>
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>
          <mat-autocomplete #auto="matAutocomplete"
                          [displayWith]="displayFn"
                          [autoActiveFirstOption]="false"
                          (opened)="false">
            <mat-option *ngFor="let cliente of filteredClientes$ | async" [value]="cliente">
              {{cliente.nombre}}
            </mat-option>
          </mat-autocomplete>
          <mat-error *ngIf="form.get('cliente')?.hasError('required') && form.get('cliente')?.touched">
            El cliente es requerido
          </mat-error>
        </div>

        <div class="form-field">
          <label>Importe (CLP)*</label>
          <mat-form-field appearance="outline">
            <input matInput
                   type="number"
                   formControlName="importe"
                   min="1"
                   step="1000"
                   class="number-input">
            <mat-icon matSuffix>payments</mat-icon>
          </mat-form-field>
          <mat-error *ngIf="form.get('importe')?.hasError('required') && form.get('importe')?.touched">
            El importe es requerido
          </mat-error>
          <mat-error *ngIf="form.get('importe')?.hasError('min') && form.get('importe')?.touched">
            El importe debe ser mayor a 0
          </mat-error>
        </div>

        <div class="form-field">
          <label>Comprobante*</label>
          <div class="file-input-container">
            <button mat-stroked-button
                    type="button"
                    (click)="fileInput.click()"
                    class="upload-button">
              <mat-icon>upload</mat-icon>
              Subir Comprobante
            </button>
            <input type="file"
                   #fileInput
                   (change)="onFileSelected($event)"
                   accept="image/*"
                   style="display: none">
          </div>
          <div class="file-preview" *ngIf="selectedFileName">
            <span class="file-name">{{selectedFileName}}</span>
            <button mat-icon-button color="warn" (click)="removeFile($event)">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <mat-error *ngIf="form.get('comprobante')?.hasError('required') && form.get('comprobante')?.touched">
            El comprobante es requerido
          </mat-error>
        </div>
      </form>

      <div dialog-actions>
        <button mat-button mat-dialog-close>
          Cancelar
        </button>
        <button mat-flat-button
                color="primary"
                [disabled]="!form.valid"
                (click)="guardar()">
          Guardar
        </button>
      </div>
    </app-base-dialog>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    mat-form-field {
      width: 100%;

      ::ng-deep {
        .mat-mdc-form-field-flex {
          background-color: white;
        }

        .mat-mdc-text-field-wrapper {
          background-color: white;
        }

        .mat-mdc-form-field-icon-suffix {
          color: rgba(0, 0, 0, 0.54);
        }
      }
    }

    .number-input {
      text-align: right;
    }

    .file-input-container {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .file-preview {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: #f5f5f5;
      border-radius: 4px;
      margin-top: 8px;

      .file-name {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    mat-error {
      font-size: 12px;
      margin-top: 4px;
    }

    [dialog-actions] {
      button {
        min-width: 88px;
      }
    }
  `]
})
export class AgregarTransferenciaDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AgregarTransferenciaDialogComponent>);
  private fb = inject(FormBuilder);

  @ViewChild('clienteInput') clienteInput!: ElementRef;

  form: FormGroup;
  selectedFileName: string = '';
  clientes: Cliente[] = [
    { id: 1, nombre: 'Cliente A' },
    { id: 2, nombre: 'Cliente B' },
    { id: 3, nombre: 'Cliente C' }
  ];

  filteredClientes$: Observable<Cliente[]>;

  constructor() {
    this.form = this.fb.group({
      cliente: [null, Validators.required],
      importe: [null, [Validators.required, Validators.min(1)]],
      comprobante: [null, Validators.required]
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
    return this.clientes.filter(cliente => cliente.nombre.toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    // Asegurarse que el autocompletado no se abra automáticamente
    setTimeout(() => {
      if (this.clienteInput) {
        this.clienteInput.nativeElement.blur();
      }
    });
  }

  displayFn(cliente: Cliente): string {
    return cliente ? cliente.nombre : '';
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
      this.dialogRef.close(formValue);
    }
  }
}
