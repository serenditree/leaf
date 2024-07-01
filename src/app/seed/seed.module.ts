import {CommonModule} from '@angular/common';
import {FenceModule} from '../fence/fence.module';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MenuModule} from '../ui/menu/menu.module';
import {NavModule} from '../ui/nav/nav.module';
import {NgModule} from '@angular/core';
import {PollModule} from '../poll/poll.module';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SeedComponent} from './seed/seed.component';
import {SeedListComponent} from './seed-list/seed-list/seed-list.component';
import {SeedListItemComponent} from './seed-list/seed-list-item/seed-list-item.component';
import {SeedNewBaseComponent} from './seed-new-base/seed-new-base.component';
import {SeedNewComponent} from './seed-new/seed-new.component';
import {SeedService} from './service/seed.service';
import {SeedTrailComponent} from './seed-trail/seed-trail.component';
import {StPipesModule} from '../utils/pipes/st-pipes.module';
import {ToggleModule} from '../ui/toggle/toggle.module';

@NgModule(
    {
        imports: [
            CommonModule,
            FenceModule,
            FormsModule,
            HttpClientModule,
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
            StPipesModule,
            ToggleModule
        ],
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
        providers: [
            SeedService
        ]
    }
)
export class SeedModule {
}
