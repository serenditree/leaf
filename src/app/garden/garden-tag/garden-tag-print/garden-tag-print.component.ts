import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component} from '@angular/core';
import {Garden} from '../../model/garden';
import {Inject} from '@angular/core';
import {LayoutService} from '../../../ui/layout/service/layout.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component(
    {
        selector: 'st-garden-tag-print',
        templateUrl: './garden-tag-print.component.html',
        styleUrls: ['./garden-tag-print.component.scss']
    }
)
export class GardenTagPrintComponent {

    constructor(private _layoutService: LayoutService,
                private _dialogRef: MatDialogRef<GardenTagPrintComponent>,
                @Inject(MAT_DIALOG_DATA)
                private _garden: Garden) {
    }

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
