import {Injectable} from '@angular/core';
import {LayoutService} from '../../layout/service/layout.service';
import {MatSnackBarConfig} from '@angular/material/snack-bar';
import {MatSnackBarRef} from '@angular/material/snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SimpleSnackBar} from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class MessageService {

    public static readonly MESSAGE_DISPLAY_DURATION = 2500;

    private _messages: {message: string, isError: boolean}[]  = [];
    private _snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;

    constructor(private _snackBar: MatSnackBar,
                private _layoutService: LayoutService) {
    }

    public info(message: string): void {
        this.send(message, false);
    }

    public error(message: string): void {
        this.send(message, true);
    }

    private send(message: string, isError: boolean): void {
        if (message !== null) {
            this._messages.push({message: message, isError: isError});
        }
        if (this._snackBarRef === null) {
            const currentMessage = this._messages.shift();
            this._snackBarRef = this._snackBar.open(
                currentMessage.message,
                '',
                this._getConfig(currentMessage.isError)
            );
        }
        this._snackBarRef.afterDismissed().subscribe(() => {
            this._snackBarRef = null;
            if (this._messages.length > 0) {
                this.send(null, null);
            }
        });
    }

    private _getConfig(error: boolean): MatSnackBarConfig {
        return {
            duration: MessageService.MESSAGE_DISPLAY_DURATION,
            panelClass: error ? 'mat-snack-bar-error' : 'mat-snack-bar',
            verticalPosition: this._layoutService.isMobile() ? 'top' : 'bottom'
        };
    }
}
