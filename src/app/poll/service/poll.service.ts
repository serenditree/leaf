import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Poll} from '../model/poll';
import {StMaple} from '../../utils/st-maple';
import {Subject} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class PollService {

    private readonly BASE_URL_POLL = environment.API_BASE_URL_POLL;

    private _pollsSubject = new Subject<Poll[]>();

    constructor(private _http: HttpClient) {
    }

    get pollsObservable(): Observable<Poll[]> {
        return this._pollsSubject.asObservable();
    }

    public retrieveBySeed(seedId: string): void {
        this._http
            .get<Poll[]>(StMaple.joinUrl(this.BASE_URL_POLL, 'seed', seedId))
            .subscribe(
                (response) => {
                    this._pollsSubject.next(response);
                },
                (error) => {
                    console.error(`could not retrieve polls of seed ${seedId}`, error);
                }
            );
    }

    public vote(pollId: number, optionId: number): Observable<boolean> {

        return new Observable((observer) => {
            this._http
                .get<void>(StMaple.joinUrl(this.BASE_URL_POLL, 'vote', pollId, optionId), {observe: 'response'})
                .subscribe(
                    () => {
                        observer.next(true);
                        observer.complete();
                    },
                    (error) => {
                        console.error(`could not vote for option ${optionId} on poll ${pollId}`, error);
                        observer.error(error);
                    }
                );
        });
    }

}
