import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;

  constructor(
    public authService: AuthService
  ) {
  }

  ngOnInit() {
  }

  tryLogin() {
    this.authService.tryLogin(this.email, this.password);
  }

  tryLogout() {
    this.authService.tryLogout();
  }

}
