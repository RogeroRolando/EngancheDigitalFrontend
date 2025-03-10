import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ConfirmationComponent } from '@core/components/confirmation/confirmation.component';
import { Confirmation } from '@core/interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private dialog = inject(MatDialog);

  alert(data: Confirmation) {
    this.dialog.open(ConfirmationComponent, { data });
  }

  confirmation(data: Confirmation): Observable<boolean> {
    return this.dialog.open(ConfirmationComponent, { data }).afterClosed();
  }
}
