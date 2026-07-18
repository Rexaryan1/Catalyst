import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type QuickAccessItem = {
  label: string;
  icon: string;  // assets path
  route: string;
};

@Component({
  selector: 'app-quick-access',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss'],
})
export class QuickAccessComponent {
  items: QuickAccessItem[] = [
    { label: 'Dashboard', icon: 'assets/icons/dashboard-icon.svg', route: '/dashboard' },
    { label: 'Home', icon: 'assets/icons/home-icon.svg', route: '/home' },
    { label: 'Generate', icon: 'assets/icons/generate-icon.svg', route: '/prompt' },
    { label: 'Solve', icon: 'assets/icons/solve.svg', route: '/sessions' },
  ];
}
