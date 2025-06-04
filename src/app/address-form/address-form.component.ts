import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from "@angular/forms";
import { noop, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "address-form",
  templateUrl: "./address-form.component.html",
  styleUrls: ["./address-form.component.scss"],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AddressFormComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: AddressFormComponent,
      multi: true,
    },
  ],
})
export class AddressFormComponent
  implements ControlValueAccessor, Validator, OnDestroy
{
  @Input()
  legend: string;

  form: FormGroup = this.fb.group({
    addressLine1: [null, [Validators.required]],
    addressLine2: [null, [Validators.required]],
    zipCode: [null, [Validators.required]],
    city: [null, [Validators.required]],
  });

  onTouched = () => {};

  destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  registerOnChange(onChange: any): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(onChange);
  }

  writeValue(value: any): void {
    if (value) {
      this.form.setValue(value);
    }
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.form.valid) {
      return null;
    }

    return { invalidForm: true };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
