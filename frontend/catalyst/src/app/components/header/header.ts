import { Component, OnInit, OnDestroy } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import { Router, NavigationEnd, RouterModule, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {PingBoardComponent} from "@components/cards/ping-board/ping-board.component";
import {DataManagerService} from "@services/data-manager/data-manager.service";

@Component({
  selector: 'app-header',
  imports: [
    NgForOf,
    NgIf,
    RouterModule,
    PingBoardComponent,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy{
  pageTitle: string = 'Home';
  showNotifications = false;
  private routerSub!: Subscription;
  isVisible = false;
  private readonly excludedRoutes = ['/register', '/landing' , '/prompt'];

  menuItems = [
    { label: 'notifications', icon: '../../assets/icons/notification-bing.svg', route: null ,  isHome: false , isNotif: true , isLogout: false },
    { label: 'Logout', icon: '../../assets/icons/logout.svg' , route: null ,  isHome: false , isNotif: false , isLogout: true },
    { label: 'Home', icon: '../../assets/Catalyst-Favicon.ico', route: '/home' ,  isHome: true , isNotif: false , isLogout: false },

  ];
  constructor(private router: Router, private activatedRoute: ActivatedRoute , private dataManager: DataManagerService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        this.isVisible = !this.excludedRoutes.some(r => url.startsWith(r));
      }
    });
  }

  ngOnInit() {
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        // Walk the activated route tree to the deepest child
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) route = route.firstChild;
        return route?.snapshot.data?.['title'] ?? 'App';
      })
    ).subscribe(title => this.pageTitle = title);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  logout() {
    this.dataManager.logout();
  }


}
