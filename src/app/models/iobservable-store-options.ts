import { Observable } from "rxjs";
import { CustomStoreOptions } from "devextreme/data/custom_store";
import { LoadOptions } from "devextreme/data/load_options";
import { DataSourceOptions } from "devextreme/data/data_source";

export interface IObservableStoreOptions
  extends Omit<CustomStoreOptions, "load" | "byKey">,
    DataSourceOptions {
  /** Specifies a custom implementation of the load(options) method. */
  load?: (options: LoadOptions) => Observable<any>;

  /** Specifies a custom implementation of the byKey(key) method. */
  byKey?: (key: any | string | number) => Observable<any>;
}
