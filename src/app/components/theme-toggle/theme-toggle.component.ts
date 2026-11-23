import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

/**
 * Animated Lottie-style Day/Night pill switch that morphs between
 * a sunlit sky with floating clouds and a starry night sky with a cratered moon.
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      role="switch"
      (click)="themeService.toggleTheme()"
      [attr.aria-checked]="themeService.isDark$ | async"
      [attr.aria-label]="(themeService.isDark$ | async) ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      [title]="(themeService.isDark$ | async) ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      class="nox-theme-switch"
      [class.is-dark]="themeService.isDark$ | async"
    >
      <!-- Sky Backgrounds (Day & Night crossfade) -->
      <span class="sky-track" aria-hidden="true">
        <span class="sky-day"></span>
        <span class="sky-night"></span>

        <!-- Concentric light halos that follow the sun/moon orb -->
        <span class="orb-halos">
          <span class="halo halo-1"></span>
          <span class="halo halo-2"></span>
          <span class="halo halo-3"></span>
        </span>

        <!-- Night Stars & Sparkles (left side of track) -->
        <span class="stars-group">
          <svg class="star star-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L14.8 9.2L23 12L14.8 14.8L12 23L9.2 14.8L1 12L9.2 9.2L12 1Z" />
          </svg>
          <svg class="star star-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
          </svg>
          <svg class="star star-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L13.8 10.2L21 12L13.8 13.8L12 21L10.2 13.8L3 12L10.2 10.2L12 3Z" />
          </svg>
          <span class="star-dot dot-1"></span>
          <span class="star-dot dot-2"></span>
        </span>

        <!-- Daytime Layered Clouds (right/bottom of track) -->
        <span class="clouds-group">
          <span class="cloud-back">
            <span class="cb c1"></span>
            <span class="cb c2"></span>
            <span class="cb c3"></span>
            <span class="cb c4"></span>
          </span>
          <span class="cloud-front">
            <span class="cf c1"></span>
            <span class="cf c2"></span>
            <span class="cf c3"></span>
            <span class="cf c4"></span>
          </span>
        </span>
      </span>

      <!-- Sliding & Morphing Sun / Moon Orb -->
      <span class="celestial-orb" aria-hidden="true">
        <span class="sun-surface"></span>
        <span class="moon-surface">
          <span class="crater crater-1"></span>
          <span class="crater crater-2"></span>
          <span class="crater crater-3"></span>
        </span>
      </span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
    }

    .nox-theme-switch {
      position: relative;
      width: 68px;
      height: 34px;
      padding: 0;
      border-radius: 9999px;
      border: 1.5px solid rgba(255, 255, 255, 0.45);
      background: transparent;
      cursor: pointer;
      outline: none;
      overflow: hidden;
      box-shadow:
        0 3px 10px -2px rgba(15, 23, 42, 0.18),
        inset 0 1px 1px rgba(255, 255, 255, 0.35);
      transition:
        transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 260ms ease,
        border-color 260ms ease;
      -webkit-tap-highlight-color: transparent;
    }

    .nox-theme-switch:hover {
      transform: scale(1.04);
      box-shadow:
        0 6px 14px -3px rgba(15, 23, 42, 0.24),
        inset 0 1px 1px rgba(255, 255, 255, 0.45);
    }

    .nox-theme-switch:active {
      transform: scale(0.95);
    }

    .nox-theme-switch:focus-visible {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
    }

    .nox-theme-switch.is-dark {
      border-color: rgba(148, 163, 184, 0.28);
      box-shadow:
        0 4px 12px -2px rgba(2, 6, 23, 0.65),
        inset 0 1px 1px rgba(255, 255, 255, 0.1);
    }

    /* Sky Track */
    .sky-track {
      position: absolute;
      inset: 0;
      border-radius: 9999px;
      overflow: hidden;
      pointer-events: none;
    }

    .sky-day,
    .sky-night {
      position: absolute;
      inset: 0;
      transition: opacity 340ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .sky-day {
      background: linear-gradient(135deg, #38bdf8 0%, #60a5fa 55%, #93c5fd 100%);
      opacity: 1;
      box-shadow: inset 0 2px 5px rgba(12, 74, 110, 0.22);
    }

    .sky-night {
      background: linear-gradient(135deg, #090d1e 0%, #131c38 55%, #1e2952 100%);
      opacity: 0;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6);
    }

    .nox-theme-switch.is-dark .sky-day {
      opacity: 0;
    }

    .nox-theme-switch.is-dark .sky-night {
      opacity: 1;
    }

    /* Concentric Halos following the orb */
    .orb-halos {
      position: absolute;
      top: 50%;
      left: 17px;
      width: 0;
      height: 0;
      transform: translate3d(0, -50%, 0);
      transition: transform 420ms cubic-bezier(0.34, 1.42, 0.64, 1);
    }

    .nox-theme-switch.is-dark .orb-halos {
      transform: translate3d(34px, -50%, 0);
    }

    .halo {
      position: absolute;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.11);
      transition: background-color 320ms ease;
    }

    .nox-theme-switch.is-dark .halo {
      background: rgba(255, 255, 255, 0.06);
    }

    .halo-1 { width: 38px; height: 38px; }
    .halo-2 { width: 52px; height: 52px; }
    .halo-3 { width: 66px; height: 66px; }

    /* Clouds Group (Day) */
    .clouds-group {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .cloud-back,
    .cloud-front {
      position: absolute;
      inset: 0;
      transition:
        transform 400ms cubic-bezier(0.34, 1.35, 0.64, 1),
        opacity 300ms ease;
    }

    .cloud-back {
      transition-delay: 25ms;
    }

    .nox-theme-switch.is-dark .cloud-front {
      transform: translate3d(10px, 20px, 0) scale(0.8);
      opacity: 0;
    }

    .nox-theme-switch.is-dark .cloud-back {
      transform: translate3d(14px, 18px, 0) scale(0.75);
      opacity: 0;
    }

    .cb,
    .cf {
      position: absolute;
      border-radius: 50%;
    }

    .cb {
      background: rgba(255, 255, 255, 0.45);
    }

    .cf {
      background: #ffffff;
      box-shadow: 0 -1px 3px rgba(255, 255, 255, 0.5);
    }

    /* Back cloud puffs */
    .cb.c1 { width: 16px; height: 16px; right: 2px; bottom: 5px; }
    .cb.c2 { width: 18px; height: 18px; right: 11px; bottom: 1px; }
    .cb.c3 { width: 15px; height: 15px; right: 22px; bottom: -2px; }
    .cb.c4 { width: 14px; height: 14px; right: 32px; bottom: -4px; }

    /* Front cloud puffs */
    .cf.c1 { width: 17px; height: 17px; right: -3px; bottom: -2px; }
    .cf.c2 { width: 19px; height: 19px; right: 7px; bottom: -5px; }
    .cf.c3 { width: 16px; height: 16px; right: 19px; bottom: -6px; }
    .cf.c4 { width: 15px; height: 15px; right: 29px; bottom: -8px; }

    /* Stars Group (Night) */
    .stars-group {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .star,
    .star-dot {
      position: absolute;
      color: #fef08a;
      opacity: 0;
      transform: translate3d(0, -12px, 0) scale(0.2);
      transition:
        transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 260ms ease;
    }

    .star-1 {
      width: 9px;
      height: 9px;
      top: 6px;
      left: 11px;
      transition-delay: 45ms;
      filter: drop-shadow(0 0 3px rgba(254, 240, 138, 0.8));
    }

    .star-2 {
      width: 6px;
      height: 6px;
      top: 18px;
      left: 22px;
      color: #ffffff;
      transition-delay: 95ms;
    }

    .star-3 {
      width: 5px;
      height: 5px;
      top: 7px;
      left: 26px;
      color: #fde047;
      transition-delay: 140ms;
    }

    .star-dot {
      border-radius: 50%;
      background: #ffffff;
    }

    .dot-1 {
      width: 2.5px;
      height: 2.5px;
      top: 19px;
      left: 10px;
      transition-delay: 75ms;
    }

    .dot-2 {
      width: 2px;
      height: 2px;
      top: 12px;
      left: 19px;
      transition-delay: 120ms;
    }

    .nox-theme-switch.is-dark .star,
    .nox-theme-switch.is-dark .star-dot {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }

    .nox-theme-switch.is-dark .star-1 {
      animation: starTwinkle 2.4s ease-in-out 0.45s infinite alternate;
    }

    .nox-theme-switch.is-dark .star-2 {
      animation: starTwinkle 1.9s ease-in-out 0.7s infinite alternate;
    }

    @keyframes starTwinkle {
      0% { opacity: 0.65; transform: scale(0.88); }
      100% { opacity: 1; transform: scale(1.12); }
    }

    /* Celestial Orb (Sun & Moon Thumb) */
    .celestial-orb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      transform: translate3d(0, 0, 0) rotate(0deg);
      transition: transform 430ms cubic-bezier(0.34, 1.44, 0.64, 1);
      z-index: 2;
      pointer-events: none;
    }

    .nox-theme-switch.is-dark .celestial-orb {
      transform: translate3d(34px, 0, 0) rotate(360deg);
    }

    .sun-surface,
    .moon-surface {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      transition:
        opacity 320ms cubic-bezier(0.22, 1, 0.36, 1),
        transform 380ms cubic-bezier(0.34, 1.45, 0.64, 1);
    }

    .sun-surface {
      background: radial-gradient(circle at 32% 32%, #fef9c3 0%, #facc15 45%, #f59e0b 100%);
      box-shadow:
        0 2px 7px rgba(217, 119, 6, 0.55),
        inset 0 -2px 3px rgba(180, 83, 9, 0.35),
        inset 0 1px 2px rgba(255, 255, 255, 0.8);
      opacity: 1;
      transform: scale(1);
    }

    .nox-theme-switch.is-dark .sun-surface {
      opacity: 0;
      transform: scale(0.75);
    }

    .moon-surface {
      background: radial-gradient(circle at 35% 30%, #f8fafc 0%, #e2e8f0 60%, #cbd5e1 100%);
      box-shadow:
        0 2px 8px rgba(2, 6, 23, 0.65),
        inset -2px -2px 4px rgba(100, 116, 139, 0.55),
        inset 1px 1px 2px rgba(255, 255, 255, 0.9);
      opacity: 0;
      transform: scale(0.75);
    }

    .nox-theme-switch.is-dark .moon-surface {
      opacity: 1;
      transform: scale(1);
    }

    /* Lunar Craters */
    .crater {
      position: absolute;
      border-radius: 50%;
      background: #cbd5e1;
      box-shadow:
        inset 0 1px 1.5px rgba(71, 85, 105, 0.45),
        0 0.5px 0 rgba(255, 255, 255, 0.7);
    }

    .crater-1 {
      width: 7px;
      height: 7px;
      top: 9px;
      left: 5px;
    }

    .crater-2 {
      width: 4.5px;
      height: 4.5px;
      top: 4px;
      left: 12px;
    }

    .crater-3 {
      width: 5px;
      height: 5px;
      top: 15px;
      left: 14px;
    }
  `]
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}
}
