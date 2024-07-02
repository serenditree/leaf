import {ActivatedRoute} from '@angular/router';
import {Component} from '@angular/core';
import {ConfirmComponent} from '../../ui/confirm/confirm/confirm.component';
import {FenceService} from '../../fence/service/fence.service';
import {Issuer} from '../model/issuer';
import {MatDialog} from '@angular/material/dialog';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UntypedFormControl} from '@angular/forms';
import {UserService} from '../service/user.service';
import {Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';

@Component(
    {
        selector: 'st-settings',
        templateUrl: './settings.component.html',
        styleUrls: ['./settings.component.scss']
    }
)
export class SettingsComponent implements OnInit, OnDestroy {

    private _queryParamsSubscription: Subscription;

    public countryControl = new UntypedFormControl('AT', Validators.required);
    public countries: Issuer[] = [
        {code: 'at', enabled: !environment.production},
        {code: 'de', enabled: !environment.production},
        {code: 'ch', enabled: false}
    ];

    constructor(private _userService: UserService,
                private _fenceService: FenceService,
                protected _route: ActivatedRoute,
                protected _confirmDialog: MatDialog) {
    }

    ngOnInit(): void {
        this._queryParamsSubscription = this._route.queryParams.subscribe((params) => {
            if (params.oidc) {
                this._fenceService.verify(params.oidc);
            }
        });
        this.countryControl.setValue(this.countries[0].code);
    }

    ngOnDestroy(): void {
        this._queryParamsSubscription.unsubscribe();
    }

    get verifyCallback(): string {
        return environment.production ? '' : environment.API_BASE_URL_USER
               + '/verify/callback/' + String(this.countryControl.value)
               + '?id=' + String(this._fenceService.getUserId());
    }

    get isProduction(): boolean {
        return environment.production;
    }

    public delete(): void {
        const dialogRef = this._confirmDialog.open(ConfirmComponent, {
            data: {
                text: 'Do you really want to delete your account?',
                ok: 'yes',
                cancel: 'no'
            }
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this._userService.delete();
            }
        });
    }
}
