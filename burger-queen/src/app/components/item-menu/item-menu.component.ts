import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConnectionServiceService } from 'src/app/connection-service.service';
import DataMenu from 'src/assets/menu.json';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.css']
})
export class ItemMenuComponent implements OnInit {
  Menu: any = DataMenu;
  @ViewChild('product') productName!: ElementRef;
  @ViewChild('price') priceTag!: ElementRef;
  
  constructor(private getItemMenu: ConnectionServiceService) { }

  ngOnInit(): void { }
  
  getElemMenu() {
    const itemsMenu = {
      product : this.productName.nativeElement.textContent,
      price: this.priceTag.nativeElement.textContent,
    }
    this.getItemMenu.$conector.emit(itemsMenu)

    
  }
}
