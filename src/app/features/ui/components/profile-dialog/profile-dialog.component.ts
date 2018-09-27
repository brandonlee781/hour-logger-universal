import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { GET_USER, GetUserQuery } from '@features/user/schema/queries';
import { User } from '@features/user/User';

import { PasswordValidation } from './PasswordValidation';
import { UPDATE_USER } from '@features/user/schema/mutations';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'bl-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent implements OnInit {
  updateUserForm: FormGroup;
  isLoading = false;
  confirmLogout = false;
  isBrowser: boolean;

  constructor(
    public fb: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.updateUserForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null],
      confirmPassword: [null],
      address: [null],
      city: [null],
      state: [null],
      zip: [null],
    }, {
      validator: PasswordValidation.MatchPassword,
    });
  }

  ngOnInit() {
    this.isLoading = true;
    console.log(this.updateUserForm.controls.password);
    this.apollo
      .watchQuery<GetUserQuery>({ query: GET_USER })
      .valueChanges
      .subscribe(q => {
        this.isLoading = false;
        const { email, address, city, state, zip }: User = q.data.getUser;
        this.updateUserForm.patchValue({
          email,
          address,
          city,
          state,
          zip,
        });
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateUser() {
    if (this.updateUserForm.valid) {
      const patch = this.updateUserForm.value;
      this.apollo.mutate({
        mutation: UPDATE_USER,
        variables: patch,
        refetchQueries: [
          {
            query: GET_USER,
          },
        ],
      }).subscribe(q => this.dialogRef.close());
    }
  }

  logout() {
    if (this.isBrowser) {
      const storage = window.localStorage;
      storage.clear();
    }
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }

  showPassword(input) {
    input.type = input.type === 'password' ?  'text' : 'password';
  }
}
