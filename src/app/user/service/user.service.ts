import {FenceService} from '../../fence/service/fence.service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MessageService} from '../../ui/message/service/message.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {StMaple} from '../../utils/st-maple';
import {User} from '../model/user';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {

    private readonly BASE_URL_USER = environment.API_BASE_URL_USER;

    constructor(private _http: HttpClient,
                private _fenceService: FenceService,
                private _router: Router,
                private _messageService: MessageService) {
    }

    public retrieveByUsername(username: string): Observable<User> {

        return new Observable((observer) => {
            this._http
                .get<User>(StMaple.joinUrl(this.BASE_URL_USER, username))
                .subscribe(
                    (response) => {
                        observer.next(response);
                        observer.complete();
                    },
                    (error) => {
                        console.error(error);
                        observer.next(null);
                        observer.complete();
                    }
                );
        });
    }

    public retrieveBySubstring(substring: string): Observable<User[]> {

        return new Observable((observer) => {
            this._http
                .get<User[]>(StMaple.joinUrl(this.BASE_URL_USER, 'retrieve', substring))
                .subscribe(
                    (response) => {
                        observer.next(response);
                        observer.complete();
                    },
                    (error) => {
                        console.error(error);
                        observer.error(error);
                    }
                );
        });
    }

    public delete(): void {

        const id = this._fenceService.getUserId();

        this._http
            .delete<void>(StMaple.joinUrl(this.BASE_URL_USER, 'delete', id), {observe: 'response'})
            .subscribe(
                () => {
                    console.log(`Successfully deleted user ${id}`);
                    this._fenceService.signOut();
                    void this._router.navigate(['']).then(
                        () => this._messageService.info('Successfully deleted')
                    );

                },
                (error) => {
                    console.error(`Could not delete user ${id}`, error);
                }
            );
    }
}
