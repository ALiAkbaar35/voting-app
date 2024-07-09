import { Component, OnInit } from '@angular/core';
import { PositionsService } from '../positions/positions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  positions: any[] = [];

  constructor(private positionsService: PositionsService) {}

  ngOnInit(): void {
    this.loadPositions();
  }

loadPositions(): void {
  this.positionsService
    .getPositions()
    .then((response) => {
      this.positions = response.documents.map((position: any) => {
        
        position.candidates.sort((a: any, b: any) => b.vote - a.vote);
        position.candidates = position.candidates.length > 0 ? position.candidates[0] : null;
        return position;
      }).filter((position: any) => position.candidates !== null);
      console.log('Positions loaded:', this.positions);
    })
    .catch((error) => {
      console.error('Error fetching positions:', error);
    });
}

  


  


}
