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
  // Dashboard and Home already live in the persistent top nav — this strip
  // only needs to surface the actions that don't have a home elsewhere.
  items: QuickAccessItem[] = [
    { label: 'Generate', icon: 'assets/icons/generate-icon.svg', route: '/prompt' },
    { label: 'Solve', icon: 'assets/icons/solve.svg', route: '/sessions' },
    { label: 'Roadmaps', icon: 'assets/icons/dashboard-icon.svg', route: '/roadmap-tracker' },
  ];
}
