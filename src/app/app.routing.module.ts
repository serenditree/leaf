import {AboutComponent} from './about/about/about.component';
import {FenceGuard} from './fence/feature/fence.guard';
import {GardenComponent} from './garden/garden/garden.component';
import {GardenListComponent} from './garden/garden-list/garden-list/garden-list.component';
import {GardenNewComponent} from './garden/garden-new/garden-new.component';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import {SeedComponent} from './seed/seed/seed.component';
import {SeedListComponent} from './seed/seed-list/seed-list/seed-list.component';
import {SeedNewComponent} from './seed/seed-new/seed-new.component';
import {SeedTrailComponent} from './seed/seed-trail/seed-trail.component';
import {SettingsComponent} from './user/settings/settings.component';
import {SignInComponent} from './fence/sign-in/sign-in.component';
import {SignUpComponent} from './fence/sign-up/sign-up.component';
import {UserComponent} from './user/user/user.component';

const routes: Routes = [
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  HOME
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/seeds'
    },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ABOUT
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        path: 'about',
        component: AboutComponent,
        data: {
            nomap: true
        }
    },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SEED
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        path: 'seeds',
        children: [
            {
                path: '',
                component: SeedListComponent,
                data: {
                    submenu: true
                }
            },
            {
                path: ':id',
                component: SeedComponent
            }
        ]
    },
    {
        path: 'seed',
        component: SeedNewComponent,
        canActivate: [FenceGuard]
    },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GARDEN
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        path: 'gardens',
        children: [
            {
                path: '',
                component: GardenListComponent,
                data: {
                    submenu: true
                }
            },
            {
                path: ':id',
                component: GardenComponent
            }
        ]
    },
    {
        path: 'cultivate',
        component: GardenNewComponent,
        canActivate: [FenceGuard]
    },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TRAIL
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        path: 'trail/:id',
        component: SeedTrailComponent,
        data: {
            submenu: true,
            decentralized: true
        }
    },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// USER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        path: 'user',
        pathMatch: 'full',
        redirectTo: '/user/garden'
    },
    {
        path: 'user',
        canActivateChild: [FenceGuard],
        children: [
            {
                path: 'garden',
                component: UserComponent,
                data: {
                    submenu: true
                }
            },
            {
                path: 'settings',
                component: SettingsComponent,
                data: {
                    submenu: true
                }
            }
        ]

    },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FENCE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    {
        path: 'sign-up',
        component: SignUpComponent,
        data: {
            nomap: true
        }
    },
    {
        path: 'sign-in',
        component: SignInComponent,
        data: {
            nomap: true
        }
    }
];

@NgModule(
    {
        imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
        exports: [RouterModule]
    }
)
export class AppRoutingModule {
}
