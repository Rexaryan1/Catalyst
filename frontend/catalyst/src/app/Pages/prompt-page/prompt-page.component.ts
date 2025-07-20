import { Component, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// Update the import path to the correct location of BoxOptionsComponent
import { BoxOptionsComponent } from '../../components/dropdown/box-options/box-options.component';
@Component({
  selector: 'app-prompt-page',
  standalone: true,
  imports: [MatProgressBarModule, BoxOptionsComponent],
  templateUrl: './prompt-page.component.html',
  styleUrl: './prompt-page.component.scss'
})
export class PromptPageComponent {

 @ViewChild('dropdownSubject', { read: ViewContainerRef }) dropdownSubject!: ViewContainerRef;

  openDropdown() {
    // this.dropdownSubject.clear();
    const componentRef = this.dropdownSubject.createComponent(BoxOptionsComponent);
    componentRef.instance.title = 'Select an Option';

  }
}
