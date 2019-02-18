import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  constructor(public afAuth: AngularFireAuth) {
  }

  ngOnInit() {
  }

  tryLogin() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(res => console.log('success', res))
      .catch(err => console.log('fail', err));
  }

  tryLogout() {
    this.afAuth.auth.signOut()
      .then(res => console.log('logged out', res))
      .catch(err => console.log('error logging out', err));
  }

}
