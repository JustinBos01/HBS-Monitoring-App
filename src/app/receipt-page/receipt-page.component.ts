import { Component, OnInit } from '@angular/core';
import { Config } from 'protractor';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-receipt-page',
  templateUrl: './receipt-page.component.html',
  styleUrls: ['./receipt-page.component.css']
})

export class ReceiptPageComponent implements OnInit {

  chosenGroup = localStorage.getItem('chosenGroup');
  userReceiptProductsInfo = [];
  userReceiptData;
  userReceiptImg = [];
  category = [];
  receiptCategory = [];
  dates = [];
  prices = [];
  chosenUser = localStorage.getItem('chosenUser')
  
  constructor(
    public configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.getUserReceiptData();
  }

  //get receipt data function
  getUserReceiptData() {
    this.receiptCategory = [];
    var boughtProduct = [];
    var boughtProductPrice = [];
    var productsOnReceipt = [];

    this.userReceiptProductsInfo.length = 0

    this.configService.getUserReceiptPhotos()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for retrieving user receipts has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for retrieving user receipts has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(receiptData => {
          this.userReceiptData = receiptData;
          this.userReceiptData = this.userReceiptData.receiptsData
          var category = [];
          var receiptCategory = [];
          var index = 0;
          var date;
          var price;
          this.prices = []

          for (let receipt of this.userReceiptData) {
            //check if receipt is an img
            if (receipt.image.base64image != ""){
              date = String(receipt.transaction.date).substring(0,4) + - + String(receipt.transaction.date).substring(4,6) + - + String(receipt.transaction.date).substring(6)
              this.userReceiptImg.push({totalPrice: receipt.transaction.totalPrice, date: date, receiptProductType: receipt.transaction.receiptProductType, base64Img: receipt.image.base64image})
            }

            //check if receipt contains raw data
            if (receipt.products != null) {
              boughtProduct = [];
              category = [];
              price = []

              for (let element of receipt.products) {
                //get products and categories of products on receipt
                boughtProduct.push(element.product);
                category.push(element.productCategory);
                price.push(element.price)
              }
              this.prices.push(price)
              //get date value and format it
              date = receipt.products[0].productDate.substring(0, 4) + - + receipt.products[0].productDate.substring(4, 6) + - + receipt.products[0].productDate.substring(6)

              receiptCategory.push(category)
              productsOnReceipt.push(boughtProduct)
              this.userReceiptProductsInfo.push({product: productsOnReceipt[index], productCategory: receiptCategory[index], individualPrice: this.prices[index], price: receipt.transaction.totalPrice, productDate: date})
              console.log(this.userReceiptProductsInfo)
              index += 1;
            }
          }
        }
      )
  }

}
