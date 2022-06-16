import { Component, OnInit } from '@angular/core';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';  
import { MenuItem } from 'src/app/app.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {  
  public slides = []; 
  public specialMenuItems:Array<MenuItem> = [];
  public bestMenuItems:Array<MenuItem> = [];
  public todayMenu!:MenuItem;

  todayMenuImageUrl: string = "";

  public settings: Settings;
  constructor(public appSettings:AppSettings, public appService:AppService, private readonly afs: AngularFirestore ) {
    this.settings = this.appSettings.settings;  
  }

  ngOnInit() {

    var test = this.afs.doc('menu_url/menu_url');
    var next = test.valueChanges();
  
    next.subscribe((res: any) => {
      this.todayMenuImageUrl = res.mediaUrl;
      console.log("here");
      console.log(res);
    })
  
    

  

    this.getSlides();
    this.getSpecialMenuItems();
    this.getBestMenuItems();
    this.getTodayMenu();
  }

  public getSlides(){
    this.appService.getHomeCarouselSlides().subscribe((res:any)=>{
      this.slides = res;
    });
  }
 
  public getSpecialMenuItems(){
    this.appService.getSpecialMenuItems().subscribe(menuItems=>{
      this.specialMenuItems = menuItems;
    });
  } 

  public getBestMenuItems(){
    this.appService.getBestMenuItems().subscribe(menuItems=>{
      this.bestMenuItems = menuItems;
    });
  }

  public getTodayMenu(){
    this.appService.getMenuItemById(23).subscribe(data=>{ 
      this.todayMenu = data;  
    });
  }  

}
