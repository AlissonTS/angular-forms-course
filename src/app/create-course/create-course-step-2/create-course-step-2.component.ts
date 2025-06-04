import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { createPromoRangeValidator } from "../../validators/date-range.validator";

@Component({
  selector: "create-course-step-2",
  templateUrl: "create-course-step-2.component.html",
  styleUrls: ["create-course-step-2.component.scss"],
  standalone: false,
})
export class CreateCourseStep2Component implements OnInit {
  #fb = inject(FormBuilder);

  form = this.#fb.group(
    {
      courseType: ["premium", Validators.required],
      price: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(9999),
          Validators.pattern("^[0-9]+"),
        ],
      ],
      thumbnail: [null],
      promoStartAt: [null],
      promoEndAt: [null],
    },
    {
      validators: [createPromoRangeValidator()],
    }
  );

  ngOnInit() {
    this.form.controls["courseType"].valueChanges.subscribe((value) => {
      const priceControl = this.form.get("price");

      if (value === "free" && priceControl.enabled) {
        priceControl?.setValue(null);
        priceControl?.disable({
          emitEvent: false,
        });
      } else if (value === "premium" && priceControl.disabled) {
        priceControl?.enable({
          emitEvent: false,
        });
      }
    });
  }
}
