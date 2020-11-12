import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserPageService } from '../user-page/user-page.service'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  items;
  checkoutForm;

  constructor(
    private userPageService: UserPageService,
    private formBuilder: FormBuilder,
  ) {
    this.checkoutForm = this.formBuilder.group({
      name: '',
      address: ''
    });
  }

  ngOnInit() {
    this.items = this.userPageService.getItems();
  }

  onSubmit(customerData) {
    // Process checkout data here
    this.items = this.userPageService.clearItems();
    this.checkoutForm.reset();

    console.warn('Your order has been submitted', customerData);
  }
}