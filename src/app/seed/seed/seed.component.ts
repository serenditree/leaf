import {AbstractSeedComponent} from './abstract-seed.component';
import {ActivatedRoute} from '@angular/router';
import {Component} from '@angular/core';
import {FenceService} from '../../fence/service/fence.service';
import {FenceType} from '../../fence/model/fence-type.enum';
import {MapService} from '../../map/service/map.service';
import {MatDialog} from '@angular/material/dialog';
import {MessageService} from '../../ui/message/service/message.service';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
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
        styleUrls: ['./seed.component.scss']
    }
)
export class SeedComponent extends AbstractSeedComponent<Seed> implements OnInit, OnDestroy {

    private _waterOrPruneAllowed = false;
    private _nubitAllowed = false;
    private _pollsSubscription: Subscription;

    constructor(protected _route: ActivatedRoute,
                protected _mapService: MapService,
                protected _seedService: SeedService,
                protected _fenceService: FenceService,
                protected _confirmDialog: MatDialog,
                private _pollService: PollService,
                private _messageService: MessageService) {
        super(_route, _mapService, _seedService, _fenceService, _confirmDialog, SeedType.SEED);
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
            this._seedService.water(this._seed.id).subscribe((success) => {
                this._waterOrPruneAllowed = !success;
                if (success) {
                    this._messageService.info('Watered')
                } else {
                    this._messageService.error('Could not water Seed')
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
            this._seedService.prune(this._seed.id).subscribe((success) => {
                this._waterOrPruneAllowed = !success;
                if (success) {
                    this._messageService.info('Pruned')
                } else {
                    this._messageService.error('Could not prune Seed')
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
        filter.parent = seed.id;
        this._seedService.retrieveByFilter(filter);
    }
}
