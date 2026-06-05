import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {Garden} from '../../model/garden';
import {LayoutService} from '../../../ui/layout/service/layout.service';

@Component(
    {
        selector: 'st-garden-tag-print',
        templateUrl: './garden-tag-print.component.html',
        styleUrls: ['./garden-tag-print.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class GardenTagPrintComponent {
    private readonly _layoutService = inject(LayoutService);
    private readonly _dialogRef = inject<MatDialogRef<GardenTagPrintComponent>>(MatDialogRef);
    private readonly _garden = inject<Garden>(MAT_DIALOG_DATA);

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
