import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({});
  errorMsg: string | undefined;
  loader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: [null, [ Validators.required ]],
      email: [null, [ Validators.required, Validators.email ]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  registerUser(form: any): void {
    // let formValues = { ...form.value };
    delete this.errorMsg;
    this.loader = true;
    let formValues: {  name: string; email: string; password: string } = Object.assign({}, form.value);
    this.authService.registerUser(formValues)
      .then(() => this.loader = false)
      .catch((error) => {
        this.loader = false;
        this.errorMsg = error;
        setTimeout(() => delete this.errorMsg, 5000)
      });
  }
}
