import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Poll} from '../model/poll';
import {StMaple} from '../../utils/st-maple';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class PollService {
    private readonly BASE_URL_POLL = environment.API_BASE_URL_POLL;

    private readonly _http = inject(HttpClient);
    private readonly _pollsSubject = new Subject<Poll[]>();

    get pollsObservable(): Observable<Poll[]> {
        return this._pollsSubject.asObservable();
    }

    public retrieveBySeed(seedId: string): void {
        this._http
            .get<Poll[]>(StMaple.joinUrl(this.BASE_URL_POLL, 'seed', seedId))
            .subscribe({
                next: (response) => {
                    this._pollsSubject.next(response);
                },
                error: (error) => {
                    console.error(`could not retrieve polls of seed ${seedId}`, error);
                }
            });
    }

    public vote(pollId: string, optionId: number): Observable<boolean> {

        return new Observable((observer) => {
            this._http
                .get<void>(StMaple.joinUrl(this.BASE_URL_POLL, 'vote', pollId, optionId), {observe: 'response'})
                .subscribe({
                    next: () => {
                        observer.next(true);
                        observer.complete();
                    },
                    error: (error) => {
                        console.error(`could not vote for option ${optionId} on poll ${pollId}`, error);
                        observer.error(error);
                    }
                });
        });
    }

}
