import {HTTP_STATUS} from '../../utils/st-const';
import {AbstractSeed} from '../model/abstract-seed';
import {FilterService} from '../../search/service/filter.service';
import {HttpClient} from '@angular/common/http';
import {HttpParams} from '@angular/common/http';
import {IndicatorService} from '../../ui/indicator/service/indicator.service';
import {LngLatBounds} from 'mapbox-gl';
import {MessageService} from '../../ui/message/service/message.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {SeedFilter} from '../model/seed-filter';
import {SeedType} from '../model/seed-type.enum';
import {Seed} from '../model/seed';
import {StMaple} from '../../utils/st-maple';
import {Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {finalize} from 'rxjs/operators';

export class AbstractSeedService<T extends AbstractSeed> {

    protected _seeds: T[] = [];
    protected _seedsSubject = new Subject<T[]>();
    protected _seedSubject = new Subject<T>();

    protected readonly _api: string;
    protected readonly _route: string;
    protected readonly _message: string;

    constructor(protected _type: SeedType,
                protected _http: HttpClient,
                protected _router: Router,
                protected _filterService: FilterService,
                protected _messageService: MessageService,
                protected _indicator: IndicatorService) {
        if (this._type === SeedType.SEED) {
            this._api = environment.API_BASE_URL_SEED;
            this._route = 'seeds';
            this._message = 'Seeded';
        } else {
            this._api = environment.API_BASE_URL_GARDEN;
            this._route = 'gardens';
            this._message = 'Cultivated';
        }
    }

    get seedsObservable(): Observable<T[]> {
        return this._seedsSubject.asObservable();
    }

    get seedObservable(): Observable<T> {
        return this._seedSubject.asObservable();
    }

    public getInMemory(): T[] {
        return this._seeds;
    }

    public create(seed: T): Observable<T> {

        return new Observable<T>((observer) => {
            this._http
                .post<T>(StMaple.joinUrl(this._api, 'create'), seed)
                .subscribe(
                    (response) => {
                        console.log(response);

                        observer.next(response);
                        observer.complete();

                        void this._router.navigate([this._route, response.id]).then(
                            () => this._messageService.info(this._message)
                        );
                    },
                    (error) => {
                        console.error(`Could not create ${this._type}: `, error);
                        this._messageService.error(`Sorry, could not create ${this._type.toLowerCase()}`);
                        observer.error(error);
                    }
                );
        });

    }

    public retrieveById(id: string): void {
        const cachedSeed = this._seeds.find((seed) => seed.id === id);

        if (cachedSeed) {
            this._seedSubject.next(cachedSeed);
        } else {
            this._http
                .get<T>(StMaple.joinUrl(this._api, id))
                .subscribe(
                    (response) => {
                        this._seedSubject.next(response);
                    },
                    (error) => {
                        console.error(`Could not retrieve ${this._type} with id ${id}`, error);
                    }
                );
        }
    }

    public retrieveByGlobalFilter(bounds?: LngLatBounds): void {
        if (bounds) {
            this.retrieveByFilter(
                this._filterService
                    .createQuery()
                    .setBounds(bounds)
                    .build(),
                true
            );
        } else {
            this.retrieveByFilter(
                this._filterService.getFilter(),
                true
            );
        }
    }

    public retrieveByFilter(filter: SeedFilter, inMemory = false): void {
        this._indicator.progressStart();
        console.log('Retrieval with filter:');
        console.log(filter);
        this._http
            .post<T[]>(StMaple.joinUrl(this._api, 'retrieve'), filter)
            .pipe(
                finalize(
                    () => {
                        this._indicator.progressEnd();
                    }
                )
            )
            .subscribe(
                (response) => {
                    if (inMemory) {
                        this._seeds = response;
                    }
                    this._seedsSubject.next(response);
                },
                (error) => {
                    if (error.status === HTTP_STATUS.NOT_FOUND) {
                        console.log(`Nothing ${this._message.toLowerCase()} around here with filter:`);
                        console.log(filter);
                        if (inMemory) {
                            this._seeds = [];
                        }
                        this._seedsSubject.next([]);
                    } else {
                        console.error(`Could not retrieve ${this._route} by filter:`, error);
                        console.log(filter);
                    }
                }
            );
    }

    public retrieveTags(name: string): Observable<string[]> {
        return new Observable((observer) => {
            this._http
                .get<string[]>(StMaple.joinUrl(this._api, 'retrieve', 'tags', name))
                .subscribe(
                    (response) => {
                        observer.next(response);
                    },
                    (error) => {
                        console.error(error);
                    }
                );
        });
    }

    public water(seed: Seed): Observable<boolean> {

        return this.waterOrPrune(seed, 'water');
    }

    public prune(seed: Seed): Observable<boolean> {
        return this.waterOrPrune(seed, 'prune');
    }

    public delete(id: string): void {

        this._http
            .delete<void>(StMaple.joinUrl(this._api, 'delete', id), {observe: 'response'})
            .subscribe(
                () => {
                    this._seeds = this._seeds.filter(seed => seed.id !== id);
                    this._seedsSubject.next(this._seeds);
                    console.log(`Successfully removed ${this._type} ${id}`);
                    void this._router.navigate(['']).then(
                        () => this._messageService.info('Successfully removed')
                    );

                },
                (error) => {
                    console.error(`Could not remove ${this._type} ${id}`, error);
                }
            );
    }

    private waterOrPrune(seed: Seed, waterOrPrune: 'water' | 'prune'): Observable<boolean> {
        let params = null
        if (seed.garden) {
            params = new HttpParams().append("garden", seed.garden);
        }

        return new Observable((observer) => {
            this._http
                .get<void>(StMaple.joinUrl(this._api, waterOrPrune, seed.id), {observe: 'response', params: params})
                .subscribe(
                    () => {
                        console.log(`Successfully ${waterOrPrune}ed ${this._type} ${seed.id}`);
                        observer.next(true);
                        observer.complete();
                    },
                    (error) => {
                        console.error(`Could not ${waterOrPrune} ${this._type} ${seed.id}`, error);
                        observer.next(false);
                        observer.complete();
                    }
                );
        });
    }
}
