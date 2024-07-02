import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SettingsComponent} from './settings/settings.component';
import {StPipesModule} from '../utils/pipes/st-pipes.module';
import {UserComponent} from './user/user.component';

@NgModule(
    {
        imports: [
            CommonModule,
            FormsModule,
            MatButtonModule,
            MatInputModule,
            ReactiveFormsModule,
            StPipesModule,
            MatSelectModule
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
