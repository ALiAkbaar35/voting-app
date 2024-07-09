import { Injectable } from '@angular/core';
import * as Appwrite from 'appwrite';
import { Client, Databases, ID } from 'appwrite';

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  database: Appwrite.Databases;
  client: Appwrite.Client;
  account: Appwrite.Account;
  User: any = null;

  constructor() {
    this.client = new Appwrite.Client();
    this.client
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('66827dd1000b91b47755');
    this.database = new Appwrite.Databases(this.client);
    this.account = new Appwrite.Account(this.client);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.User = JSON.parse(storedUser);
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await this.account.createEmailPasswordSession(
        email,
        password
      );
      this.User = response;
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } catch (error) {
      console.error('Appwrite login error:', error);
      throw error;
    }
  }

  async register(data: any) {
    try {
      const response = await this.account.create(
        data.nationalId,
        data.email,
        data.password,
        data.name
      );
      this.User = response;
      localStorage.setItem('user', JSON.stringify(response));
      await this.registerUser(data);
      return response;
    } catch (error) {
      console.error('Appwrite registration error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSession('current');
      this.User = null;
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Appwrite logout error:', error);
      throw error;
    }
  }

  getUser(): any {
    return this.User;
  }

  async registerUser(data: any) {
    const promise = this.database.createDocument(
      '6683d68900214da9daf7',
      '6683d6d6002566548db1',
      data.nationalId,
      {
        fullName: data.fullName,
        nationalId: data.nationalId,
        address: data.address,
        area: data.area,
        DOB: data.DOB,
        email: data.email,
        password: data.password,
      }
    );

    promise
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  async getAccount() {
    try {
      const response = await this.account.get();
      return response;
    } catch (error) {
      console.error('Appwrite getAccount error:', error);
      throw error;
    }
  }
  async getUserData() {
    try {
      const response = await this.database.getDocument(
        '6683d68900214da9daf7',
        '6683d6d6002566548db1',
        this.User.userId
      );
      return response;
    } catch (error) {
      console.error('Appwrite getUserData error:', error);
      throw error;
    }
  }
  async updateData(data: any) {
    try {
      const response = await this.database.updateDocument(
        '6683d68900214da9daf7',
        '6683d6d6002566548db1',
        this.User.userId,
        data
      );
      return response;
    } catch (error) {
      console.error('Appwrite updateData error:', error);
      throw error;
    }
  }
}
