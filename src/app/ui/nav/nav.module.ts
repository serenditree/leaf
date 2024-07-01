import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MenuMainComponent} from '../menu/menu-main/menu-main.component';
import {NavContainerComponent} from './nav-container/nav-container.component';
import {NavItemComponent} from './nav-item/nav-item.component';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule(
    {
        imports: [
            CommonModule,
            MatIconModule,
            MatListModule,
            MatTooltipModule,
            RouterModule,
            MatButtonModule
        ],
        declarations: [
            NavContainerComponent,
            NavItemComponent,
            MenuMainComponent
        ],
        exports: [
            NavContainerComponent,
            NavItemComponent,
            MenuMainComponent
        ]
    }
)
export class NavModule {
}
