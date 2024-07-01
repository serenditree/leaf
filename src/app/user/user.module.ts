import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
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
