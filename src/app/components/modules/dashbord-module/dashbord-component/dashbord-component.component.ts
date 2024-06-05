import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { UserService } from 'src/app/Modules/user/services/user.service';

@Component({
  selector: 'app-dashbord-component',
  templateUrl: './dashbord-component.component.html',
  styleUrls: ['./dashbord-component.component.css']
})
export class DashbordComponentComponent implements OnInit {
  public chart: any;
    public roleChart: any;


  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.userService.getUserAddressesCount().subscribe(userAddressCounts => {
      this.createChart(userAddressCounts);
    });
    this.userService.getUserRolesCount().subscribe(userRoleCounts => {
      this.createRoleChart(userRoleCounts);
    });
  }

  createChart(userAddressCounts: { [key: string]: number }) {
    this.chart = new Chart("canvas", {
      type: 'bar', // Cela indique le type de graphique
      data: {// valeurs sur l'axe X
        labels: Object.keys(userAddressCounts),
        datasets: [
          {
            label: "Nombre d'utilisateurs",
            data: Object.values(userAddressCounts),
            backgroundColor:'rgba(54, 162, 235, 0.2)',  // Bleu

          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  createRoleChart(userRoleCounts: { [key: string]: number }) {
    const colors = [
      'rgba(255, 99, 132, 0.2)',  // Rouge
      'rgba(54, 162, 235, 0.2)',  // Bleu
      'rgba(255, 206, 86, 0.2)',  // Jaune
      'rgba(75, 192, 192, 0.2)',  // Vert
      'rgba(153, 102, 255, 0.2)', // Violet
      'rgba(255, 159, 64, 0.2)',  // Orange
      // Ajoutez plus de couleurs si nécessaire
    ];

    const borderColor = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      // Ajoutez plus de bordures si nécessaire
    ];
    this.roleChart = new Chart("roleCanvas", {
      type: 'pie', // Cela indique le type de graphique
      data: {// valeurs sur l'axe X
        labels: Object.keys(userRoleCounts),
        datasets: [
          {
            label: "Nombre d'utilisateurs",
            data: Object.values(userRoleCounts),
            backgroundColor: colors,
            borderColor: borderColor,
            borderWidth: 1
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }
}
