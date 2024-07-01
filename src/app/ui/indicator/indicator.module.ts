import {CommonModule} from '@angular/common';
import {IndicatorComponent} from './indicator/indicator.component';
import {IndicatorService} from './service/indicator.service';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {NgModule} from '@angular/core';

@NgModule(
    {
        imports: [
            CommonModule,
            MatTooltipModule
        ],
        declarations: [IndicatorComponent],
        exports: [IndicatorComponent],
        providers: [IndicatorService]
    }
)
export class IndicatorModule {
}
