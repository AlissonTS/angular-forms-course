import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoursesService } from "../../services/courses.service";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { createCourseTitleValidator } from "../../validators/course-title-validator";

type CourseCategory = {
  code: string;
  description: string;
};

@Component({
  selector: "create-course-step-1",
  templateUrl: "./create-course-step-1.component.html",
  styleUrls: ["./create-course-step-1.component.scss"],
  standalone: false,
})
export class CreateCourseStep1Component implements OnInit {
  #fb = inject(FormBuilder);
  #coursesService = inject(CoursesService);

  form = this.#fb.group({
    title: [
      "",
      {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(60),
        ],
        asyncValidators: [createCourseTitleValidator(this.#coursesService)],
        updateOn: "blur",
      },
    ],
    category: ["BEGINNER", Validators.required],
    releaseAt: [new Date(), Validators.required],
    downloadsAllowed: [false, Validators.requiredTrue],
    longDescription: ["", [Validators.required, Validators.minLength(3)]],
    // address: [null, Validators.required],
  });

  courseCategories$: Observable<CourseCategory[]> =
    this.#coursesService.findCourseCategories();

  ngOnInit() {
    const draft = localStorage.getItem("step-1");

    if (draft) {
      this.form.setValue(JSON.parse(draft));
    }

    this.form.valueChanges
      .pipe(filter(() => this.form.valid))
      .subscribe((value) =>
        localStorage.setItem("step-1", JSON.stringify(value))
      );
  }
}
