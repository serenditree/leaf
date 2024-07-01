import {HTTP_STATUS} from '../../utils/st-const';
import {AbstractControl} from '@angular/forms';
import {AbstractFenceComponent} from '../abstract/abstract-fence.component';
import {Component} from '@angular/core';
import {FenceService} from '../service/fence.service';
import {UntypedFormBuilder} from '@angular/forms';
import {IndicatorService} from '../../ui/indicator/service/indicator.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MessageService} from '../../ui/message/service/message.service';
import {Observable} from 'rxjs';
import {OnInit} from '@angular/core';
import {Principal} from '../model/principal';
import {StMaple} from '../../utils/st-maple';
import {StOak} from '../../utils/st-oak';
import {UserService} from '../../user/service/user.service';
import {ValidationErrors} from '@angular/forms';
import {Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {map} from 'rxjs/operators';
import {of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {timer} from 'rxjs';

@Component(
    {
        selector: 'st-sign-on',
        templateUrl: './sign-up.component.html',
        styleUrls: ['./sign-up.component.scss']
    }
)
export class SignUpComponent extends AbstractFenceComponent implements OnInit {

    private _turing = false;
    private _agreed = false

    constructor(private _fenceService: FenceService,
                private _userService: UserService,
                private _formBuilder: UntypedFormBuilder,
                private _indicator: IndicatorService,
                private _messageService: MessageService) {
        super();
    }

    get turing(): boolean {
        return this._turing;
    }

    get agreed(): boolean {
        return this._agreed;
    }

    ngOnInit(): void {
        this._formGroup = this._formBuilder.group(
            {
                username: ['', [Validators.required], [this._uniqueUser.bind(this)]],
                email: ['', [Validators.email]],
                password: ['', [Validators.required, StOak.entropy()]],
                passwordConfirm: ['', [Validators.required]]
            },
            {
                validator: StOak.identical('password', 'passwordConfirm')
            }
        );
    }

    onTuring(event: boolean): void {
        this._turing = event.valueOf();
    }

    onAgreement($event: MatCheckboxChange): void {
        this._agreed = $event.checked;
    }

    onSubmit(): void {
        if (this._formGroup.valid && this._turing && this._agreed) {
            this._indicator.progressStart();
            this._submitted = true;

            this._fenceService.signUp(StMaple.map(this._formGroup.value, new Principal()))
                .pipe(
                    finalize(
                        () => {
                            this._indicator.progressEnd();
                            this._submitted = false;
                        }
                    )
                )
                .subscribe(
                    (uiResponse) => {
                        console.log(uiResponse);
                    },
                    (uiResponse) => {
                        if (uiResponse.code === HTTP_STATUS.CONFLICT) {
                            this._messageService.error(uiResponse.text);
                        } else {
                            this._messageService.error('Sorry, something went wrong');
                        }
                    }
                );
        } else {
            console.log(this._formGroup);
        }
    }

    private _uniqueUser(control: AbstractControl): Observable<ValidationErrors | null> {
        return timer(420)
            .pipe(
                switchMap(
                    () => {
                        return !control.value ? of(null) : this._userService
                            .retrieveByUsername(control.value)
                            .pipe(
                                map((user) => user ? {usernameExists: true} : null)
                            );
                    }
                )
            );
    }
}
