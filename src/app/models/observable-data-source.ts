import { IDisposable } from "./idisposable";
import DataSource from "devextreme/data/data_source";
import { Observable, Subject, Subscription } from "rxjs";
import { first, skip } from "rxjs/operators";
import { IObservableStoreOptions } from "./iobservable-store-options";

export class ObservableDataSource extends DataSource implements IDisposable {
  public reloaded$: Observable<any>;
  public disposed$: Observable<any>;
  private _reloadedSubject = new Subject<any>();
  private _disposedSubject = new Subject<any>();
  private _subscriptions: Subscription[] = [];
  private _options: any;

  constructor(private _observableOptions: IObservableStoreOptions) {
    super(ObservableDataSource.mergeOptions(_observableOptions, () => this));
    this.reloaded$ = this._reloadedSubject.asObservable();
    this.disposed$ = this._disposedSubject.asObservable();
  }

  public get options(): any {
    return this._options;
  }

  public get observableOptions(): IObservableStoreOptions {
    return this._observableOptions;
  }

  public clone(): ObservableDataSource {
    return new ObservableDataSource(this._observableOptions);
  }

  public dispose(): void {
    this.unsubscribeAll();
    super.dispose();
    this._disposedSubject.next(null);
    this._reloadedSubject.complete();
    this._disposedSubject.complete();
  }

  public loadOptions(): any {
    const result = super.loadOptions();
    if (this.paginate()) {
      result.take = this.pageSize();
    }
    return result;
  }

  private static mergeOptions(
    options: IObservableStoreOptions,
    thisAccessor: () => ObservableDataSource
  ): any {
    const config = Object.assign({}, options as any);

    // Map observable properties back to promises.
    if (options.load) {
      config.load = (loadOptions: any) =>
        new Promise((resolve, reject) => {
          const self = thisAccessor();
          const result = options.load(loadOptions);
          result.pipe(first()).subscribe({
            next: (r) => resolve(r),
            error: (r) => reject(r.error),
          });

          self.unsubscribeAll();
          self._subscriptions.push(
            result.pipe(skip(1)).subscribe({
              next: (r) => {
                if (self.isLoading() && (self as any).cancelAll) {
                  (self as any).cancelAll();
                }
                self.reload().then(() => self._reloadedSubject.next(r));
              },
            })
          );
        });

      if (options.byKey) {
        config.byKey = (key: any) =>
          options.byKey(key).pipe(first()).toPromise();
      }

      if (options.update) {
        //TODO: "fix this line code"
        console.error("fix this line code");
        //config.update = (key: any, values: any) => options.update(key, values).pipe(first()).toPromise();
      }

      // So the constructor finishes initializing
      setTimeout(() => {
        thisAccessor()._options = config;
      }, 100);

      return config;
    }
  }

  private unsubscribeAll(): void {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }
}
