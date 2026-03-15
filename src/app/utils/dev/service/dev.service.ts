import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {StMaple} from '../../st-maple';
import {environment} from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class DevService {
    private _http = inject(HttpClient);

    public echo(status: number, headerKey: string, headerValue: string): void {
        let headers = new HttpHeaders();
        if (headerKey && headerValue) {
            headers = headers.set(headerKey, headerValue);
        }
        const options = {
            params: new HttpParams().set('status', status),
            headers: headers
        };
        this._http.get(StMaple.joinUrl(environment.API_BASE_URL_USER, 'echo'), options).subscribe();
    }
}
