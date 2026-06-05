import {HTTP_HEADERS, HTTP_STATUS} from '../../st-const';
import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {DevService} from '../service/dev.service';
import {Pair} from '../../model/pair';
import {UntypedFormControl, Validators} from '@angular/forms';

@Component(
    {
        selector: 'st-tool',
        templateUrl: './tools.component.html',
        styleUrls: ['./tools.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class ToolsComponent {
    private _devService = inject(DevService);

    private static readonly STATUS_CODES: Pair<string, number>[] = Object
        .entries(HTTP_STATUS)
        .map(entry => new Pair(entry[0], entry[1]));

    private static readonly HEADER_KEYS: string[] = Object.values(HTTP_HEADERS);

    public statusControl = new UntypedFormControl('', Validators.required);
    public headerKeyControl = new UntypedFormControl('', Validators.required);
    public headerValueControl = new UntypedFormControl('', Validators.required);

    get statusCodes(): Pair<string, number>[] {
        return ToolsComponent.STATUS_CODES;
    }

    get headerKeys(): string[] {
        return ToolsComponent.HEADER_KEYS;
    }

    public send(): void {
        this._devService.echo(this.statusControl.value, this.headerKeyControl.value, this.headerValueControl.value);
    }
}
