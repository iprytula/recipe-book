import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './components/ui/header/header.component';
import { MenuItem } from './types/menu-item.type';
import { menu } from './const/menu.const';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, MatButtonModule, HeaderComponent, RouterModule, MatListModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-recipe-book-v2';
  sidenavMenu: MenuItem[] = menu;
  @ViewChild('drawer', { static: true }) drawer!: MatSidenav;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.drawer.opened ? this.drawer.close() : null;
    });
  }
}
