import { Component, inject, OnInit } from "@angular/core";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { createPasswordStrengthValidator } from "../validators/password-strength.validator";

@Component({
  selector: "login",
  templateUrl: "./login-reactive.component.html",
  styleUrls: ["./login-reactive.component.css"],
  standalone: false,
})
export class LoginReactiveComponent implements OnInit {
  #fb = inject(NonNullableFormBuilder);

  form = this.#fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: [
      "",
      [
        Validators.required,
        Validators.minLength(8),
        createPasswordStrengthValidator(),
      ],
    ],
  });

  ngOnInit() {}

  login(): void {
    if (this.form.invalid) {
      return;
    }

    console.log(this.form);
  }
}
