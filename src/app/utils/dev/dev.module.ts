import {CommonModule} from '@angular/common';
import {DevComponent} from './dev/dev.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
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
