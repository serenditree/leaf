import {AbstractSeedService} from '../service/abstract-seed.service';
import {AbstractSeed} from '../model/abstract-seed';
import {ActivatedRoute} from '@angular/router';
import {ConfirmComponent} from '../../ui/confirm/confirm/confirm.component';
import {FenceService} from '../../fence/service/fence.service';
import {MapService} from '../../map/service/map.service';
import {MarkerType} from '../../map/model/marker-type.enum';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {MessageService} from '../../ui/message/service/message.service';
import {SeedType} from '../model/seed-type.enum';
import {Subscription} from 'rxjs';

export abstract class AbstractSeedComponent<T extends AbstractSeed> {

    protected _seed: T;

    private _seedSubscription: Subscription;
    private _idSubscription: Subscription;

    protected constructor(protected _route: ActivatedRoute,
                          protected _mapService: MapService,
                          protected _seedService: AbstractSeedService<T>,
                          protected _fenceService: FenceService,
                          protected _confirmDialog: MatDialog,
                          protected _messageService: MessageService,
                          protected _type: SeedType) {
    }

    get isOwner(): boolean {
        return this._seed && this._seed.userId === this._fenceService.getUserId();
    }

    public share(): void {
        navigator.clipboard.writeText(location.href).then(
            () => this._messageService.info("Link copied to clipboard"),
            () => this._messageService.error("Could not copy link")
        )
    }

    public delete(): void {
        const dialogRef = this._confirmDialog.open(ConfirmComponent, {
            data: {
                text: `Do you really want to remove this ${this._type.toLowerCase()}?`,
                ok: 'yes',
                cancel: 'no'
            }
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this._seedService.delete(this._seed.id);
            }
        });

    }

    protected _onInit(): void {
        this._seedSubscription = this._seedService.seedObservable.subscribe((seed) => {
            this._seed = seed;

            this._mapService.addSingleMarker(
                seed.id,
                seed.location,
                this._type === SeedType.SEED ? MarkerType.SEED : MarkerType.GARDEN
            );

            this._onSeedResponse(seed);
        });

        this._idSubscription = this._route.params.subscribe((params) => {
            this._seedService.retrieveById(params.id);
        });
    }

    protected _onDestroy(): void {
        this._seedSubscription.unsubscribe();
        this._idSubscription.unsubscribe();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    protected _onSeedResponse(seed: T): void {
        // hook
    }
}
