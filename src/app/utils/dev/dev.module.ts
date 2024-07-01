import {CommonModule} from '@angular/common';
import {DevComponent} from './dev/dev.component';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {StPipesModule} from '../pipes/st-pipes.module';

@NgModule(
    {
        declarations: [
            DevComponent
        ],
        imports: [
            CommonModule,
            MatInputModule,
            MatSelectModule,
            ReactiveFormsModule,
            MatButtonModule,
            StPipesModule
        ],
        exports: [
            DevComponent
        ]
    }
)
export class DevModule {
}
