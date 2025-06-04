import { Component, inject, input, signal } from "@angular/core";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { catchError, finalize } from "rxjs/operators";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import { noop, of } from "rxjs";

@Component({
  selector: "file-upload",
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileUploadComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FileUploadComponent,
    },
  ],
  standalone: false,
})
export class FileUploadComponent implements ControlValueAccessor, Validator {
  requiredFileType = input.required<string>();

  fileName = signal<string>("");

  fileUploadError = signal<boolean>(false);
  fileUploadSuccess = signal<boolean>(false);

  uploadProgress = signal<number | undefined>(undefined);

  #http = inject(HttpClient);

  onChange = (fileName: string) => {};
  onTouched = () => {};
  onValidatorChange = () => {};

  disabled = signal<boolean>(false);

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName.set(file.name);

      const formData = new FormData();
      formData.append("thumbnail", file);

      this.fileUploadError.set(false);

      this.#http
        .post("/api/thumbnail-upload", formData, {
          reportProgress: true,
          observe: "events",
        })
        .pipe(
          catchError((error) => {
            this.fileUploadError.set(true);

            return of(error);
          }),
          finalize(() => this.uploadProgress.set(undefined))
        )
        .subscribe((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress.set(
              Math.round((100 * event.loaded) / event.total)
            );
          } else if (event.type === HttpEventType.Response) {
            this.onChange(this.fileName());
            this.onValidatorChange();

            this.fileUploadSuccess.set(true);
          }
        });
    }
  }

  writeValue(value: any): void {
    this.fileName.set(value);
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.fileUploadSuccess()) {
      return null;
    }

    let errors: any = {
      requiredFileType: this.requiredFileType(),
    };

    if (this.fileUploadError()) {
      errors = { ...errors, uploadFailed: true };
    }

    return errors;
  }

  registerOnValidatorChange(onValidatorChange: () => void): void {
    this.onValidatorChange = onValidatorChange;
  }
}
