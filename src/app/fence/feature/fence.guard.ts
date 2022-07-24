import {ActivatedRouteSnapshot} from '@angular/router';
import {CanActivateChild} from '@angular/router';
import {CanActivate} from '@angular/router';
import {FenceService} from '../service/fence.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RouterStateSnapshot} from '@angular/router';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class FenceGuard implements CanActivate, CanActivateChild {

    constructor(private _router: Router,
                private _fenceService: FenceService) {
    }

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this._isAuthenticated(state);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this._isAuthenticated(state);
    }

    private _isAuthenticated(state: RouterStateSnapshot): boolean {
        let isAuthenticated = false;

        if (this._fenceService.isAuthenticated()) {
            isAuthenticated = true;
        } else {
            void this._router.navigate(['sign-in'], {queryParams: {redirect: state.url}});
        }

        return isAuthenticated;
    }
}
