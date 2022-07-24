import {AbstractFenceComponent} from '../abstract/abstract-fence.component';
import {Component} from '@angular/core';
import {FenceService} from '../service/fence.service';
import {FormBuilder} from '@angular/forms';
import {IndicatorService} from '../../ui/indicator/service/indicator.service';
import {MessageService} from '../../ui/message/service/message.service';
import {OnInit} from '@angular/core';
import {Principal} from '../model/principal';
import {StMaple} from '../../utils/st-maple';
import {Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';

@Component(
    {
        selector: 'st-login',
        templateUrl: './sign-in.component.html',
        styleUrls: ['./sign-in.component.scss']
    }
)
export class SignInComponent extends AbstractFenceComponent implements OnInit {

    constructor(private _fenceService: FenceService,
                private _messageService: MessageService,
                private _formBuilder: FormBuilder,
                private _indicator: IndicatorService) {
        super();
    }

    ngOnInit(): void {
        this._formGroup = this._formBuilder.group(
            {
                username: ['', Validators.required],
                password: ['', Validators.required]
            }
        );
    }

    public onSubmit(): void {
        if (this._formGroup.valid) {
            this._indicator.progressStart();
            this._submitted = true;

            this._fenceService.signIn(StMaple.map(this._formGroup.value, new Principal()))
                .pipe(
                    finalize(
                        () => {
                            this._indicator.progressEnd();
                            this._submitted = false;
                        }
                    )
                )
                .subscribe(
                    (response) => {
                        console.log(response);
                    },
                    (error) => {
                        this._messageService.error(error.text);
                    }
                );
        }
    }
}
