import {CommonModule} from '@angular/common';
import {DevModule} from '../utils/dev/dev.module';
import {FenceModule} from '../fence/fence.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MenuModule} from '../ui/menu/menu.module';
import {NavModule} from '../ui/nav/nav.module';
import {NgModule} from '@angular/core';
import {PollModule} from '../poll/poll.module';
import {RouterModule} from '@angular/router';
import {SeedComponent} from './seed/seed.component';
import {SeedListComponent} from './seed-list/seed-list/seed-list.component';
import {SeedListItemComponent} from './seed-list/seed-list-item/seed-list-item.component';
import {SeedNewBaseComponent} from './seed-new-base/seed-new-base.component';
import {SeedNewComponent} from './seed-new/seed-new.component';
import {SeedService} from './service/seed.service';
import {SeedTrailComponent} from './seed-trail/seed-trail.component';
import {ToggleModule} from '../ui/toggle/toggle.module';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {StEllipsisPipe} from '../utils/pipes/st-ellipsis.pipe';
import {StHighlightPipe} from '../utils/pipes/st-highlight.pipe';
import {StTagsPipe} from '../utils/pipes/st-tags.pipe';

@NgModule(
    {
        declarations: [
            SeedComponent,
            SeedListComponent,
            SeedListItemComponent,
            SeedNewBaseComponent,
            SeedNewComponent,
            SeedTrailComponent
        ],
        exports: [
            SeedComponent,
            SeedListComponent,
            SeedListItemComponent,
            SeedNewBaseComponent,
            SeedNewComponent,
            SeedTrailComponent
        ],
        imports: [
            CommonModule,
            DevModule,
            FenceModule,
            FormsModule,
            MatAutocompleteModule,
            MatButtonModule,
            MatIconModule,
            MatInputModule,
            MatSlideToggleModule,
            MatSnackBarModule,
            MatTooltipModule,
            MenuModule,
            NavModule,
            PollModule,
            ReactiveFormsModule,
            RouterModule,
            StEllipsisPipe,
            StHighlightPipe,
            StTagsPipe,
            ToggleModule
        ],
        providers: [
            SeedService,
            provideHttpClient(withInterceptorsFromDi())
        ]
    }
)
export class SeedModule {
}
