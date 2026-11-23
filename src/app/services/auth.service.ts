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
    localStorage.removeItem('id');
    localStorage.removeItem('idcreador');
    localStorage.removeItem('nombre');
    localStorage.removeItem('role');
    localStorage.removeItem('mustChangePassword');
    localStorage.removeItem('isMaster');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  /**
   * Returns the root administrator (tenant) ID:
   * - For main administrators (`usuarios`): their own `id`.
   * - For staff (`personal`): their administrator's `idcreador`.
   */
  getTenantId(): string | null {
    const hasRole = !!localStorage.getItem('role');
    const idcreador = localStorage.getItem('idcreador');
    if (hasRole && idcreador && idcreador !== 'undefined' && idcreador !== 'null') {
      return idcreador;
    }
    return localStorage.getItem('id');
  }

  /**
   * Returns the logged-in staff member ID when logged in as `personal`, or null for a main administrator.
   */
  getPersonalId(): string | null {
    return localStorage.getItem('role') ? localStorage.getItem('id') : null;
  }

  isMaster(): boolean {
    if (localStorage.getItem('role')) {
      return false;
    }
    if (localStorage.getItem('isMaster') === 'true') {
      return true;
    }
    return (localStorage.getItem('nombre') || '').trim().toLowerCase() === 'admin';
  }

  getpersonal(data:any){
    return this.http.post<any>(this.url+`getpersonal`,data);

  }

  deletePersonal(data: { id: number | string; idcreador?: string | null }) {
    return this.http.post<any>(this.url + `deletepersonal`, data);
  }

  deleteAccount(id: string) {
    return this.http.post<any>(this.url + `deletecuenta`, { id });
  }

  changePassword(data: { id: string; role?: string | null; currentPassword: string; newPassword: string }) {
    return this.http.post<any>(this.url + `cambiarpassword`, data);
  }
}
