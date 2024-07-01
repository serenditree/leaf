import {CommonModule} from '@angular/common';
import {IndicatorModule} from '../ui/indicator/indicator.module';
import {MapComponent} from './map/map.component';
import {MapService} from './service/map.service';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {NgModule} from '@angular/core';
import {SearchModule} from '../search/search.module';

@NgModule(
    {
        imports: [
            CommonModule,
            IndicatorModule,
            SearchModule,
            MatTooltipModule
        ],
        declarations: [
            MapComponent
        ],
        exports: [
            MapComponent
        ],
        providers: [
            MapService
        ]
    }
)
export class MapModule {
}
