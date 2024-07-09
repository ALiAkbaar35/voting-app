import { Component, OnInit } from '@angular/core';
import { PositionsService } from '../positions/positions.service';
import { CandidatesService } from '../candidates/candidates.service';
import { AppwriteService } from '../../appwrite.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
})
export class VotingComponent implements OnInit {
  positions: any[] = [];
  candidateId: any = '';
  user: any = {
    area: '',
  };

  constructor(
    private positionsService: PositionsService,
    private appwriteService: AppwriteService,
    private CandidatesService: CandidatesService
  ) {}

  ngOnInit(): void {
    this.userData();
  }
  reset() {
    this.candidateId = '';
    this.positions = [];
    this.user.area = '';
  }
  userData() {
    this.appwriteService
      .getUserData()
      .then((response: any) => {
        this.user = response;
        this.loadPositions();
      })
      .catch((error) => {
        console.error('Error fetching userData:', error);
      });
  }

  loadPositions(): void {
    this.positionsService
      .getPositions()
      .then((response) => {
          this.positions = response.documents.filter((position: any) => 
            position.area === this.user.area && 
            !position.users.some((user: any) => user.$id === this.user.$id)
          );
       
      })
      .catch((error) => {
        console.error('Error fetching positions:', error);
      });
  }
  
  submitVote(position: any): void {
    let candiadateData = {
      vote: this.candidateId.vote + 1,
    };
    const positionData = {
      users: position.users
        ? [...position.users, this.user.$id]
        : [this.user.$id],
    };

    if (this.candidateId) {
      this.positionsService
        .editPosition(position.$id, positionData)
        .then(() => {
          this.CandidatesService.updateCandidate(
            this.candidateId.$id,
            candiadateData
          )
            .then(() => {
              this.reset();
              this.loadPositions();
            })
            .catch((error) => {
              console.error('Error updating candidate:', error);
            });
        })
        .catch((error) => {
          console.error('Error editing position:', error);
        });
    } else {
      console.error('No candidate selected for position', position.name);
    }
  }
}
