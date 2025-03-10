import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { Confirmation } from '@core/interfaces/auth';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, TitleCasePipe],
  templateUrl: './confirmation.component.html',
  styles: ``,
})
export class ConfirmationComponent {
  dialog = inject(MatDialogRef<ConfirmationComponent>);
  data = inject<Confirmation>(MAT_DIALOG_DATA);

  constructor() {
    this.dialog.disableClose = true;
  }

  onClose(result: boolean) {
    this.dialog.close(result);
  }
}
