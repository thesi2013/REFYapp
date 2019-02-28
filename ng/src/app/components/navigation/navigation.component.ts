import {Component, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, filter, mergeMap} from 'rxjs/operators';
import {MatSidenav} from '@angular/material';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

  @ViewChild('drawer') drawer: MatSidenav;

  title: string;
  isLoggedIn = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data))
      .subscribe((event) => {
        this.title = event['title'];
      });
  }

  close()
    :
    void {
    this.isHandset$.subscribe(res => {
      res.valueOf() ? this.drawer.toggle() : null;
    });
  }
}
