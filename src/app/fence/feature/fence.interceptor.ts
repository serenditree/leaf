import {HTTP_STATUS} from '../../utils/st-const';
import {FenceService} from '../service/fence.service';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class FenceInterceptor implements HttpInterceptor {
    private _fenceService = inject(FenceService);

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
