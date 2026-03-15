import {AbstractFenceComponent} from '../abstract/abstract-fence.component';
import {Component, OnInit, inject} from '@angular/core';
import {FenceService} from '../service/fence.service';
import {IndicatorService} from '../../ui/indicator/service/indicator.service';
import {MessageService} from '../../ui/message/service/message.service';
import {Principal} from '../model/principal';
import {StMaple} from '../../utils/st-maple';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';

@Component(
    {
        selector: 'st-login',
        templateUrl: './sign-in.component.html',
        styleUrls: ['./sign-in.component.scss'],
        standalone: false
    }
)
export class SignInComponent extends AbstractFenceComponent implements OnInit {
    private _fenceService = inject(FenceService);
    private _messageService = inject(MessageService);
    private _formBuilder = inject(UntypedFormBuilder);
    private _indicator = inject(IndicatorService);

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
