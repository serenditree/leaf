import {ActivatedRoute} from '@angular/router';
import {Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy} from '@angular/core';
import {ConfirmComponent} from '../../ui/confirm/confirm/confirm.component';
import {FenceService} from '../../fence/service/fence.service';
import {Issuer} from '../model/issuer';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {UntypedFormControl, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import {environment} from '../../../environments/environment';

@Component(
    {
        selector: 'st-settings',
        templateUrl: './settings.component.html',
        styleUrls: ['./settings.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class SettingsComponent implements OnInit, OnDestroy {
    protected _route = inject(ActivatedRoute);
    protected _confirmDialog = inject(MatDialog);
    private _userService = inject(UserService);
    private _fenceService = inject(FenceService);

    private _queryParamsSubscription: Subscription;

    public countryControl = new UntypedFormControl('AT', Validators.required);
    public countries: Issuer[] = [
        {
            code: 'at',
            enabled: true
        },
        {
            code: 'de',
            enabled: true
        },
        {
            code: 'ch',
            enabled: false
        }
    ];
    public includeContributions = false;

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
        return environment.API_BASE_URL_USER
               + '/verify/callback/' + String(this.countryControl.value)
               + '?id=' + String(this._fenceService.getUserId());
    }

    get isVerified(): boolean {
        return this._fenceService.verified();
    }

    get isProduction(): boolean {
        return environment.production;
    }

    public delete(): void {
        let text = 'Do you really want to delete your account';
        if (this.includeContributions) {
            text += ' and all contributions';
        }

        const dialogRef = this._confirmDialog.open(ConfirmComponent, {
            data: {
                text: text + '? This action cannot be undone.',
                ok: 'yes',
                cancel: 'no'
            }
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this._userService.delete(this.includeContributions);
            }
        });
    }
}
