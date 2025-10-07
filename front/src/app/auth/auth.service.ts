import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { environment } from "environments/environment";
import { catchError, Observable, tap, throwError } from "rxjs";

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  firstname: string;
  username: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly http = inject(HttpClient);
  // public readonly isAuthenticated = signal(false);
  private readonly apiUrl = environment.apiUrl + "/auth";

  private readonly _token = signal<string | null>(this.getStoredToken());
  private readonly _currentUser = signal<User | null>(this.getStoredUser());

  public readonly token = this._token.asReadonly();
  public readonly currentUser = this._currentUser.asReadonly();

  public readonly isAuthenticated = computed(() => !!this._token());

  public readonly isAdmin = computed(
    () => this._currentUser()?.email === "admin@admin.com"
  );

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/token`, credentials).pipe(
      catchError((error) => {
        console.error("Erreur de connexion:", error);
        return throwError(() => error);
      }),

      tap((response) => {
        if (response.token) {
          localStorage.setItem("token", response.token);
          this._token.set(response.token);

          if (response.user) {
            localStorage.setItem("user", JSON.stringify(response.user));
            this._currentUser.set(response.user);
          }
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this._token.set(null);
    this._currentUser.set(null);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem("token");
  }

  private getStoredUser(): any | null {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  }
}
