import {CommonModule} from '@angular/common';
import {FenceModule} from '../fence/fence.module';
import {FormsModule} from '@angular/forms';
import {GardenComponent} from './garden/garden.component';
import {GardenListComponent} from './garden-list/garden-list/garden-list.component';
import {GardenListItemComponent} from './garden-list/garden-list-item/garden-list-item.component';
import {GardenNewComponent} from './garden-new/garden-new.component';
import {GardenService} from './service/garden.service';
import {GardenTagComponent} from './garden-tag/garden-tag/garden-tag.component';
import {GardenTagPrintComponent} from './garden-tag/garden-tag-print/garden-tag-print.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MenuModule} from '../ui/menu/menu.module';
import {NavModule} from '../ui/nav/nav.module';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SeedModule} from '../seed/seed.module';
import {StPipesModule} from '../utils/pipes/st-pipes.module';

@NgModule(
    {
        imports: [
            CommonModule,
            FenceModule,
            FormsModule,
            MatButtonModule,
            MatDialogModule,
            MatIconModule,
            MatInputModule,
            MatSlideToggleModule,
            MatTooltipModule,
            MenuModule,
            NavModule,
            ReactiveFormsModule,
            RouterModule,
            SeedModule,
            StPipesModule
        ],
        declarations: [
            GardenComponent,
            GardenListComponent,
            GardenListItemComponent,
            GardenNewComponent,
            GardenTagComponent,
            GardenTagPrintComponent
        ],
        exports: [
            GardenComponent,
            GardenListComponent,
            GardenListItemComponent,
            GardenNewComponent,
            GardenTagComponent,
            GardenTagPrintComponent
        ],
        providers: [GardenService]
    }
)
export class GardenModule {
}
