import {HTTP_STATUS} from '../../utils/st-const';
import {AbstractSeedService} from './abstract-seed.service';
import {FilterService} from '../../search/service/filter.service';
import {HttpClient} from '@angular/common/http';
import {IndicatorService} from '../../ui/indicator/service/indicator.service';
import {Injectable} from '@angular/core';
import {MessageService} from '../../ui/message/service/message.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {SeedFilter} from '../model/seed-filter';
import {SeedSortingType} from '../model/seed-sorting-type.enum';
import {SeedType} from '../model/seed-type.enum';
import {Seed} from '../model/seed';
import {StMaple} from '../../utils/st-maple';
import {Subject} from 'rxjs';
import {finalize} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class SeedService extends AbstractSeedService<Seed> {

    protected _trail: Seed[] = [];
    protected _trailSubject: Subject<Seed[]> = new Subject();

    constructor(protected _http: HttpClient,
                protected _router: Router,
                protected _filterService: FilterService,
                protected _messageService: MessageService,
                protected _indicator: IndicatorService) {
        super(SeedType.SEED, _http, _router, _filterService, _messageService, _indicator);
    }

    get trailObservable(): Observable<Seed[]> {
        return this._trailSubject.asObservable();
    }

    public retrieveTrailById(id: string): void {
        this._indicator.progressStart();

        const filter = new SeedFilter();
        filter.parent = id;
        filter.trail = true;
        filter.sort = SeedSortingType.BY_DATE;

        this._http
            .post<Seed[]>(StMaple.joinUrl(this._api, 'retrieve'), filter)
            .pipe(
                finalize(() => {
                    this._indicator.progressEnd();
                })
            )
            .subscribe(
                (response) => {
                    this._trail = response;
                    this._trailSubject.next(response);
                },
                (error) => {
                    if (error.status === HTTP_STATUS.NOT_FOUND) {
                        console.log(`Trail ${id} seems to be gone...`);
                        this._trail = [];
                        this._trailSubject.next([]);
                    } else {
                        console.error(`Could not retrieve trail with id ${id}.`, error);
                    }
                }
            );
    }
}
