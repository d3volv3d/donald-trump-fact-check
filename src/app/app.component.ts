import { Component, AfterContentInit  } from '@angular/core';
import * as d3 from 'd3';
import { PapaParseService } from 'ngx-papaparse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  radius = 10;
  svg;
  margin = {top: 10, right: 0, bottom: 20, left: 25};
  buffer = 5;
  trueWidth = 1200;
  trueHeight = 400;
  width = this.trueWidth - this.margin.left - this.margin.right - this.buffer;
  height = this.trueHeight - this.margin.top - this.margin.bottom - this.buffer;

  trueStartDate;
  trueEndDate;


  data_all:any = [];
  data_line:any = [];

  _locales:any = [];
  _cats:any = [];

  constructor() { }

  ngAfterContentInit() {
    // d3.select('p').style('color', 'red');


    this.svg = d3.select("#chart").append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("viewBox", "0 0 " + this.trueWidth + " " + this.trueHeight)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr('id', 'chartLies')
      .append("g")
        .attr("transform","translate(" + this.margin.left + "," + this.margin.top + ")")

    
    d3.csv("./assets/liar.csv").then((data_raw) => {

      data_raw.forEach((d) => {
        d.category1 = d.category1.trim();
        d.category2 = d.category2.trim();
        d.category3 = d.category3.trim();
        d.category4 = d.category4.trim();
      });

      this.data_all = data_raw.slice(0);


      let locales_all = [];
      let cats_all = [];
      data_raw.forEach(function(d) {
        if (d.placecategory.length > 0) { locales_all.push(d.placecategory); }
        if (d.category1.length > 0) { cats_all.push(d.category1); }
        if (d.category2.length > 0) { cats_all.push(d.category2); }
        if (d.category3.length > 0) { cats_all.push(d.category3); }
        if (d.category4.length > 0) { cats_all.push(d.category4); }
      });
      
      let locales = Array.from(new Set(locales_all));
      let cats = Array.from(new Set(cats_all));
      locales.unshift("All");
      cats.sort((a, b) => a.localeCompare(b));
      cats.unshift("All");

      this._locales = locales.slice(0);
      this._cats = cats.slice(0);

      console.log(locales, cats)
      
      let strD = data_raw[data_raw.length - 1].date.split('-');
      let endD = data_raw[0].date.split('-');
      
      let startDate = new Date(Number(strD[2]), Number(strD[0]) - 1, Number(strD[1]));
      let endDate = new Date(Number(endD[2]), Number(endD[0]) - 1, Number(endD[1]));
      
      this.trueStartDate = startDate;
      this.trueEndDate = endDate;	
      
      // now fire off our date array generator with our real dates
      let dateArr = this.getDateArray(startDate, endDate);
    
      // now we match our data to the array and give us a count of falsehoods
      let data = [];
      dateArr.forEach(function(d) {
        let todayDate = new Date(d).toISOString().slice(0,10).split("-");
        let modDate = Number(todayDate[1]) + '-' + Number(todayDate[2]) + '-' + todayDate[0];
    
        let num_lies = data_raw.filter(function(e) { return e.date == modDate });
        let obj:any = {};
        obj.date = d;
        obj.close = num_lies.length;
        data.push(obj);
      });

      this.chart(data);

    });
    // $("svg").css({ "background-color": "green" });
  }

  chart(data) {


      // format the data
      data.forEach((d:any) => {
      //   //d.date = parseTime(d.date);
      //   d.close = +d.close;
        this.data_line.push(d)
      });

    // set the ranges
    let x = d3.scaleTime().range([0, this.width]);
    let y = d3.scaleLinear().range([this.height, 0]).nice();

    let exX:any = d3.extent(data, (d:any) => { return d.date; });
    x.domain(exX);

    let maxY:any = d3.max(data, (d:any) => { return d.close; });
    y.domain([0, maxY]);

    let yAxis = d3.axisLeft(y).tickSize(3);
    let xAxis = d3.axisBottom(x).tickSize(3).ticks(20).tickFormat(d3.timeFormat("%b %y"));

    // define the line
    let valueline = d3.line()
    .x((d:any) => { return x(d.date); })
    .y((d:any) => { return y(d.close); })
    .curve(d3.curveStepAfter);

    // define the area
    let area = d3.area()
    .x((d:any) => { return x(d.date); })
    .y0(this.height)
    .y1((d:any) => { return y(d.close); })
    .curve(d3.curveStepAfter);


    // first up, the underlying area map
    this.svg.append("path")
      .data([data])
      .attr("class", "area")
      .attr("d", area);

  // now the valueline
    this.svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", (d) => { return valueline(d) });

    // Add the x axis
    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (this.height + this.buffer) + ")")
      .call(xAxis);

    // now the y
    this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (-this.buffer) + ",0)")
      .call(yAxis);


    
  }

  receiveFacet($event) {
    console.log($event)
  }

  getDateArray(start, end) {
    let arr = new Array();
    let dt = new Date(start);
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

  clicked(event:any) {
    console.log(event);
    d3.select(event.target)
      .append('circle')
      .attr('cx', event.x)
      .attr('cy', event.y)
      .attr('r', this.radius)
      .attr('fill', 'red')
  }

}


