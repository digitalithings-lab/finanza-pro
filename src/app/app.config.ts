import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { 
  LucideAngularModule, 
  ArrowLeft, 
  Upload, 
  File, 
  Calculator, 
  ChartBar, 
  Plus, 
  Download, 
  Trash2, 
  CircleCheck, 
  Clock,
  Search,
  Filter,
  Ellipsis,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  ChartPie,
  DollarSign,
  TrendingUp,
  CircleAlert,
  LogIn,
  Lock,
  User,
  Eye
} from 'lucide-angular';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(LucideAngularModule.pick({
      ArrowLeft, Upload, File, Calculator, ChartBar, Plus, Download, Trash2, CircleCheck, Clock,
      Search, Filter, Ellipsis, ChevronRight, LayoutDashboard, Users, FileText, LogOut, Menu, X, 
      ChartPie, DollarSign, TrendingUp, CircleAlert, LogIn, Lock, User, Eye
    }))
  ]
};
