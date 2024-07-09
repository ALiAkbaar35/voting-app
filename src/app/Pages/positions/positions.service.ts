import { Injectable } from '@angular/core';
import { AppwriteService } from '../../appwrite.service';
import { Query,ID } from 'appwrite';

@Injectable({
  providedIn: 'root',
})
export class PositionsService {
  positions: any[] = [];

  constructor(private appwriteService: AppwriteService) {}

  getPositions() {
    let promise = this.appwriteService.database.listDocuments(
      '6683d68900214da9daf7',
      '6684fdde0011d491f632',[
        Query.orderAsc('area'),
    ]
    );

    promise.then(
      (response) => {
        console.log('Successfully downloaded');
      },
      (error) => {
        console.log('Error:', error);
      }
    );

    return promise;
  }

  deletePosition(id: string) {
    let promise = this.appwriteService.database.deleteDocument(
      '6683d68900214da9daf7',
      '6684fdde0011d491f632',
      id
    );
    promise.then(
      (response) => {
        console.log('Successufully deleted');
      },
      (error) => {
        console.log('Error:', error);
      }
    );
    return promise;
  }

  createPosition(data: any) {
    let promise = this.appwriteService.database.createDocument(
      '6683d68900214da9daf7',
      '6684fdde0011d491f632',
      ID.unique(),
      data
    );
    promise.then(
      (response) => {
        // this.getPositions();
        console.log('Successufully added');
      },
      (error) => {
        console.log('Error:', error);
      }
    );
    return promise;
  }

  editPosition(id: string, data: any) {
    
    let promise = this.appwriteService.database.updateDocument(
      '6683d68900214da9daf7',
      '6684fdde0011d491f632',
      id,
      data
    );
    promise.then(
      (response) => {
        console.log('Successufully edited');
      },
      (error) => {
        console.log('Error:', error);
      }
    );
    return promise;
  }

  
}
