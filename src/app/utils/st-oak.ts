import {AbstractControl} from '@angular/forms';
import {FormArray} from '@angular/forms';
import {FormControl} from '@angular/forms';
import {FormGroup} from '@angular/forms';
import {ValidatorFn} from '@angular/forms';

/**
 * Collection of validators and other validation concerns. Oak or nut...
 */
export class StOak {

    /**
     * Validator that checks if two fields are identical.
     * @param {string | number} field1 Name or index a field
     * @param {string | number} field2 Name or index of a fild
     * @returns function(formGroup: FormGroup): {[key: string]: any}
     */
    public static identical(field1: string | number, field2: string | number): ValidatorFn {

        return (formGroup: FormGroup): {[key: string]: any} => {
            let identical = true;
            if (formGroup.controls[field1].value !== formGroup.controls[field2].value) {
                formGroup.controls[field2].setErrors({identical: true});
                identical = false;
            }

            return identical ? null : {identical: true};
        };
    }

    /**
     * Validator that evaluates password entropy.
     * @returns function(formControl: AbstractControl): {[key: string]: any}
     */
    public static entropy(): ValidatorFn {

        return (formControl: AbstractControl): {[key: string]: any} => {
            const password = formControl.value;

            // Check if there is a word-list and count words.
            let count = (password.match(/([a-zA-Z]{2,})(?=[^a-zA-Z]+|$)/g) || []).length;
            // Number of words in EFF word-list.
            let pool = 7776;

            if (count < 5) {
                count = password.length;
                pool = 0;

                if (password.match(/[a-z]/)) {
                    pool += 26;
                }
                if (password.match(/[A-Z]/)) {
                    pool += 26;
                }
                if (password.match(/\d/)) {
                    pool += 10;
                }
                if (password.match(/[^a-zA-Z\d]/)) {
                    pool += 33;
                }
            }

            const entropy = Math.log2(Math.pow(pool, count));

            return entropy < 65 ? {entropy: entropy} : null;
        };
    }

    /**
     * Validator that searches HTML elements.
     * @returns function(formControl: AbstractControl): {[key: string]: any}
     */
    public static html(): ValidatorFn {

        return (formControl: AbstractControl): {[key: string]: any} => {
            const text = formControl.value;

            return /<.+>/.test(text) ? {html: true} : null;
        };
    }

    /**
     * Touches everything... and triggers validation feedback.
     * @param {FormGroup | FormArray} control FormGroup or FormArray to be touched
     */
    public static touch(control: FormGroup | FormArray): void {
        control.markAsTouched();
        for (const i in control.controls) {
            if (control.controls[i] instanceof FormControl) {
                control.controls[i].markAsTouched();
            } else {
                StOak.touch(control.controls[i]);
            }
        }
    }

    /**
     * Null-safe blank string test.
     * @param {string} string String to test.
     * @returns {boolean}
     */
    public static notBlank(string: string): boolean {
        return string !== null && string.trim().length > 0;
    }
}
