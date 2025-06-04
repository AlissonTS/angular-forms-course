import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function createPromoRangeValidator(): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {
    const startAt = form.get("promoStartAt")?.value;
    const endAt = form.get("promoEndAt")?.value;

    if (!startAt || !endAt) {
      return null;
    }

    const isRangeValid = endAt?.getTime() - startAt?.getTime() > 0;
    return isRangeValid ? null : { promotionalPeriod: true };
  };
}
