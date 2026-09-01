import {CommonModule} from '@angular/common';
import {JsonComponent} from './json/json.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltip} from '@angular/material/tooltip';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ToolsComponent} from './tools/tools.component';
import {StEllipsisLinePipe} from '../pipes/st-ellipsis-line.pipe';
import {StRegexReplacePipe} from '../pipes/st-regex-replace.pipe';

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
            MatIcon,
            MatTooltip,
            StEllipsisLinePipe,
            StRegexReplacePipe
        ],
        exports: [
            ToolsComponent,
            JsonComponent
        ]
    }
)
export class DevModule {
}
