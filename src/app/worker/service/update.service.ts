import {ConfirmComponent} from '../../ui/confirm/confirm/confirm.component';
import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SwUpdate} from '@angular/service-worker';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UpdateService {

    constructor(private _update: SwUpdate,
                private _confirmDialog: MatDialog) {
        if (environment.production) {
            this._update.available.subscribe(() => {
                const dialogRef = this._confirmDialog.open(ConfirmComponent, {
                    data: {
                        text: 'New version available!',
                        ok: 'load',
                        cancel: 'skip'
                    }
                });

                dialogRef.afterClosed().subscribe((confirmed) => {
                    if (confirmed) {
                        window.location.reload();
                    }
                });
            });
            console.log('ServiceWorker update enabled.');
        } else {
            console.log('ServiceWorker update disabled.');
        }
    }
}
