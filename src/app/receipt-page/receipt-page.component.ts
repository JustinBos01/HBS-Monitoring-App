import { Component, OnInit } from '@angular/core';
import { Config } from 'protractor';
import { ConfigService } from '../config/config.service';

@Component({
  selector: 'app-receipt-page',
  templateUrl: './receipt-page.component.html',
  styleUrls: ['./receipt-page.component.css']
})
export class ReceiptPageComponent implements OnInit {

  userReceiptProductsInfo = [];
  userReceiptData;
  userReceiptImg = [];
  category = [];
  receiptCategory = [];
  dates = [];
  


  constructor(
    public configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.getUserReceiptData();
  }

  getUserReceiptData() {
    this.receiptCategory = [];
    var boughtProduct = [];
    var boughtProductPrice = [];
    var productsOnReceipt = [];

    this.userReceiptProductsInfo.length = 0
    this.configService.getUserReceiptPhotos().subscribe(receiptData => {
        this.userReceiptData = receiptData;
        this.userReceiptData = this.userReceiptData.receiptsData
        var category = [];
        var receiptCategory = [];
        var index = 0;
        var date;

        for (let receipt of this.userReceiptData) {
          
          if (receipt.image.base64image != ""){
            this.userReceiptImg.push({store: receipt.transaction.store, storeType: receipt.transaction.storeType, receiptProductType: receipt.transaction.receiptProductType, base64Img: receipt.image.base64image})
          }

          if (receipt.products != null) {
            boughtProduct = [];
            category = [];

            for (let element of receipt.products) {
              boughtProduct.push(element.product);
              category.push(element.productCategory);
            }
            date = receipt.products[0].productDate.substring(0, 4) + - + receipt.products[0].productDate.substring(4, 6) + - + receipt.products[0].productDate.substring(6)

            receiptCategory.push(category)
            productsOnReceipt.push(boughtProduct)
            this.userReceiptProductsInfo.push({product: productsOnReceipt[index], productCategory: receiptCategory[index], price: receipt.transaction.totalPrice, productDate: date})
            console.log(this.userReceiptProductsInfo)
            index += 1;
          }
        }
      }
    )
  }

}
