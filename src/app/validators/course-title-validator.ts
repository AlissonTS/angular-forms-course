import { inject } from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { Observable } from "rxjs";
import { CoursesService } from "../services/courses.service";
import { map } from "rxjs/operators";

export function createCourseTitleValidator(
  coursesService: CoursesService
): AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Observable<ValidationErrors | null> | null => {
    return coursesService.findAllCourses().pipe(
      map((courses) => {
        return courses.find(
          (course) =>
            course.description.toLowerCase() === control.value.toLowerCase()
        )
          ? { titleExists: true }
          : null;
      })
    );
  };
}
