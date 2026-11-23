import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const THEME_STORAGE_KEY = 'nox-theme';

/**
 * Manages the application's light/dark theme state, DOM root class,
 * and persistence in localStorage with OS preference fallback.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly darkModeSubject = new BehaviorSubject<boolean>(false);
  readonly isDark$ = this.darkModeSubject.asObservable();
  private transitionTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.initTheme();
  }

  get isDark(): boolean {
    return this.darkModeSubject.value;
  }

  toggleTheme(): void {
    this.setDark(!this.darkModeSubject.value, true);
  }

  setDark(dark: boolean, animate = true): void {
    this.darkModeSubject.next(dark);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (animate) {
        if (this.transitionTimer) {
          clearTimeout(this.transitionTimer);
        }
        root.classList.add('theme-transitioning');
        this.transitionTimer = setTimeout(() => {
          root.classList.remove('theme-transitioning');
          this.transitionTimer = null;
        }, 320);
      }
      root.classList.toggle('dark', dark);
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // Ignore storage access errors in restricted browsing contexts.
    }
  }

  private initTheme(): void {
    let dark = false;
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        dark = saved === 'dark';
      } else if (typeof window !== 'undefined' && window.matchMedia) {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch {
      if (typeof document !== 'undefined') {
        dark = document.documentElement.classList.contains('dark');
      }
    }

    this.darkModeSubject.next(dark);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', dark);
    }
  }
}
