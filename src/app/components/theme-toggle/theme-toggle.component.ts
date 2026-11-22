import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';
import { ThemeService } from '../../services/theme.service';

/**
 * Reusable button that toggles between light and dark themes.
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      type="button"
      (click)="themeService.toggleTheme()"
      [attr.aria-label]="(themeService.isDark$ | async) ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      [title]="(themeService.isDark$ | async) ? 'Modo claro' : 'Modo oscuro'"
      class="p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-gray-500 dark:text-slate-300 hover:text-navy-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
    >
      <lucide-icon
        *ngIf="themeService.isDark$ | async; else moonIcon"
        [img]="Sun"
        class="w-4 h-4 text-amber-400"
      ></lucide-icon>
      <ng-template #moonIcon>
        <lucide-icon [img]="Moon" class="w-4 h-4"></lucide-icon>
      </ng-template>
    </button>
  `
})
export class ThemeToggleComponent {
  readonly Sun = Sun;
  readonly Moon = Moon;

  constructor(public themeService: ThemeService) {}
}
