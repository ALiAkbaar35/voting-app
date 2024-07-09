import { Component, OnInit } from '@angular/core';
import { PositionsService } from './positions.service';
import { AppwriteService } from '../../appwrite.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
})
export class PositionsComponent implements OnInit {
  role: string | null = null;
  isEdit: boolean = false;
  data: any = {
    name: 'DGM',
    level: 'District',
    area: 99,
  };
  errors: any = {
    name: '',
    level: '',
    area: '',
    err: '',
  };
  isDialogOpen: boolean = false;
  positions: any[] = [];

  constructor(
    private positionsService: PositionsService,
    private appwriteService: AppwriteService
  ) {}

  ngOnInit(): void {
    this.getRole();
    this.getPositions();
  }

  reset() {
    this.data = {
      name: '',
      level: '',
      area: '',
    };
    this.errors = {
      name: '',
      level: '',
      area: '',
      err: '',
    };
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

  deletePosition(id: string) {
    this.positionsService
      .deletePosition(id)
      .then(() => {
        this.getPositions();
      })
      .catch((error) => {
        console.error('Error deleting position:', error);
      });
  }

  openDialog() {
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.reset();
  }
  validateForm() {
    let isValid = true;

    if (
      !this.data.name ||
      this.data.name.length < 3 ||
      this.data.name.length > 20 ||
      !this.data.name.match(/^[a-zA-Z\s]+$/)
    ) {
      this.errors.name =
        'Name should be between 3 and 20 characters of letters';
      isValid = false;
    } else {
      this.errors.name = '';
    }

    if (
      !this.data.level ||
      this.data.level.length < 3 ||
      this.data.level.length > 20 ||
      !this.data.level.match(/^[a-zA-Z\s]+$/)
    ) {
      this.errors.level =
        'level should be between 3 and 20 characters of letters';
      isValid = false;
    } else {
      this.errors.level = '';
    }
    if (!this.data.area || this.data.area <= 0) {
      this.errors.area = 'Area should be greater than 0';
      isValid = false;
    } else {
      this.errors.area = '';
    }

    return isValid;
  }

  onSubmit(data: any) {
    if (!this.validateForm()) {
      return;
    } else {
      const exists = this.positions.some((position) => {
        return (
          position.area === data.area &&
          position.name.toLowerCase() === data.name.toLowerCase() &&
          position.level.toLowerCase() === data.level.toLowerCase()
        );
      });

      if (exists) {
        alert('Combination already exists!');
      } else {
        this.positionsService
          .createPosition(data)
          .then(() => {
            this.getPositions();
            this.isDialogOpen = false;
            this.reset();
          })
          .catch((error) => {
            this.errors.err =
              error.message || 'An error occurred while creating the position.';
            console.error('Error creating position:', error);
          });
      }
    }
  }

  editDialog(position: any) {
    this.data = position;
    this.isEdit = true;
    this.isDialogOpen = true;
  }
  onEdit(data: any) {
    if (!this.validateForm()) {
      return;
    } else {
      const exists = this.positions.some((position) => {
        return (
          position.area === data.area &&
          position.name.toLowerCase() === data.name.toLowerCase() &&
          position.level.toLowerCase() === data.level.toLowerCase() &&
          position.$id !== data.$id
        );
      });

      if (exists) {
        alert('Combination already exists!');
      } else {
        let UpdatedData = {
          name: data.name,
          level: data.level,
          area: data.area,
        };
        this.positionsService
          .editPosition(data.$id, UpdatedData)
          .then(() => {
            this.getPositions();
            this.isDialogOpen = false;
            this.reset();
          })
          .catch((error) => {
            this.errors.err = error.message || 'An error occurred while editing the position.';
            console.error('Error editing position:', error);
          });
      }
    }
  }
}
