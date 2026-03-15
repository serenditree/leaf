import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {NgModule} from '@angular/core';
import {SettingsComponent} from './settings/settings.component';
import {StPipesModule} from '../utils/pipes/st-pipes.module';
import {UserComponent} from './user/user.component';
import {MatCheckbox} from '@angular/material/checkbox';

@NgModule(
    {
        imports: [
            CommonModule,
            FormsModule,
            MatButtonModule,
            MatInputModule,
            ReactiveFormsModule,
            StPipesModule,
            MatSelectModule,
            MatCheckbox
        ],
        declarations: [
            SettingsComponent,
            UserComponent
        ],
        exports: [
            SettingsComponent,
            UserComponent
        ]
    }
)
export class UserModule {
}
