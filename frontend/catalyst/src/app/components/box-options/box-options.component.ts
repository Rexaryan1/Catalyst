
// src/app/components/dropdown/box-options/box-options.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-box-options',
  standalone: true,
  imports: [FormsModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="dropdown-container">
      <h3>{{ title }}</h3>
      <mat-form-field appearance="outline">
        <mat-label>Search options</mat-label>
        <input matInput [(ngModel)]="searchTerm" placeholder="Type to filter">
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>{{ title }}</mat-label>
        <mat-select [multiple]="multiSelect" [(value)]="selected" (selectionChange)="onSelectionChange()">
          <mat-option *ngFor="let option of filteredOptions" [value]="option">{{ option }}</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .dropdown-container { padding: 1rem; background: #f8f9fa; border-radius: 0.5rem; }
  `]
})
export class BoxOptionsComponent {
  @Input() title: string = 'Select an Option';
  @Input() options: string[] = [];
  @Input() multiSelect: boolean = false;
  @Output() selectionChanged = new EventEmitter<string | string[]>();

  selected: string | string[] = '';
  searchTerm: string = '';

  get filteredOptions(): string[] {
    return this.options.filter(opt => opt.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  onSelectionChange() {
    this.selectionChanged.emit(this.selected);
  }
}

