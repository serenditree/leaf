import {AppModule} from './app/app.module';
import {enableProdMode, provideZoneChangeDetection} from '@angular/core';
import {environment} from './environments/environment';
import {platformBrowser} from '@angular/platform-browser';

if (environment.production) {
    enableProdMode();
}

void platformBrowser()
    .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
    .then(() => console.log(`Serenditree started using ${environment.id}-environment.`))
    .catch((error) => console.error('Application bootstrap failed:', error));
