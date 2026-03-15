import {AbstractSeedComponent} from './abstract-seed.component';
import {ActivatedRoute} from '@angular/router';
import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {FenceService} from '../../fence/service/fence.service';
import {FenceType} from '../../fence/model/fence-type.enum';
import {MapService} from '../../map/service/map.service';
import {MatDialog} from '@angular/material/dialog';
import {MessageService} from '../../ui/message/service/message.service';
import {PollService} from '../../poll/service/poll.service';
import {SeedFilter} from '../model/seed-filter';
import {SeedService} from '../service/seed.service';
import {SeedType} from '../model/seed-type.enum';
import {Seed} from '../model/seed';
import {Subscription} from 'rxjs';

@Component(
    {
        selector: 'st-seed',
        templateUrl: './seed.component.html',
        styleUrls: ['./seed.component.scss'],
        standalone: false
    }
)
export class SeedComponent extends AbstractSeedComponent<Seed> implements OnInit, OnDestroy {
    protected _route: ActivatedRoute;
    protected _mapService: MapService;
    protected _seedService: SeedService;
    protected _fenceService: FenceService;
    protected _confirmDialog: MatDialog;
    protected _messageService: MessageService;
    private _pollService = inject(PollService);

    private _waterOrPruneAllowed = false;
    private _nubitAllowed = false;
    private _pollsSubscription: Subscription;

    constructor() {
        const _route = inject(ActivatedRoute);
        const _mapService = inject(MapService);
        const _seedService = inject(SeedService);
        const _fenceService = inject(FenceService);
        const _confirmDialog = inject(MatDialog);
        const _messageService = inject(MessageService);

        super(_route, _mapService, _seedService, _fenceService, _confirmDialog, _messageService, SeedType.SEED);

        this._route = _route;
        this._mapService = _mapService;
        this._seedService = _seedService;
        this._fenceService = _fenceService;
        this._confirmDialog = _confirmDialog;
        this._messageService = _messageService;
    }

    get seed(): Seed {
        return this._seed;
    }

    get seedState(): any {
        return {
            seed: this._seed,
            isGarden: false
        };
    }

    get waterOrPruneAllowed(): boolean {
        return this._fenceService.isAuthenticated() && this._waterOrPruneAllowed;
    }

    get nubitAllowed(): boolean {
        return this._fenceService.isAuthenticated() && this._nubitAllowed;
    }

    ngOnInit(): void {
        super._onInit();

        this._pollsSubscription = this._pollService.pollsObservable.subscribe((polls) => {
            this._seed.polls = polls;
        });
    }

    ngOnDestroy(): void {
        super._onDestroy();
        this._pollsSubscription.unsubscribe();
    }

    public water(): void {
        if (this.waterOrPruneAllowed) {
            this._seedService.water(this._seed).subscribe((success) => {
                this._waterOrPruneAllowed = !success;
                if (success) {
                    this._messageService.info('Watered');
                } else {
                    this._messageService.error('Could not water Seed');
                }
            });
        }
    }

    public nubit(): void {
        if (this.nubitAllowed) {
            console.log('nubit');
            this._nubitAllowed = false;
        }
    }

    public prune(): void {
        if (this.waterOrPruneAllowed) {
            this._seedService.prune(this._seed).subscribe((success) => {
                this._waterOrPruneAllowed = !success;
                if (success) {
                    this._messageService.info('Pruned');
                } else {
                    this._messageService.error('Could not prune Seed');
                }
            });
        }
    }

    protected _onSeedResponse(seed: Seed): void {

        this._fenceService.isAuthorized(FenceType.SEED, seed.id, 'water')
            .subscribe(
                (response) => {
                    this._waterOrPruneAllowed = response.ok();
                }
            );

        if (seed.poll) {
            this._pollService.retrieveBySeed(seed.id);
        }

        const filter = new SeedFilter();
        filter.parentId = seed.id;
        this._seedService.retrieveByFilter(filter);
    }
}
