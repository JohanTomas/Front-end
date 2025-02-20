import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Importa la función para registrar HttpClient
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideHttpClient(), // Registra HttpClient como proveedor global
    ...(appConfig.providers || []) // Mantén los proveedores existentes
  ]
}).catch((err) => console.error(err));
