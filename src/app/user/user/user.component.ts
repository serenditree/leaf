import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {FenceService} from '../../fence/service/fence.service';

@Component(
    {
        selector: 'st-user',
        templateUrl: './user.component.html',
        styleUrls: ['./user.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class UserComponent {
    private _fenceService = inject(FenceService);

    get username(): string {
        return this._fenceService.getUsername();
    }
}
