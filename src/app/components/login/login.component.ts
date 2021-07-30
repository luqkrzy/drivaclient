import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private subscriptions = new SubSink();
  private readonly pattern = '^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]*';
  login: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  get username(): AbstractControl {
    return this.login.get('username') as AbstractControl;
  }

  get password(): AbstractControl {
    return this.login.get('password') as AbstractControl;
  }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl('/');
    }
    this.initLoginForm();
  }

  onSubmit(login: FormGroup) {
    this.subscriptions.add(
      this.authService.login(login.value).subscribe(response => {
        this.authService.addTokenToCache(response.headers.get('Jwt-Token') as string);
        this.authService.addUserToCache(response.body as User);
        this.router.navigateByUrl('');
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.password.setErrors({badCredentials: error.error.message});
      }));
  }

  private initLoginForm() {
    this.login = this.fb.group({
      username: ['', [Validators.required,
                      Validators.minLength(3),
                      Validators.pattern(this.pattern)]],
      password: ['', Validators.required]
    });
  }
}