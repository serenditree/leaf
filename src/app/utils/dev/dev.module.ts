import {CommonModule} from '@angular/common';
import {JsonComponent} from './json/json.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltip} from '@angular/material/tooltip';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {StPipesModule} from '../pipes/st-pipes.module';
import {ToolsComponent} from './tools/tools.component';

@NgModule(
    {
        declarations: [
            ToolsComponent,
            JsonComponent
        ],
        imports: [
            CommonModule,
            MatInputModule,
            MatSelectModule,
            ReactiveFormsModule,
            MatButtonModule,
            StPipesModule,
            MatIcon,
            MatTooltip
        ],
        exports: [
            ToolsComponent,
            JsonComponent
        ]
    }
)
export class DevModule {
}
