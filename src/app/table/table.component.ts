import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import DevExpress from 'devextreme';
import {
  DxTemplateDirective,
  DxTemplateHost,
  IDxTemplateHost,
  INestedOptionContainer,
  NestedOptionHost,
} from 'devextreme-angular/core';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import DataSource from 'devextreme/data/data_source';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IColumnContainer } from '../models/icolumn-container';
import { ColumnComponent } from './column.component';
import { IEntity } from '../models/ientity';

@Component({
  selector: 'exp-table',
  templateUrl: './table.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [DxTemplateHost, NestedOptionHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent
  implements
    OnDestroy,
    AfterViewInit,
    INestedOptionContainer,
    IDxTemplateHost,
    IColumnContainer
{
  @Input() public uniqueId: string;
  @Input() public keyExpr: string = 'id';
  @Input() public pageSize: number = 100;
  @Input() public contextMenuTemplate: TemplateRef<any>;
  @Input() public editable = false;
  @Input() public editMode: 'batch' | 'cell' | 'row' = 'cell';
  @Input() public showBorders = false;
  @Input() public showColumnLines = false;
  @Input() public showColumnHeaders = true;
  @Input() public showRowLines = false;
  @Input() public showSelection: boolean;
  @Input() public selectMode: 'none' | 'single' | 'multiple' = 'multiple';
  @Input() public checkboxesMode: 'always' | 'none' | 'onClick' | 'onLongTap' =
    'onClick';
  @Input() public allowSelectAll = true;
  @Input() public selectAllMode: 'allPages' | 'page' = 'allPages';
  @Input() public selectedRowKeys: any[];
  @Input() public disabled = false;
  @Input() public repaintChangesOnly = false;
  @Input() public allowColumnResizing = true;
  @Input() public allowAdding = false;
  @Input() public allowUpdating = true;
  @Input() public allowDeleting = false;
  @Input() public confirmDelete = false;
  @Input() public allowReordering = false;
  @Input() public showDragIcons = true;
  @Input() public onReorder: (e: any) => void;
  @Input() public loadPanelEnabled = true;
  @Input() public grouped = false;
  @Input() public groupPanelVisible = false;
  @Input() public autoExpandGroups = false;
  @Input() public sortMode: 'none' | 'single' | 'multiple' = 'none';
  @Input() public showSortIndexes = true;
  @Input() public allowColumnFixing = false;
  @Input() public customizeColumns: (columns: ColumnComponent[]) => void;
  @Input() public showSearchPanel = false;
  @Input() public dragDirection: 'both' | 'horizontal' | 'vertical' =
    'vertical';
  @Input() public editOnKeyPress = true;
  @Input() public enterKeyAction: 'startEdit' | 'moveFocus' = 'startEdit';
  @Input() public enterKeyDirection: 'none' | 'column' | 'row' = 'row';
  @Input() public remoteOperations:
    | boolean
    | {
        filtering?: boolean;
        grouping?: boolean;
        groupPaging?: boolean;
        paging?: boolean;
        sorting?: boolean;
        summary?: boolean;
      };

  @Input() public editTexts: {
    addRow?: string;
    cancelAllChanges?: string;
    cancelRowChanges?: string;
    confirmDeleteMessage?: string;
    confirmDeleteTitle?: string;
    deleteRow?: string;
    editRow?: string;
    saveAllChanges?: string;
    saveRowChanges?: string;
    undeleteRow?: string;
    validationCancelChanges?: string;
  } = {};

  @Output() public editStart = new EventEmitter<any>();
  @Output() public editorPreparing = new EventEmitter<any>();
  @Output() public editorPrepared = new EventEmitter<any>();
  @Output() public initNewRow = new EventEmitter<any>();
  @Output() public rowUpdated = new EventEmitter<any>();
  @Output() public rowInserted = new EventEmitter<any>();
  @Output() public rowRemoved = new EventEmitter<any>();
  @Output() public rowInserting = new EventEmitter<any>();
  @Output() public rowPrepared = new EventEmitter<any>();
  @Output() public cellPrepared = new EventEmitter<any>();
  @Output() public cellClick = new EventEmitter<any>();
  @Output() public doubleClickRow = new EventEmitter<any>();
  @Output() public selectedRowKeysChange = new EventEmitter<any[]>();
  @Output() public validating = new EventEmitter<any>();
  @Output() public contentReady = new EventEmitter<any>();
  @Output() public showFilterChange = new EventEmitter<any>();
  @Output() public contextMenuPrepairing = new EventEmitter<any>();
  @Output() public validityChanged = new EventEmitter<boolean>();
  @Output() public dirtyChanged = new EventEmitter<boolean>();
  @Output() public focusedCellChanging = new EventEmitter<any>();

  public optionChangedHandlers: EventEmitter<any>;
  public removedOptions: string[];
  public defaultSourceTypes = [
    { display: 'Match', value: 'Match' },
    { display: 'List', value: 'List' },
  ];

  public initialSelectedKeys: any[];
  public contextMenuButton: any;
  public selectionFilter: any;
  public editData: any[] = [];
  public searchPanelText: string;
  public isDataSource = false;

  private _data: IEntity[] | DevExpress.data.DataSource | any;
  private _dataGrid: DxDataGridComponent;
  private _pendingTemplates: DxTemplateDirective[] = [];
  private _contentColumns: QueryList<ColumnComponent>;
  private _hasPendingColumns = false;
  private _changes: { [key: string]: IEntity } = {};
  private _isDirty = false;
  private _showFilter = false;
  private _columnChangesSubscription: Subscription;
  private _refreshColumnTimeout: any;
  private _isValid = true;
  private _focusedRowKey: any;
  private _focusedRowIndex: number;
  private _destroyedSubject = new Subject<any>();

  constructor(
    private _optionHost: NestedOptionHost,
    private _templateHost: DxTemplateHost,
    private _renderer: Renderer2,
    private _cdr: ChangeDetectorRef
  ) {
    this.optionChangedHandlers = new EventEmitter<any>();
    this._optionHost.setHost(this);
    this._templateHost.setHost(this);
  }

  public set focusedRowKey(value: any) {
    this._focusedRowKey = value;
  }

  public get focusedRowKey(): any {
    return this._focusedRowKey;
  }

  public set focusedRowIndex(value: number) {
    this._focusedRowIndex = value;
  }

  public get focusedRowIndex(): number {
    return this._focusedRowIndex;
  }

  @Input() public set data(value: IEntity[] | DataSource | any) {
    this._data = value;
    this.isDataSource = value instanceof DataSource;
  }

  public get data(): IEntity[] | DataSource | any {
    return this._data;
  }

  @ViewChild('dataGrid') public set dataGrid(value: DxDataGridComponent) {
    this._dataGrid = value;
    if (this._dataGrid) {
      setTimeout(() => {
        this.setGridColumns(true);
      }, 1);
    }
  }

  public get dataGrid(): DxDataGridComponent {
    return this._dataGrid;
  }

  @ContentChildren(ColumnComponent, { descendants: false })
  public set contentColumns(columns: QueryList<ColumnComponent>) {
    this._contentColumns = columns;
    this._hasPendingColumns = true;
    if (this._columnChangesSubscription) {
      this._columnChangesSubscription.unsubscribe();
    }

    if (this._contentColumns) {
      this._columnChangesSubscription = this._contentColumns.changes
        .pipe(takeUntil(this._destroyedSubject))
        .subscribe({
          next: () => {
            this._hasPendingColumns = true;
            // as new columns come into place, they may add more templates
            this.setGridTemplates();
            this.setGridColumns();
          },
        });
    }

    this.setGridColumns();
  }

  public get contentColumns(): QueryList<ColumnComponent> {
    return this._contentColumns;
  }

  public get instance(): any {
    return this.dataGrid?.instance;
  }

  public get isLinked(): boolean {
    return this.dataGrid.isLinked;
  }

  public get removedNestedComponents(): string[] {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return this.dataGrid.instance['removedNestedComponents'];
  }

  public get recreatedNestedComponents(): any[] {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return this.dataGrid.instance['recreatedNestedComponents'];
  }

  public set isDirty(value: boolean) {
    if (value !== this._isDirty) {
      this._isDirty = value;
      this.dirtyChanged.emit(this._isDirty);
    }
  }

  public get isDirty(): boolean {
    return this._isDirty;
  }

  public get isValid(): boolean {
    return this._isValid;
  }

  @Input() public set showFilter(value: boolean) {
    this._showFilter = value;
    this.showFilterChange.emit(this._showFilter);
    this._cdr.markForCheck();
  }

  public get showFilter(): boolean {
    return this._showFilter;
  }

  public get changes(): { [key: string]: IEntity } {
    return this._changes;
  }

  public get changesArray(): IEntity[] {
    const values: IEntity[] = [];
    Object.keys(this._changes).forEach((key) => {
      values.push(this._changes[key]);
    });
    return values;
  }

  public get filterValue(): any {
    return this.dataGrid?.filterValue;
  }

  public get columnsController(): any {
    return this.instance?._controllers.columns;
  }

  public get dataController(): any {
    return this.instance?._controllers.data;
  }

  public get editingController(): any {
    return this.instance?._controllers.editing;
  }

  public get focusController(): any {
    return this.instance?._controllers.focus;
  }

  public get keyboardNavigationController(): any {
    return this.instance?._controllers.keyboardNavigation;
  }

  public get selectionController(): any {
    return this.instance?._controllers.selection;
  }

  public get validatingController(): any {
    return this.instance?._controllers.validating;
  }

  public ngOnDestroy(): void {
    this._destroyedSubject.next(null);
    this._destroyedSubject.complete();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.dataGrid && this.initialSelectedKeys?.length) {
        this.dataGrid.instance.selectRows(this.initialSelectedKeys, false);
        this.initialSelectedKeys = null;
      }
    }, 1);
  }

  public resetOptions = (collectionName?: string): void =>
    this.dataGrid?.resetOptions(collectionName);
  public isRecreated = (name: string): boolean =>
    this.dataGrid?.isRecreated(name);

  public setTemplate(template: DxTemplateDirective): void {
    this._pendingTemplates.push(template);
  }

  public onRowUpdated(event: any): void {
    if (!this.editable) {
      return;
    }
    this._changes[event.key] = event.data;
    this.isDirty = true;
    this.rowUpdated.emit(event);
    this._cdr.markForCheck();
  }

  public onRowInserted(event: any): void {
    if (!this.editable) {
      return;
    }
    this._changes[event.key] = event.data;
    this.isDirty = true;
    this.rowInserted.emit(event);
    this._cdr.markForCheck();
  }

  public onRowRemoved(event: any): void {
    if (!this.editable) {
      return;
    }
    this._changes[event.key] = null;
    this.isDirty = true;
    this.rowRemoved.emit(event);
    this._cdr.markForCheck();
  }

  public onRowValidating(event: any): void {
    this.validating.emit(event);
  }

  public onCellClick(e: any): void {
    if (
      this.showSelection &&
      this.selectMode === 'multiple' &&
      this.selectionController.isSelectionWithCheckboxes() &&
      e.rowType === 'data' &&
      !e.event?.ctrlKey &&
      !e.event?.shiftKey &&
      !(e.cellElement?.className?.indexOf('dx-command-select') >= 0)
    ) {
      // If the user is in multi-select mode, and they click on a cell that isn't the checkbox, leave multi-select mode
      // This is to fix bug #19485
      this.selectionController.stopSelectionWithCheckboxes();
    }
    this.cellClick.emit(e);
  }

  public onInitialized(dataGrid: DxDataGridComponent): void {
    this.dataGrid = dataGrid;
    this.setGridTemplates();
  }

  public onInitNewRow(e: any): void {
    this.scrollToTop();
    this._contentColumns.forEach((column) => {
      if (column.defaultValue !== undefined && column.dataField) {
        if (column.defaultValue instanceof Function) {
          e.data[column.dataField] = column.defaultValue(e.data);
        } else {
          e.data[column.dataField] = column.defaultValue;
        }
      }
    });

    this.initNewRow.emit(e);
  }

  public onRowPrepared(event: any): void {
    // since data might be lazy loaded from the server, event.data will not always be populated
    // these attributes are used for automation testing only
    if (event.data) {
      if (event.rowType === 'group') {
        this._renderer.setAttribute(
          event.rowElement,
          'group-ex-key',
          event.data.key
        );
      } else if (event.rowType === 'data') {
        this._renderer.setAttribute(
          event.rowElement,
          'data-ex-key',
          event.data[this.keyExpr]
        );
        this._renderer.setAttribute(
          event.rowElement,
          'data-ex-name',
          event.data.entityId || event.data.name
        );
      }
    }
    this.rowPrepared.emit(event);
  }

  public onEditorPrepared(e: any): void {
    // This is to fix bug #19606. Dev extreme has a behavior where if you're currently editing a cell, and you click on a checkbox,
    // it will stop the current edit rather than trigger a value change for the checkbox.
    if (
      !e.type &&
      e.dataType === 'boolean' &&
      e.editorElement &&
      !e.hasMouseDownListener &&
      !e.editorOptions?.disabled
    ) {
      e.editorElement.addEventListener('mousedown', (ev: MouseEvent) => {
        if (ev.button === 0) {
          const previousValue = e.value;
          setTimeout(() => {
            // check to see if the value was updated by dev extreme (they handled the checkbox event)
            const editing = this.editingController.option('editing');
            if (
              editing.changes &&
              editing.changes.length &&
              editing.editRowKey
            ) {
              const change = editing.changes.find(
                (x: any) => x.key === editing.editRowKey
              );
              if (change) {
                const newValue = change.data[e.name];
                if (newValue !== previousValue) {
                  return;
                }
              }
            }

            // If dev extreme didn't change the value, let's update it.
            if (e.setValue) {
              e.setValue(!previousValue);
            }
          }, 10);
        }
      });
      e.hasMouseDownListener = true;
    }
    this.editorPrepared.emit(e);
  }

  public clearChanges(): void {
    this._changes = {};
    this.dataGrid?.instance?.cancelEditData();
    this.isDirty = false;
    this._cdr.markForCheck();
  }

  public onKeyDown(e: any): void {
    switch (e.event.keyCode) {
      case 13: // enter
        if (this.showSelection && this.focusedRowKey) {
          e.handled = true;
          this.dataGrid.instance.selectRows([this.focusedRowKey], false);
        }
        break;
      case 27: // escape
        if (this.showSelection && this.selectedRowKeys?.length) {
          e.handled = true;
          this.dataGrid.instance.clearSelection();
        }
        break;
      case 38: // Up Arrow
        if (e.event.altKey) {
          e.handled = true;
          e.event.stopPropagation();
          this.previousItem();
        }
        break;
      case 40: // Down Arrow
        if (e.event.altKey) {
          e.handled = true;
          e.event.stopPropagation();
          this.nextItem();
        }
        break;

      default:
        break;
    }
  }

  public repaint(): void {
    try {
      this.dataGrid?.instance?.repaint();
    } catch (e) {}
  }

  public async refreshAsync(): Promise<void> {
    try {
      await this.dataGrid?.instance?.refresh();
      this.clearChanges();
    } catch (e) {}
  }

  public addRow(): void {
    try {
      this.closeEditCell();
      setTimeout(() => {
        this.dataGrid?.instance?.addRow();
      }, 10);
    } catch (e) {}
  }

  public closeEditCell(): void {
    try {
      this.focus();
    } catch (e) {}
  }

  public focus(): void {
    try {
      this.instance?.focus();
    } catch (e) {}
  }

  public clearFilter(): void {
    try {
      if (this.dataGrid) {
        this.dataGrid.filterValue = null;
        this._cdr.markForCheck();
      }
    } catch (e) {}
  }

  public refreshGridColumns(): void {
    // NOTE: In most cases you shouldn't need to do this anymore, because column.component
    // is setup to send any model binding changes to the grid
    clearTimeout(this._refreshColumnTimeout);
    this._refreshColumnTimeout = setTimeout(() => {
      this._hasPendingColumns = true;
      this.setGridColumns();
    }, 50);
  }

  public async onContentReadyAsync(e: any): Promise<void> {
    const keys = Object.keys(this._changes);
    if (e.component.hasEditData() || keys.length > 0) {
      this.isDirty = true;
    } else {
      if (this.editMode === 'batch') {
        this.isDirty = false;
      }
    }

    // avoid expression after changed errors
    setTimeout(() => {
      const preValidity = this._isValid;
      this._isValid = this.getValidity();
      if (preValidity !== this._isValid) {
        this.validityChanged.emit(this._isValid);
      }
      this._cdr.markForCheck();
    }, 1);

    this.contentReady.emit(e);
    this._cdr.markForCheck();
  }

  public onOptionChanged(e: any): void {
    if (
      this.remoteOperations &&
      this.showSelection &&
      (e.name === 'filterValue' || e.fullName.indexOf('sortOrder') >= 0)
    ) {
      // This is so the selected row will be scrolled to when filtering/sorting finishes via onContentReady
      this.focusedRowKey = null;
      this.selectedRowKeys = [];
      this._cdr.markForCheck();
    }
  }

  public previousItem(): void {
    if (!this.showSelection || !this.dataGrid?.instance) {
      return;
    }

    let newIndex: number;
    if (!this.selectedRowKeys?.length) {
      newIndex = 0;
    } else {
      newIndex = Math.max(0, this.focusedRowIndex - 1);
    }

    this.selectIndex(newIndex, true);
  }

  public nextItem(): void {
    if (!this.showSelection || !this.dataGrid?.instance) {
      return;
    }

    let newIndex: number;
    if (!this.selectedRowKeys?.length) {
      newIndex = 0;
    } else {
      newIndex = Math.min(
        this.dataGrid.instance.totalCount() - 1,
        this.focusedRowIndex + 1
      );
    }

    this.selectIndex(newIndex, false);
  }

  public scrollToTop(): void {
    const scrollable = this.instance.getScrollable();
    if (scrollable) {
      scrollable.scrollTo({
        left: 0,
        top: 0,
      });
    }
  }

  public scrollToBottom(): void {
    const scrollable = this.instance.getScrollable();
    if (scrollable) {
      scrollable.scrollTo({
        left: 0,
        top: scrollable.$content().height(),
      });
    }
  }

  public scrollItemUpDown(up: boolean): void {
    const pageStep = up ? -1 : 1;
    const scrollable = this.instance.getScrollable();
    if (
      scrollable &&
      scrollable._container &&
      scrollable._container().height() < scrollable.$content().height()
    ) {
      scrollable.scrollBy({
        left: 0,
        top: this.dataController.getItemSize() * pageStep,
      });
    }
  }

  public pageUpDown(up: boolean): void {
    const pageStep = up ? -1 : 1;
    const scrollable = this.instance.getScrollable();
    if (
      scrollable &&
      scrollable._container &&
      scrollable._container().height() < scrollable.$content().height()
    ) {
      scrollable.scrollBy({
        left: 0,
        top: scrollable._container().height() * pageStep,
      });
    }
  }

  public async validateAsync(): Promise<boolean> {
    if (!this.editable || !this.dataGrid?.instance) {
      return true;
    }

    const validatingController = this.instance.getController('validating');
    if (validatingController) {
      return await validatingController.validate(true);
    }

    return false;
  }

  public isRowIndexVisible(index: number): boolean {
    const visibleRows = this.instance?.getVisibleRows();
    return (
      visibleRows?.length &&
      visibleRows[0].dataIndex <= index &&
      visibleRows[visibleRows.length - 1].dataIndex >= index
    );
  }

  private selectIndex(index: number, up: boolean): void {
    if (index !== this.focusedRowIndex) {
      if (!this.isRowIndexVisible(index)) {
        this.scrollItemUpDown(up);
      }
      this.instance.option('focusedRowIndex', index);
      // after changing the index, devextreme will change the key, so now we can select the row based on the key
      this.dataGrid.instance.selectRows(
        this.instance.option('focusedRowKey'),
        false
      );
    }
  }

  private setGridTemplates(): void {
    if (this._dataGrid) {
      if (this._pendingTemplates.length) {
        while (this._pendingTemplates.length) {
          this._dataGrid.setTemplate(this._pendingTemplates.shift());
        }
        (this._dataGrid as any)._initTemplates();
      }
    }
  }

  private setGridColumns(forceAdd: boolean = false): void {
    if (
      this._dataGrid &&
      this._hasPendingColumns &&
      (this._dataGrid.columns || forceAdd)
    ) {
      this._dataGrid._setOption('columns', this.getAllGridColumns());
      this._hasPendingColumns = false;
    }
  }

  private getAllGridColumns(): any[] {
    const originalColumns = (this._dataGrid.columns || []).filter(
      (x: any) => !x.isColumnComponent
    );
    const contentColumn = this._contentColumns.map((x) => {
      x.parent = this;
      return x.getSettings();
    });
    return originalColumns.concat(contentColumn);
  }

  private getValidity(): boolean {
    if (!this.editable || !this.dataGrid?.instance) {
      return true;
    }

    const validatingController = this.instance.getController('validating');
    if (validatingController?._validationState?.length) {
      return validatingController._validationState.every((x: any) => {
        if (!x.validationResults) {
          return x.isValid;
        }

        if (x.validationResults instanceof Array) {
          return x.isValid && x.validationResults.every((y: any) => y.isValid);
        } else {
          return (
            x.isValid &&
            Object.keys(x.validationResults).every(
              (key) => x.validationResults[key].isValid
            )
          );
        }
      });
    }

    return true;
  }
}
