import { Injectable } from "@angular/core";
import { LoadOptions } from "devextreme/data/load_options";
import { Observable, of } from "rxjs";
import { IPagedList } from "./models";

@Injectable({
  providedIn: "root"
})
export class DataService {
  public createData(count: number): any[] {
    const items: any[] = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        entityId: "Color",
        description: "Color",
        sequence: i * 10,
        nestedObject: { nestedProperty: i }
      });
    }
    return items;
  }

  public observableData(loadOptions: LoadOptions): Observable<IPagedList<any>> {
    // Some http call here normally
    const pagedList = {} as IPagedList<any>;
    if (loadOptions.requireTotalCount) {
      pagedList.totalCount = 1000;
    }

    const items: any[] = [];
    for (
      let i = loadOptions.skip;
      i < loadOptions.skip + loadOptions.take;
      i++
    ) {
      items.push({
        id: i,
        entityId: "Color",
        description: "Color",
        sequence: i * 10,
        nestedObject: { nestedProperty: i }
      });
    }

    pagedList.data = items;
    return of(pagedList);
  }

  public get(key: any): Observable<any> {
    // Some http call here normally
    return of({
        id: key,
        entityId: "Color",
        description: "Color"
      });
  }
}
