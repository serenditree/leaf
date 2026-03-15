import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {NgModule} from '@angular/core';
import {SettingsComponent} from './settings/settings.component';
import {UserComponent} from './user/user.component';
import {MatCheckbox} from '@angular/material/checkbox';
import {StGreetingPipe} from '../utils/pipes/st-greeting.pipe';

@NgModule(
    {
        imports: [
            CommonModule,
            FormsModule,
            MatButtonModule,
            MatInputModule,
            ReactiveFormsModule,
            MatSelectModule,
            MatCheckbox,
            StGreetingPipe
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
