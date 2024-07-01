import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AboutModule} from './about/about.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {ConfirmModule} from './ui/confirm/confirm.module';
import {DevModule} from './utils/dev/dev.module';
import {FenceInterceptor} from './fence/feature/fence.interceptor';
import {FenceModule} from './fence/fence.module';
import {GardenModule} from './garden/garden.module';
import {IndicatorModule} from './ui/indicator/indicator.module';
import {LayoutModule} from './ui/layout/layout.module';
import {ListModule} from './ui/list/list.module';
import {MapModule} from './map/map.module';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MenuModule} from './ui/menu/menu.module';
import {MessageModule} from './ui/message/message.module';
import {NavModule} from './ui/nav/nav.module';
import {NgModule} from '@angular/core';
import {PollModule} from './poll/poll.module';
import {SearchModule} from './search/search.module';
import {SeedModule} from './seed/seed.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {ToggleModule} from './ui/toggle/toggle.module';
import {UserModule} from './user/user.module';
import {WorkerModule} from './worker/worker.module';
import {environment} from '../environments/environment';

@NgModule(
    {
        declarations: [
            AppComponent
        ],
        imports: [
            AboutModule,
            AppRoutingModule,
            BrowserAnimationsModule,
            BrowserModule,
            ConfirmModule,
            DevModule,
            FenceModule,
            GardenModule,
            IndicatorModule,
            LayoutModule,
            ListModule,
            MapModule,
            MatButtonModule,
            MatIconModule,
            MenuModule,
            MessageModule,
            NavModule,
            PollModule,
            SearchModule,
            SeedModule,
            ToggleModule,
            UserModule,
            WorkerModule,
            ServiceWorkerModule.register(
                'ngsw-worker.js',
                {
                    enabled: environment.production
                }
            )
        ],
        providers: [
            {
                provide: HTTP_INTERCEPTORS,
                useClass: FenceInterceptor,
                multi: true
            }
        ],
        bootstrap: [
            AppComponent
        ]
    }
)
export class AppModule {
}
