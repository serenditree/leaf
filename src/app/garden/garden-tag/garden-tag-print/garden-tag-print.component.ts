import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, inject} from '@angular/core';
import {Garden} from '../../model/garden';
import {LayoutService} from '../../../ui/layout/service/layout.service';

@Component(
    {
        selector: 'st-garden-tag-print',
        templateUrl: './garden-tag-print.component.html',
        styleUrls: ['./garden-tag-print.component.scss'],
        standalone: false
    }
)
export class GardenTagPrintComponent {
    private _layoutService = inject(LayoutService);
    private _dialogRef = inject<MatDialogRef<GardenTagPrintComponent>>(MatDialogRef);
    private _garden = inject<Garden>(MAT_DIALOG_DATA);

    get garden(): Garden {
        return this._garden;
    }

    get size(): number {
        return this._layoutService.isMobile() ? 210 : 420;
    }

    onNoClick(): void {
        this._dialogRef.close();
    }
}
