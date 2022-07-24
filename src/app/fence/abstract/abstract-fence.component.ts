import {FormGroup} from '@angular/forms';

export abstract class AbstractFenceComponent {

    private static readonly VISIBLE = 'visibility';
    private static readonly INVISIBLE = 'visibility_off';

    protected _formGroup: FormGroup;
    protected _submitted = false;
    private _passwordVisible = AbstractFenceComponent.INVISIBLE;

    get formGroup(): FormGroup {
        return this._formGroup;
    }

    get submitted(): boolean {
        return this._submitted;
    }

    get passwordVisible(): string {
        return this._passwordVisible;
    }

    public toggleVisibility(...inputs: HTMLElement[]): void {
        if (this._passwordVisible === AbstractFenceComponent.INVISIBLE) {
            inputs.forEach(input => input.setAttribute('type', 'input'));
            this._passwordVisible = AbstractFenceComponent.VISIBLE;
        } else {
            inputs.forEach(input => input.setAttribute('type', 'password'));
            this._passwordVisible = AbstractFenceComponent.INVISIBLE;
        }
    }
}
