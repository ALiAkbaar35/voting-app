import { Injectable } from '@angular/core';
import { AppwriteService } from '../../appwrite.service';
import { Query, ID } from 'appwrite';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  constructor(private appwriteService: AppwriteService) {}

  getCandidates() {
    let promise = this.appwriteService.database.listDocuments(
      '6683d68900214da9daf7',
      '66855253000b2ff71b4e'
      // [Query.orderAsc('position')]
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

  createCandidate(data: any) {
    let promise = this.appwriteService.database.createDocument(
      '6683d68900214da9daf7',
      '66855253000b2ff71b4e',
      ID.unique(),
      data
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

  deleteCandidate(id: string) {
    let promise = this.appwriteService.database.deleteDocument(
      '6683d68900214da9daf7',
      '66855253000b2ff71b4e',
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
  updateCandidate(id: string, data: any) {
    let promise = this.appwriteService.database.updateDocument(
      '6683d68900214da9daf7',
      '66855253000b2ff71b4e',
      id,
      data
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

  

}
