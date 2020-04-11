import { GeneralService } from './general.service';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';

import { User, Language } from '../interfaces';
import { LocalstorageService } from './localstorage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;
  isLoggedIn = new BehaviorSubject(false);
  constructor(
    private http: HttpClient,
    private localStorage: LocalstorageService,
    private router: Router,
  ) {
    if (localStorage.getItem('token')) {
      this.setIsAuthenticated(true);
    }
  }

  registration(newUser: User): Observable<User> {
    return this.http.post<User>(`/api/auth/registration`, newUser);
  }

  login(user: User): Observable<{ token: string, message: string, currentLanguage: Language }> {
    return this.http.post<{ token: string, message: string, currentLanguage: Language }>(`/api/auth/login`, user);
  }

  logOut() {
    this.setIsAuthenticated(false);
    this.localStorage.removeItem('token');
    this.router.navigate(['authorization/login']);
  }

  setIsAuthenticated(value: boolean) {
    this.isLoggedIn.next(value);
  }

  isAuthenticated() {
    return this.isLoggedIn.getValue();
  }

  isAuthenticated$() {
    return this.isLoggedIn;
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isPasswordsMatch(password: string, confirmPassword: string) {
    return password === confirmPassword;
  }
}


