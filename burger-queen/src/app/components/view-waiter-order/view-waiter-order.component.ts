import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionServiceService } from 'src/app/connection-service.service';

@Component({
  selector: 'app-view-waiter-order',
  templateUrl: './view-waiter-order.component.html',
  styleUrls: ['./view-waiter-order.component.css']
})
export class ViewWaiterOrderComponent implements OnInit {
  clientName: string = ''; // nombre del cliente, lo traemos de nameClient
  breakfastSwitch: boolean = true; // item Menú desayuno
  lunchAndDinnerSwitch!: boolean; // menú lunch & dinner 
  totalPrice: number = 0;
  @ViewChild('btnBreakfast') buttonBreakFast!: ElementRef;
  @ViewChild('btnLunch') buttonLunch!: ElementRef;
  sendFullOrder: any = {};
  arrOrder: Array<any> = [];
  totalVoid: boolean = false;
  orderSuccess: boolean = false;
  
  constructor(private router2: Router, private router: ActivatedRoute, private renderer2: Renderer2, private connector: ConnectionServiceService ) { }
  
  ngOnInit(): void {
    // Nos suscribimos al valor del nombre del cliente 
    this.router.queryParams.subscribe((params: any) => {
      this.clientName = params.client;
    })
    
    this.connector.$totalOrder.subscribe((valor: any) => {
      this.totalPrice = valor;
    })

    this.connector.$sendArrOrder.subscribe((valor: any) => {
      this.arrOrder = valor;
    })
  }

  // Método para mostrar el menú de desayuno
  showBreakfast(){
    const btnBFast = this.buttonBreakFast.nativeElement;
    const btnLunch = this.buttonLunch.nativeElement;
    this.renderer2.addClass(btnBFast, 'btnWaiterSelected');
    this.renderer2.removeClass(btnLunch, 'btnWaiterSelected');
    this.breakfastSwitch = true;
    this.lunchAndDinnerSwitch = false;
  }

  // Método para mostrar el menú de lunch and dinner
  showLunchAndDinner(){
    const btnBFast = this.buttonBreakFast.nativeElement;
    const btnLunch = this.buttonLunch.nativeElement;
    this.renderer2.addClass(btnLunch, 'btnWaiterSelected');
    this.renderer2.removeClass(btnBFast, 'btnWaiterSelected');
    this.lunchAndDinnerSwitch = true;
    this.breakfastSwitch = false;
  }

  async sendOrder() {
    const today = new Date();
    const dateAndHour = today.toLocaleString();
    const dateSeparator = dateAndHour.split(' ');
    if(this.totalPrice !== 0 ) {
      this.totalVoid = false;
      this.sendFullOrder = {
        clientName: this.clientName,
        totalPrice: this.totalPrice,
        statusOrder: 'PENDIENTE',
        fullOrder: this.arrOrder,
        date: dateSeparator[0],
        hour: dateSeparator[1],
        createdAt: today.getTime(),
      }
      this.orderSuccess = true;
      const response = await this.connector.addOrder(this.sendFullOrder)
    } else {
      this.totalVoid = true;
    }
    }

    closeModalOrderVoid() {
      this.totalVoid = false;
  }
  
  closeModalOrderSuccess() {
    this.router2.navigate(['/nameClient']);
    this.orderSuccess = false;
  }
}
