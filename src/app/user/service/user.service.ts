import {FenceService} from '../../fence/service/fence.service';
import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {MessageService} from '../../ui/message/service/message.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {StMaple} from '../../utils/st-maple';
import {User} from '../model/user';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {
    private readonly _http = inject(HttpClient);
    private readonly _fenceService = inject(FenceService);
    private readonly _router = inject(Router);
    private readonly _messageService = inject(MessageService);

    private readonly BASE_URL_USER = environment.API_BASE_URL_USER;

    public retrieveByUsername(username: string): Observable<User> {

        return new Observable((observer) => {
            this._http
                .get<User>(StMaple.joinUrl(this.BASE_URL_USER, username))
                .subscribe({
                    next: (response) => {
                        observer.next(response);
                        observer.complete();
                    },
                    error: (error) => {
                        console.error(error);
                        observer.next(null as unknown as User);
                        observer.complete();
                    }
                });
        });
    }

    public retrieveBySubstring(substring: string): Observable<User[]> {

        return new Observable((observer) => {
            this._http
                .get<User[]>(StMaple.joinUrl(this.BASE_URL_USER, 'retrieve', substring))
                .subscribe({
                    next: (response) => {
                        observer.next(response);
                        observer.complete();
                    },
                    error: (error) => {
                        console.error(error);
                        observer.error(error);
                    }
                });
        });
    }

    public delete(includeContributions: boolean): void {

        const id = this._fenceService.getUserId();

        this._http
            .delete<void>(
                StMaple.joinUrl(this.BASE_URL_USER, id!, String(includeContributions)),
                {observe: 'response'}
            )
            .subscribe({
                next: () => {
                    console.log(`Successfully deleted user ${id}`);
                    this._fenceService.signOut();
                    this._router.navigate(['']).then(
                        () => this._messageService.info('Successfully deleted')
                    );

                },
                error: (error) => {
                    console.error(`Could not delete user ${id}`, error);
                }
            });
    }
}
