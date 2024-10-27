import { Component } from '@angular/core';
import { LoadOptions } from 'devextreme/data/load_options';
import { DataService } from './data.service';
import { IObservableStoreOptions, ObservableDataSource } from './models';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  public data: any[];
  public observableData: ObservableDataSource;

  constructor(private _dataService: DataService) {
    this.data = _dataService.createData(10000);
    this.observableData = new ObservableDataSource(this.createStoreOptions());
  }

  private createStoreOptions(): IObservableStoreOptions {
    return {
      key: 'id',
      load: (loadOptions: LoadOptions) => {
        return this._dataService.observableData(loadOptions);
      },
      byKey: (key: any) => this._dataService.get(key)
    };
  }
}
