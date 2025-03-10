import { NgIf } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { environment } from '@environment/environment';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatToolbarModule, MatTooltipModule],
  templateUrl: './toolbar.component.html',
  styles: ``,
})
export class ToolbarComponent {
  isLogin = input.required<boolean>();
  username = input.required<string>();
  logout = output<void>();
  title = environment.title;

  onLogout() {
    this.logout.emit();
  }

  onLogin() {
    // window.location.href = `${environment.sso}?appId=${environment.id}`
  }
}
