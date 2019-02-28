import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;

  constructor(public afAuth: AngularFireAuth) {
  }

  tryLogin(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log('success', res);
        this.isLoggedIn = true;
      })
      .catch(err => console.log('fail', err));
  }

  tryLogout() {
    this.afAuth.auth.signOut()
      .then(res => {
        console.log('logged out', res);
        this.isLoggedIn = false;
      })
      .catch(err => console.log('error logging out', err));
  }
}
