import {ConfirmComponent} from '../../ui/confirm/confirm/confirm.component';
import {Injectable, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SwUpdate, VersionReadyEvent} from '@angular/service-worker';
import {environment} from '../../../environments/environment';
import {filter} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UpdateService {
    private _update = inject(SwUpdate);
    private _confirmDialog = inject(MatDialog);

    constructor() {
        if (environment.production) {
            this._update.versionUpdates
                .pipe(filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'))
                .subscribe(() => {
                    const dialogRef = this._confirmDialog.open(ConfirmComponent, {
                        data: {
                            text: 'New version available!',
                            ok: 'load',
                            cancel: 'skip'
                        }
                    });

                    dialogRef.afterClosed().subscribe((confirmed) => {
                        if (confirmed) {
                            document.location.reload();
                        }
                    });
                });
            console.log('ServiceWorker update enabled.');
        } else {
            console.log('ServiceWorker update disabled.');
        }
    }
}
