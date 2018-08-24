import {Component, OnInit} from '@angular/core';
import {UsermanagementService} from "../usermanagement.service";
import {MatDialog} from "@angular/material";
import {RegisterUserComponent, UserRegisterData} from "../register-user/register-user.component";

export interface UserElement {
  firstName: string;
  lastName: number;
  username: number;
  email: string;
  phoneNumber: string;
}


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {


  userData: UserRegisterData;

  dataSource: any;

  constructor(private usrMgmtService: UsermanagementService,public dialog: MatDialog) {

  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterUserComponent,{
      width: '60%',
      data: {
        email: this.userData.email,
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        password: this.userData.password,
        phoneNumber: this.userData.phoneNumber
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.getUsers();
    });
  }


  getUsers() {
    this.usrMgmtService.getAllUsers()
      .subscribe(
        data => {
          this.dataSource = data;
          console.log(this.dataSource);
        }
      )
  }



  getActivationButtonText(isActive) {
    if (isActive) {
      return "Deactivate";
    } else {
      return "Activate";
    }
  }

  activateUser(username) {
    this.usrMgmtService.activateUser(username)
      .subscribe(
        data => {
          this.getUsers();
        }
      );
  }

  deactivateUser(username) {
    this.usrMgmtService.deactivateUser(username)
      .subscribe(
        data => {
          this.getUsers();
        }
      );
  }

  toggleActivation(isActive, username) {
    if (isActive) {
      this.deactivateUser(username);
    } else {
      this.activateUser(username);
    }
  }

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'username',
    'email',
    'phoneNumber',
    'activation',
    'edit'
  ];


  ngOnInit() {
    this.getUsers();
    this.userData = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phoneNumber: ""
    }
  }

}
