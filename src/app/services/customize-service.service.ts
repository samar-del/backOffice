import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomizeServiceService {

  private customizationData: { [key: string]: any } = {};

  setCustomizationData(key: string, data: any): void {
    console.log(`Setting customization data for key: ${key}`, data);
    this.customizationData[key] = data;
  }

  getCustomizationData(key: string): any {
    const data = this.customizationData[key];
    console.log(`Getting customization data for key: ${key}`, data);
    return data;
  }
}
