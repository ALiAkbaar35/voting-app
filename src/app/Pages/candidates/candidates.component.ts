import { Component, OnInit } from '@angular/core';
import { AppwriteService } from '../../appwrite.service';
import { CandidatesService } from './candidates.service';
import { PositionsService } from '../positions/positions.service';
import { iif } from 'rxjs';
@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.css',
})
export class CandidatesComponent implements OnInit {
  role: string | null = null;
  isDialogOpen: boolean = false;
  isEdit: boolean = false;
  EditID: string = '';
  candidates: any[] = [];
  Rawdata: any[] = [];
  positions: any[] = [];
  errors: any = {
    name: '',
    party: '',
    position: '',
    age: '',
    err:'',
  }
  data: any = {
    name: '',
    party: '',
    position: '',
    age: '',
  };
  constructor(
    private appwriteService: AppwriteService,
    private CandidatesService: CandidatesService,
    private positionsService: PositionsService
  ) {}
  ngOnInit(): void {
    this.getRole();
    this.getCandidates();
    this.getPositions();
  }
  getRole() {
    this.appwriteService
      .getAccount()
      .then((response) => {
        this.role = response.labels[0];
      })
      .catch((error) => {
        console.error('Error fetching role:', error);
      });
  }
  reset() {
    this.data = {
      name: '',
      party: '',
      position: '',
      age: '',
    };
    this.errors = {
      name: '',
      party: '',
      position: '',
      age: '',
      err:'',
    };
  }
  getPositions() {
    this.positionsService
      .getPositions()
      .then((response) => {
        this.positions = response.documents;
      })
      .catch((error) => {
        console.error('Error fetching positions:', error);
      });
  }
  getCandidates() {
    this.CandidatesService.getCandidates()
      .then((response) => {
        this.Rawdata = response.documents;
        this.groupCandidatesByPosition(response.documents);
      })
      .catch((error) => {
        console.error('Error fetching candidates:', error);
      });
  }
  groupCandidatesByPosition(candidates: any[]) {
    this.candidates = candidates.reduce((groups, candidate) => {
      const key = `${candidate.position.name}_${candidate.position.area}_${candidate.position.level}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(candidate);
      return groups;
    }, {});
  }
  closeDialog() {

    console.log("role",this.role)
    this.isDialogOpen = false;
    this.isEdit = false;
    this.reset();
  }
  validateForm() {
    let isValid = true;

    if (!this.data.name || this.data.name.length < 3 || this.data.name.length > 20 || !this.data.name.match(/^[a-zA-Z\s]+$/)) {
      this.errors.name = 'Name should be between 3 and 20 characters of letters';
      isValid = false;
    } else {
      this.errors.name = '';
    }

    if (!this.data.party || this.data.party.length < 3 || this.data.party.length > 20 || !this.data.party.match(/^[a-zA-Z\s]+$/)) {
      this.errors.party = 'Party should be between 3 and 20 characters of letters';
      isValid = false;
    } else {
      this.errors.party = '';
    }

    if (!this.data.position) {
      this.errors.position = 'Position is required';
      isValid = false;
    } else {
      this.errors.position = '';
    }

    if (!this.data.age) {
      this.errors.age = 'Age is required';
      isValid = false;
    } else {
      this.errors.age = '';
    }

    return isValid;
  }
  onSubmit() {
    if(!this.validateForm()){
      return;

    }
    else{
    const existingCandidate = this.Rawdata.find((candidate) => {
      return (
        candidate &&
        candidate.party.toLowerCase() === this.data.party.toLowerCase() &&
        candidate.position.$id.toLowerCase() ===
          this.data.position.toLowerCase()
      );
    });

    if (existingCandidate) {
      console.log('Error: Candidate already exists.');
    } else {
      this.CandidatesService.createCandidate(this.data)
        .then(() => {
          this.getCandidates();
          this.isDialogOpen = false;
          this.reset();
        })
        .catch((error) => {
          this.errors.err = error.message || 'An error occurred while creating the candidate.';
          console.error('Error creating candidate:', error);
        });
    }
  }
  }
  deleteCandidate(id: string) {
    this.CandidatesService.deleteCandidate(id)
      .then(() => {
        this.getCandidates();
      })
      .catch((error) => {
        console.error('Error deleting candidate:', error);
      });
  }
  openDialog() {
    this.isDialogOpen = true;
  }
  editDialog(data: any) {
    this.isDialogOpen = true;
    this.isEdit = true;
    this.data = {
      id: data.$id,
      name: data.name,
      party: data.party,
      position: data.position.$id,
      age: new Date(data.age).toISOString().slice(0, 10),
    };
  }

  date(date: string) {
    return new Date(date).toLocaleDateString();
  }
  onEdit(data: any) {
    if(!this.validateForm()){
      return;
    }
    else{
    const existingCandidate = this.Rawdata.find((candidate) => {
      return (
        candidate &&
        candidate.party.toLowerCase() === this.data.party.toLowerCase() &&
        candidate.position.$id.toLowerCase() ===
          this.data.position.toLowerCase() &&
          candidate.$id !== data.id
      );
    });

    if (existingCandidate) {
      console.log('Error: Candidate already exists.');
    } else {
    let updateData = {
      name: data.name,
      party: data.party,
      position: data.position,
      age: data.age,
    };
    this.CandidatesService.updateCandidate(data.id, updateData)
      .then(() => {
        this.getCandidates();
        this.isDialogOpen = false;
        this.isEdit = false;
        this.reset();
      })
      .catch((error) => {
        this.errors.err = error.message || 'An error occurred while updating the candidate.';
        console.error('Error updating candidate:', error);
      });}
  }}
}
