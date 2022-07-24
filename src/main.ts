import {AppModule} from './app/app.module';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

if (environment.production) {
    enableProdMode();
}

void platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(() => console.log(`Serenditree started using ${environment.id}-environment.`));
