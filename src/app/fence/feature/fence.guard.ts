import {ActivatedRouteSnapshot} from '@angular/router';
import {CanActivateChildFn} from '@angular/router';
import {CanActivateFn} from '@angular/router';
import {FenceService} from '../service/fence.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RouterStateSnapshot} from '@angular/router';
import {Router} from '@angular/router';
import {UrlTree} from '@angular/router';
import {inject} from '@angular/core';

@Injectable({
                providedIn: 'root'
            })
class FenceGuardService {

    constructor(private _router: Router,
                private _fenceService: FenceService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this._isAuthenticated(state);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot) {
        return this._isAuthenticated(state);
    }

    private _isAuthenticated(state: RouterStateSnapshot) {
        let isAuthenticated = false;

        if (this._fenceService.isAuthenticated()) {
            isAuthenticated = true;
        } else {
            void this._router.navigate(['sign-in'], {queryParams: {redirect: state.url}});
        }

        return isAuthenticated;
    }
}

export const FenceGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    return inject(FenceGuardService).canActivate(route, state);
};

export const FenceGuardChild: CanActivateChildFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    return inject(FenceGuardService).canActivateChild(route, state);
};


