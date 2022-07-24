import {Component} from '@angular/core';
import {FenceService} from '../../fence/service/fence.service';

@Component({
               selector: 'st-user',
               templateUrl: './user.component.html',
               styleUrls: ['./user.component.scss']
           })
export class UserComponent {

    constructor(private _fenceService: FenceService) {
    }

    get username(): string {
        return this._fenceService.getUsername();
    }
}
