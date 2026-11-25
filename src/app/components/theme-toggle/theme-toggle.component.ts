import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

/**
 * Animated theme switch tailored to the NOX design system
 * (slate/alabaster surfaces, executive navy-800, steel darkbtn, and brand-teal accents)
 * with spring-driven thumb motion and SVG sun-to-moon morphing.
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
      <!-- Track with passive slot glyphs & subtle ambient stars -->
      <span class="switch-track" aria-hidden="true">
        <!-- Left slot passive glyph (visible when thumb is on the right in dark mode) -->
        <span class="track-slot slot-left">
          <svg class="passive-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"></path>
          </svg>
        </span>

        <!-- Right slot passive glyph (visible when thumb is on the left in light mode) -->
        <span class="track-slot slot-right">
          <svg class="passive-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </span>
      </span>

      <!-- Active Sliding Thumb with Morphing Sun <-> Moon -->
      <span class="switch-thumb" aria-hidden="true">
        <!-- Active Sun (Light mode) -->
        <svg class="thumb-icon icon-sun" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <g class="sun-rays" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="12" y1="2.5" x2="12" y2="4.5" />
            <line x1="12" y1="19.5" x2="12" y2="21.5" />
            <line x1="2.5" y1="12" x2="4.5" y2="12" />
            <line x1="19.5" y1="12" x2="21.5" y2="12" />
            <line x1="5.3" y1="5.3" x2="6.7" y2="6.7" />
            <line x1="17.3" y1="17.3" x2="18.7" y2="18.7" />
            <line x1="18.7" y1="5.3" x2="17.3" y2="6.7" />
            <line x1="6.7" y1="17.3" x2="5.3" y2="18.7" />
          </g>
        </svg>

        <!-- Active Crescent Moon + Brand Accent Sparkle (Dark mode) -->
        <svg class="thumb-icon icon-moon" viewBox="0 0 24 24" fill="none">
          <path
            d="M20.2 13.4A8.2 8.2 0 1 1 10.6 3.8a6.5 6.5 0 0 0 9.6 9.6Z"
            fill="currentColor"
          />
          <path
            class="moon-sparkle"
            d="M17.5 4.5L18.2 6.3L20 7L18.2 7.7L17.5 9.5L16.8 7.7L15 7L16.8 6.3L17.5 4.5Z"
            fill="#69b3a9"
          />
        </svg>
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
      height: 36px;
      padding: 0;
      border-radius: 12px;
      border: 1.5px solid #cbd5e1;
      background: #f1f5f9;
      cursor: pointer;
      outline: none;
      overflow: hidden;
      box-shadow:
        0 1px 3px rgba(15, 23, 42, 0.05),
        inset 0 1px 2px rgba(15, 23, 42, 0.04);
      transition:
        background-color 260ms cubic-bezier(0.22, 1, 0.36, 1),
        border-color 260ms cubic-bezier(0.22, 1, 0.36, 1),
        transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 220ms ease;
      -webkit-tap-highlight-color: transparent;
    }

    .nox-theme-switch:hover {
      border-color: #94a3b8;
      background: #e2e8f0;
      transform: scale(1.03);
    }

    .nox-theme-switch:active {
      transform: scale(0.96);
    }

    .nox-theme-switch:focus-visible {
      box-shadow: 0 0 0 3px rgba(79, 157, 147, 0.35);
    }

    .nox-theme-switch.is-dark {
      background: #0f172a;
      border-color: #334155;
      box-shadow:
        0 2px 6px rgba(2, 6, 23, 0.45),
        inset 0 1px 2px rgba(2, 6, 23, 0.6);
    }

    .nox-theme-switch.is-dark:hover {
      border-color: #5b82ab;
      background: #131c31;
    }

    /* Track & Passive Slot Icons */
    .switch-track {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      pointer-events: none;
    }

    .track-slot {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        opacity 240ms ease,
        transform 320ms cubic-bezier(0.34, 1.45, 0.64, 1);
    }

    .slot-left {
      color: #64748b;
      opacity: 0;
      transform: scale(0.6) rotate(-45deg);
    }

    .slot-right {
      color: #94a3b8;
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    .nox-theme-switch.is-dark .slot-left {
      opacity: 0.75;
      transform: scale(1) rotate(0deg);
    }

    .nox-theme-switch.is-dark .slot-right {
      opacity: 0;
      transform: scale(0.6) rotate(45deg);
    }

    .passive-sun,
    .passive-moon {
      width: 14px;
      height: 14px;
    }

    /* Active Sliding Thumb */
    .switch-thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 27px;
      height: 27px;
      border-radius: 9px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow:
        0 2px 6px rgba(43, 60, 77, 0.16),
        0 1px 2px rgba(15, 23, 42, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate3d(0, 0, 0);
      transition:
        transform 400ms cubic-bezier(0.34, 1.46, 0.64, 1),
        background-color 280ms ease,
        border-color 280ms ease,
        box-shadow 280ms ease;
      pointer-events: none;
      z-index: 2;
    }

    .nox-theme-switch.is-dark .switch-thumb {
      transform: translate3d(32px, 0, 0);
      background: linear-gradient(135deg, #3b5b7c 0%, #2b3c4d 100%);
      border-color: #5b82ab;
      box-shadow:
        0 3px 8px rgba(2, 6, 23, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    /* Morphing Icons inside Thumb */
    .thumb-icon {
      position: absolute;
      width: 16px;
      height: 16px;
      transition:
        transform 420ms cubic-bezier(0.34, 1.5, 0.64, 1),
        opacity 240ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .icon-sun {
      color: #2b3c4d;
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .sun-rays {
      transform-origin: center;
      transition: transform 420ms cubic-bezier(0.34, 1.5, 0.64, 1);
    }

    .nox-theme-switch:hover .icon-sun {
      color: #4f9d93;
    }

    .nox-theme-switch.is-dark .icon-sun {
      opacity: 0;
      transform: rotate(135deg) scale(0.35);
    }

    .nox-theme-switch.is-dark .sun-rays {
      transform: scale(0.5);
    }

    .icon-moon {
      color: #f8fafc;
      opacity: 0;
      transform: rotate(-120deg) scale(0.35);
    }

    .nox-theme-switch.is-dark .icon-moon {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .moon-sparkle {
      transform-origin: 17.5px 7px;
      transition: transform 480ms cubic-bezier(0.34, 1.6, 0.64, 1) 80ms;
      transform: scale(0);
    }

    .nox-theme-switch.is-dark .moon-sparkle {
      transform: scale(1);
    }
  `]
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}
}
