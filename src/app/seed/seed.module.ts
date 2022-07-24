import {CommonModule} from '@angular/common';
import {FenceModule} from '../fence/fence.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
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
            FlexLayoutModule,
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
