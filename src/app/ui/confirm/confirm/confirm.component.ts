import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import {Component} from '@angular/core';
import {Inject} from '@angular/core';
import {MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component(
    {
        selector: 'st-confirm',
        templateUrl: './confirm.component.html',
        styleUrls: ['./confirm.component.scss']
    }
)
export class ConfirmComponent {

    constructor(private _dialogRef: MatDialogRef<ConfirmComponent>,
                // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
                @Inject(MAT_DIALOG_DATA) private readonly _data: any) {
    }

    get text(): string {
        return this._data.text;
    }

    get okLabel(): string {
        return this._data.ok || 'ok';
    }

    get cancelLabel(): string {
        return this._data.cancel || 'cancel';
    }

    onNoClick(): void {
        this._dialogRef.close(false);
    }

    public confirm(): void {
        this._dialogRef.close(true);
    }

    public cancel(): void {
        this._dialogRef.close(false);
    }
}
