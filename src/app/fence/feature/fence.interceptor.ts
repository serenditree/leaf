import {HTTP_STATUS} from '../../utils/st-const';
import {FenceService} from '../service/fence.service';
import {HttpErrorResponse} from '@angular/common/http';
import {HttpEvent} from '@angular/common/http';
import {HttpHandler} from '@angular/common/http';
import {HttpInterceptor} from '@angular/common/http';
import {HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class FenceInterceptor implements HttpInterceptor {

    constructor(private _fenceService: FenceService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem(FenceService.TOKEN_KEY);
        let authReq;

        if (token !== null) {
            authReq = req.clone({setHeaders: {Authorization: token}});
        } else {
            authReq = req;
        }

        return next
            .handle(authReq)
            .pipe(
                catchError((httpErrorResponse: HttpErrorResponse) => {
                    if (httpErrorResponse &&
                        httpErrorResponse.status === HTTP_STATUS.UNAUTHORIZED &&
                        httpErrorResponse.headers.has(FenceService.AUTHENTICATE_KEY)) {
                        this._fenceService.signOut(true);
                    }
                    return throwError(httpErrorResponse);
                })
            );
    }
}
