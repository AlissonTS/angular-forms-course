import { Component, inject } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "create-course-step-3",
  templateUrl: "create-course-step-3.component.html",
  styleUrls: ["create-course-step-3.component.scss"],
  standalone: false,
})
export class CreateCourseStep3Component {
  #fb = inject(FormBuilder);

  form = this.#fb.group({
    lessons: this.#fb.array([]),
  });

  get lessons(): FormArray<FormGroup> {
    return this.form.get("lessons") as FormArray<FormGroup>;
  }

  addLesson(): void {
    this.lessons.push(
      this.#fb.group({
        title: [null, [Validators.required]],
        level: ["BEGINNER", [Validators.required]],
      })
    );
  }

  deleteLesson(index: number): void {
    this.lessons.removeAt(index);
  }
}
