import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from './shared/assignments.service';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Application de gestion des assignments';
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,public authService:AuthService, private router:Router,
              private assignmentsService:AssignmentsService) {
                this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
              }

  login() {
    // si je suis pas loggé, je me loggue, sinon, si je suis
    // loggé je me déloggue et j'affiche la page d'accueil

    // if(this.authService.loggedIn) {
    //   // je suis loggé
    //   // et bien on se déloggue
    //   this.authService.logOut();
    //   // on navigue vers la page d'accueil
    //   this.router.navigate(["/home"]);
    // } else {
    //   // je ne suis pas loggé, je me loggue
    //   this.authService.logIn("admin", "toto");
    // }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
