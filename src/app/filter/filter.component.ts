import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface Filter {
	name : string;
	key : string;
	selected : boolean;
	count:number;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() facet:any = [];
  @Output() facetEvent = new EventEmitter<any>();

  hobbies = {};

  constructor() { }

  ngOnInit() {
  }

  changeCheckbox(d) {
    for(let name in this.hobbies) {
      console.log(name);
    }

  
    
    //console.log(this.hobbies)
  }

  sendMessage(d:any) {
    this.facetEvent.emit(d);
  }

}
