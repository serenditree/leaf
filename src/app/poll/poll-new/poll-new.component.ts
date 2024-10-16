import {Component} from '@angular/core';
import {Input} from '@angular/core';
import {MapService} from '../../map/service/map.service';
import {OnInit} from '@angular/core';
import {StAnimations} from '../../utils/st-animations';
import {UntypedFormArray} from '@angular/forms';
import {UntypedFormBuilder} from '@angular/forms';
import {UntypedFormGroup} from '@angular/forms';
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

    private _parentFormGroup: UntypedFormGroup;
    private _pollsArray: UntypedFormArray;

    constructor(private _formBuilder: UntypedFormBuilder,
                private _mapService: MapService) {
    }

    get formGroup(): UntypedFormGroup {
        return this._parentFormGroup;
    }

    @Input()
    set formGroup(value: UntypedFormGroup) {
        this._parentFormGroup = value;
    }

    get pollsArray(): UntypedFormArray {
        return this._pollsArray;
    }

    ngOnInit(): void {
        this._pollsArray = this._parentFormGroup.get('polls') as UntypedFormArray;
        this.addPoll();
    }

    public showMap(): void {
        this._mapService.setMapVisible(true, null);
    }

    public hideMap(): void {
        this._mapService.setMapVisible(false, 60);
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
        const optionsArray = pollControls.get('options') as UntypedFormArray;

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
        (this._pollsArray.at(pollIndex).get('options') as UntypedFormArray).removeAt(optionIndex);
    }

    public optionsInvalid(pollIndex: number): boolean {
        const options = this._pollsArray.at(pollIndex).get('options');

        return options.hasError('required') || options.hasError('minlength');
    }

    public optionInputInvalid(pollIndex: number): boolean {
        // empty options are also duplicates... the empty set is a subset of any set...?!
        return this._pollsArray.at(pollIndex).get('optionInput').hasError('duplicated');
    }

    private _initPoll(): UntypedFormGroup {
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

    private _initOption(text: string): UntypedFormGroup {
        return this._formBuilder.group(
            {
                text: [text, Validators.minLength(1)],
                votes: [0]
            }
        );
    }
}
