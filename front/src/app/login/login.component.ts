import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { empty } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm!: FormGroup;
  token: any;

  constructor(private fb: FormBuilder, private httpServer: HttpService, private route: Router) { }

  ngOnInit(): void {
    this.getToken();
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  async submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log(this.validateForm.value)
    this.httpServer.loginDIS(this.validateForm.value).then(res => {
      if (res) {
        this.saveToken(res["accessToken"], res["expiresIn"]);
        console.log(res);
      }
    });
  }

  private saveToken(token: string, expiresIn: string): void {
    localStorage.setItem("ACCESS_TOKEN", token);
    localStorage.setItem("EXPIRES_IN", expiresIn);
    this.token = token;
    if (this.token) {
      this.route.navigateByUrl('/welcome');
    }
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("ACCESS_TOKEN");
      if (this.token != null) {
        this.route.navigateByUrl('/welcome');
      }
    }
    return this.token;
  }
}
