import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-base-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">{{title}}</h2>
      
      <mat-dialog-content>
        <ng-content></ng-content>
      </mat-dialog-content>

      <mat-dialog-actions>
        <ng-content select="[dialog-actions]"></ng-content>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .dialog-container {
      padding: 0;
      min-width: 400px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .dialog-title {
      margin: 0;
      padding: 16px 24px;
      background: #3f51b5;
      color: #ffffff;
      font-size: 20px;
      font-weight: 400;
    }

    mat-dialog-content {
      margin: 0;
      padding: 24px;
      max-height: 70vh;
    }

    mat-dialog-actions {
      margin: 0;
      padding: 16px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      background: white;
    }

    ::ng-deep {
      .mat-mdc-dialog-container {
        padding: 0 !important;
      }

      .mdc-dialog__surface {
        border-radius: 8px !important;
        overflow: hidden !important;
      }

      .mat-mdc-dialog-content {
        padding: 24px !important;
      }

      .mat-mdc-dialog-actions {
        padding: 16px 24px !important;
        margin-bottom: 0 !important;
      }

      button.mat-mdc-button-base {
        border-radius: 4px;
        text-transform: none;
        font-weight: 400;
      }

      .mat-mdc-raised-button.mat-primary {
        background-color: #3f51b5;
      }

      .mat-mdc-button.mat-unthemed {
        color: rgba(0, 0, 0, 0.87);
      }

      .mat-mdc-dialog-title {
        color: #ffffff !important;
        margin: 0 !important;
      }
    }
  `]
})
export class BaseDialogComponent {
  @Input() title: string = '';
}
