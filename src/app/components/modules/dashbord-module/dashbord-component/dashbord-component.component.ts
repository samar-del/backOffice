import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashbord-component',
  templateUrl: './dashbord-component.component.html',
  styleUrls: ['./dashbord-component.component.css']
})
export class DashbordComponentComponent implements OnInit {
  public chart: any;

  constructor() { }

  ngOnInit(): void {
   this.createChart();
  }

  createChart(){
    this.chart = new Chart("canvas", {
      type: 'bar', // Cela indique le type de graphique

      data: {// valeurs sur l'axe X
        labels: ['Region A', 'Region B', 'Region C', 'Region D', 'Region E'],
	       datasets: [
          {
            label: "Nombre d'utilisateurs",
            data: [467, 576, 572, 79, 92],
            backgroundColor: 'blue'
          }
        ]
      },

    });

  }
}
