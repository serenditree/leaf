import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MenuMainComponent} from '../menu/menu-main/menu-main.component';
import {NavContainerComponent} from './nav-container/nav-container.component';
import {NavItemComponent} from './nav-item/nav-item.component';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule(
    {
        imports: [
            CommonModule,
            FlexLayoutModule,
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
