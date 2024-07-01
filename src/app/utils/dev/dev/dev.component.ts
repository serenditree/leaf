import {HTTP_HEADERS} from '../../st-const';
import {HTTP_STATUS} from '../../st-const';
import {Component} from '@angular/core';
import {DevService} from '../service/dev.service';
import {Pair} from '../../model/pair';
import {UntypedFormControl} from '@angular/forms';
import {Validators} from '@angular/forms';

@Component({
               selector: 'st-dev',
               templateUrl: './dev.component.html',
               styleUrls: ['./dev.component.scss']
           })
export class DevComponent {

    private static readonly STATUS_CODES: Pair<string, number>[] = Object
        .entries(HTTP_STATUS)
        .map(entry => new Pair(entry[0], entry[1]));

    private static readonly HEADER_KEYS: string[] = Object.values(HTTP_HEADERS);

    public statusControl = new UntypedFormControl('', Validators.required);
    public headerKeyControl = new UntypedFormControl('', Validators.required);
    public headerValueControl = new UntypedFormControl('', Validators.required);

    constructor(private _devService: DevService) {
    }

    get statusCodes(): Pair<string, number>[] {
        return DevComponent.STATUS_CODES;
    }

    get headerKeys(): string[] {
        return DevComponent.HEADER_KEYS;
    }

    public send(): void {
        this._devService.echo(this.statusControl.value, this.headerKeyControl.value, this.headerValueControl.value)
    }
}
