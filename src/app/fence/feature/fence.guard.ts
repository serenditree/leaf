import {
    ActivatedRouteSnapshot,
    CanActivateChildFn,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import {FenceService} from '../service/fence.service';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
                providedIn: 'root'
            })
class FenceGuardService {
    private _router = inject(Router);
    private _fenceService = inject(FenceService);

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


