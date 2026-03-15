import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, inject} from '@angular/core';

@Component(
    {
        selector: 'st-confirm',
        templateUrl: './confirm.component.html',
        styleUrls: ['./confirm.component.scss'],
        standalone: false
    }
)
export class ConfirmComponent {
    private _dialogRef = inject<MatDialogRef<ConfirmComponent>>(MatDialogRef);
    private readonly _data = inject(MAT_DIALOG_DATA);

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
