import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private  url= environment.url;

  constructor(private router: Router, private http:HttpClient) {
    const status = localStorage.getItem('isLoggedIn');
    if (status === 'true') {
      this.loggedIn.next(true);
    }
  }

  login(data:any) {

  return this.http.post<any>(this.url+`login`,data);
   
  }


  personalreg(data:any){
    return this.http.post<any>(this.url+`personal`,data);

  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getpersonal(data:any){
    return this.http.post<any>(this.url+`getpersonal`,data);

  }
}
