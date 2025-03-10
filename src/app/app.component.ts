import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './core/components/toolbar/toolbar.component';
import { MenuComponent } from './core/components/menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatProgressBarModule,
    ToolbarComponent,
    MenuComponent
  ],
  templateUrl: './app.component.html',
  styles: [`
    .container {
      width: 100%;
      height: calc(100vh - 64px);
    }
    .content {
      padding: 20px;
    }
  `]
})
export class AppComponent {
  isLogin = true;
  username = 'Usuario';
  status = false;
}
