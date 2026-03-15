import { Component } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {DataManagerService} from "@services/data-manager/data-manager.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-footer',
  imports: [
    NgIf
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  isVisible = false;
  private readonly excludedRoutes = ['/preview' , '/register' , '/landing'];

  constructor(private router: Router, private activatedRoute: ActivatedRoute ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        this.isVisible = !this.excludedRoutes.some(r => url.startsWith(r));
      }
    });
  }
}
