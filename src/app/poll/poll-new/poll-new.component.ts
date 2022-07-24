import {Component} from '@angular/core';
import {FormArray} from '@angular/forms';
import {FormBuilder} from '@angular/forms';
import {FormGroup} from '@angular/forms';
import {Input} from '@angular/core';
import {OnInit} from '@angular/core';
import {StAnimations} from '../../utils/st-animations';
import {Validators} from '@angular/forms';

@Component(
    {
        selector: 'st-poll-new',
        templateUrl: './poll-new.component.html',
        styleUrls: ['./poll-new.component.scss'],
        animations: [
            StAnimations.enterSlideVertical
        ]
    }
)
export class PollNewComponent implements OnInit {

    private _parentFormGroup: FormGroup;
    private _pollsArray: FormArray;

    constructor(private _formBuilder: FormBuilder) {
    }

    get formGroup(): FormGroup {
        return this._parentFormGroup;
    }

    @Input()
    set formGroup(value: FormGroup) {
        this._parentFormGroup = value;
    }

    get pollsArray(): FormArray {
        return this._pollsArray;
    }

    ngOnInit(): void {
        this._pollsArray = this._parentFormGroup.get('polls') as FormArray;
        this.addPoll();
    }

    public addPoll(): void {
        this._pollsArray.push(this._initPoll());
    }

    public removePoll(pollIndex: number): void {
        this.pollsArray.removeAt(pollIndex);
    }

    public addOption(pollIndex: number): void {
        const pollControls = this._pollsArray.at(pollIndex);
        const optionInput = pollControls.get('optionInput');
        const optionsArray = pollControls.get('options') as FormArray;

        const duplicate = optionsArray.controls.findIndex((item) => {
            return item.get('text').value.trim() === optionInput.value.trim();
        });

        if (duplicate === -1 && optionInput.value.trim().length > 0) {
            optionsArray.push(this._initOption(optionInput.value));
            optionInput.setValue('');
        } else {
            optionInput.setErrors({duplicated: true});
            optionInput.markAsTouched();
        }
    }

    public removeOption(pollIndex: number, optionIndex: number): void {
        // eslint-disable-next-line no-extra-parens
        (this._pollsArray.at(pollIndex).get('options') as FormArray).removeAt(optionIndex);
    }

    public optionsInvalid(pollIndex: number): boolean {
        const options = this._pollsArray.at(pollIndex).get('options');

        return options.hasError('required') || options.hasError('minlength');
    }

    public optionInputInvalid(pollIndex: number): boolean {
        // empty options are also duplicates... the empty set is a subset of any set...?!
        return this._pollsArray.at(pollIndex).get('optionInput').hasError('duplicated');
    }

    private _initPoll(): FormGroup {
        return this._formBuilder.group(
            {
                title: ['', Validators.required],
                // View only. Validator always false to trigger mat-error for options
                optionInput: ['', Validators.requiredTrue],
                options: this._formBuilder.array(
                    [],
                    Validators.compose([Validators.required, Validators.minLength(2)])
                )
            }
        );
    }

    private _initOption(text: string): FormGroup {
        return this._formBuilder.group(
            {
                text: [text, Validators.minLength(1)],
                votes: [0]
            }
        );
    }
}
