import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
} from '@angular/core';
import { newGuid } from '../models/guid';
import { IColumnContainer } from '../models/icolumn-container';

@Component({
  selector: 'exp-column',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent implements AfterContentInit {
  private _initialized = false;
  private _columns: QueryList<ColumnComponent>;
  private _parent?: IColumnContainer;
  private _options: any;

  constructor() {
    this._options = {
      isColumnComponent: true,
      guid: newGuid(),
      setCellValue: this.setCellValueWithFocus(),
    };
  }

  public get parent(): IColumnContainer {
    return this._parent;
  }

  public set parent(value: IColumnContainer) {
    this._parent = value;
    if (this._columns?.length) {
      this._columns.forEach((column) => {
        if (column !== this) {
          column.parent = value;
        }
      });
    }
  }

  public get alignment(): 'center' | 'left' | 'right' | undefined {
    return this.option('alignment');
  }

  @Input() public set alignment(
    value: 'center' | 'left' | 'right' | undefined
  ) {
    this.option('alignment', value);
  }

  public get allowEditing(): boolean {
    return this.option('allowEditing');
  }

  @Input() public set allowEditing(value: boolean) {
    this.option('allowEditing', value);
  }

  public get allowExporting(): boolean {
    return this.option('allowExporting');
  }

  @Input() public set allowExporting(value: boolean) {
    this.option('allowExporting', value);
  }

  public get allowFiltering(): boolean {
    return this.option('allowFiltering');
  }

  @Input() public set allowFiltering(value: boolean) {
    this.option('allowFiltering', value);
  }

  public get allowFixing(): boolean {
    return this.option('allowFixing');
  }

  @Input() public set allowFixing(value: boolean) {
    this.option('allowFixing', value);
  }

  public get allowGrouping(): boolean {
    return this.option('allowGrouping');
  }

  @Input() public set allowGrouping(value: boolean) {
    this.option('allowGrouping', value);
  }

  public get allowHeaderFiltering(): boolean {
    return this.option('allowHeaderFiltering');
  }

  @Input() public set allowHeaderFiltering(value: boolean) {
    this.option('allowHeaderFiltering', value);
  }

  public get allowHiding(): boolean {
    return this.option('allowHiding');
  }

  @Input() public set allowHiding(value: boolean) {
    this.option('allowHiding', value);
  }

  public get allowReordering(): boolean {
    return this.option('allowReordering');
  }

  @Input() public set allowReordering(value: boolean) {
    this.option('allowReordering', value);
  }

  public get allowResizing(): boolean {
    return this.option('allowResizing');
  }

  @Input() public set allowResizing(value: boolean) {
    this.option('allowResizing', value);
  }

  public get allowSearch(): boolean {
    return this.option('allowSearch');
  }

  @Input() public set allowSearch(value: boolean) {
    this.option('allowSearch', value);
  }

  public get allowSorting(): boolean {
    return this.option('allowSorting');
  }

  @Input() public set allowSorting(value: boolean) {
    this.option('allowSorting', value);
  }

  public get autoExpandGroup(): boolean {
    return this.option('autoExpandGroup');
  }

  @Input() public set autoExpandGroup(value: boolean) {
    this.option('autoExpandGroup', value);
  }

  public get buttons(): any {
    return this.option('buttons');
  }

  @Input() public set buttons(value: any) {
    this.option('buttons', value);
  }

  public get calculateCellValue(): (rowData: any) => any {
    return this.option('calculateCellValue');
  }

  @Input() public set calculateCellValue(value: (rowData: any) => any) {
    this.option('calculateCellValue', value);
  }

  public get calculateDisplayValue(): string | ((rowData: any) => any) {
    return this.option('calculateDisplayValue');
  }

  @Input() public set calculateDisplayValue(
    value: string | ((rowData: any) => any)
  ) {
    this.option('calculateDisplayValue', value);
  }

  public get calculateFilterExpression(): (
    filterValue: any,
    selectedFilterOperation: string,
    target: string
  ) => string | any[] | any {
    return this.option('calculateFilterExpression');
  }

  @Input() public set calculateFilterExpression(
    value: (
      filterValue: any,
      selectedFilterOperation: string,
      target: string
    ) => string | any[] | any
  ) {
    this.option('calculateFilterExpression', value);
  }

  public get calculateGroupValue(): string | ((rowData: any) => any) {
    return this.option('calculateGroupValue');
  }

  @Input() public set calculateGroupValue(
    value: string | ((rowData: any) => any)
  ) {
    this.option('calculateGroupValue', value);
  }

  public get calculateSortValue(): string | ((rowData: any) => any) {
    return this.option('calculateSortValue');
  }

  @Input() public set calculateSortValue(
    value: string | ((rowData: any) => any)
  ) {
    this.option('calculateSortValue', value);
  }

  public get caption(): string {
    return this.option('caption');
  }

  @Input() public set caption(value: string) {
    this.option('caption', value);
  }

  public get cellTemplate(): any {
    return this.option('cellTemplate');
  }

  @Input() public set cellTemplate(value: any) {
    this.option('cellTemplate', value);
  }

  public get cssClass(): string {
    return this.option('cssClass');
  }

  @Input() public set cssClass(value: string) {
    this.option('cssClass', value);
  }

  public get customizeText(): (cellInfo: {
    value?: string | number | Date;
    valueText?: string;
    target?: string;
    groupInterval?: string | number;
  }) => string {
    return this.option('customizeText');
  }

  @Input() public set customizeText(
    value: (cellInfo: {
      value?: string | number | Date;
      valueText?: string;
      target?: string;
      groupInterval?: string | number;
    }) => string
  ) {
    this.option('customizeText', value);
  }

  public get dataField(): string {
    return this.option('dataField');
  }

  @Input() public set dataField(value: string) {
    this.option('dataField', value);
  }

  public get dataType():
    | 'string'
    | 'number'
    | 'date'
    | 'boolean'
    | 'object'
    | 'datetime' {
    return this.option('dataType');
  }

  @Input() public set dataType(
    value: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
  ) {
    this.option('dataType', value);
  }

  public get defaultValue(): any | ((newRow: any) => any) {
    return this.option('defaultValue');
  }

  @Input() public set defaultValue(value: any | ((newRow: any) => any)) {
    this.option('defaultValue', value);
  }

  public get editCellTemplate(): any {
    return this.option('editCellTemplate');
  }

  @Input() public set editCellTemplate(value: any) {
    this.option('editCellTemplate', value);
  }

  public get editorOptions(): any {
    return this.option('editorOptions');
  }

  @Input() public set editorOptions(value: any) {
    this.option('editorOptions', value);
  }

  public get encodeHtml(): boolean {
    return this.option('encodeHtml');
  }

  @Input() public set encodeHtml(value: boolean) {
    this.option('encodeHtml', value);
  }

  public get falseText(): string {
    return this.option('falseText');
  }

  @Input() public set falseText(value: string) {
    this.option('falseText', value);
  }

  public get filterOperations(): (
    | '='
    | '<>'
    | '<'
    | '<='
    | '>'
    | '>='
    | 'notcontains'
    | 'contains'
    | 'startswith'
    | 'endswith'
    | 'between'
  )[] {
    return this.option('filterOperations');
  }

  @Input() public set filterOperations(
    value: (
      | '='
      | '<>'
      | '<'
      | '<='
      | '>'
      | '>='
      | 'notcontains'
      | 'contains'
      | 'startswith'
      | 'endswith'
      | 'between'
    )[]
  ) {
    this.option('filterOperations', value);
  }

  public get filterType(): 'exclude' | 'include' {
    return this.option('filterType');
  }

  @Input() public set filterType(value: 'exclude' | 'include') {
    this.option('filterType', value);
  }

  public get filterValue(): any {
    return this.option('filterValue');
  }

  @Input() public set filterValue(value: any) {
    this.option('filterValue', value);
  }

  public get filterValues(): any[] {
    return this.option('filterValues');
  }

  @Input() public set filterValues(value: any[]) {
    this.option('filterValues', value);
  }

  public get fixed(): boolean {
    return this.option('fixed');
  }

  @Input() public set fixed(value: boolean) {
    this.option('fixed', value);
  }

  public get fixedPosition(): 'left' | 'right' {
    return this.option('fixedPosition');
  }

  @Input() public set fixedPosition(value: 'left' | 'right') {
    this.option('fixedPosition', value);
  }

  public get formItem(): any {
    return this.option('formItem');
  }

  @Input() public set formItem(value: any) {
    this.option('formItem', value);
  }

  public get format(): any {
    return this.option('format');
  }

  @Input() public set format(value: any) {
    this.option('format', value);
  }

  public get groupCellTemplate(): any {
    return this.option('groupCellTemplate');
  }

  @Input() public set groupCellTemplate(value: any) {
    this.option('groupCellTemplate', value);
  }

  public get groupIndex(): number {
    return this.option('groupIndex');
  }

  @Input() public set groupIndex(value: number) {
    this.option('groupIndex', value);
  }

  public get headerCellTemplate(): any {
    return this.option('headerCellTemplate');
  }

  @Input() public set headerCellTemplate(value: any) {
    this.option('headerCellTemplate', value);
  }

  public get headerFilter(): any {
    return this.option('headerFilter');
  }

  @Input() public set headerFilter(value: any) {
    this.option('headerFilter', value);
  }

  public get hidingPriority(): number {
    return this.option('hidingPriority');
  }

  @Input() public set hidingPriority(value: number) {
    this.option('hidingPriority', value);
  }

  public get isBand(): boolean {
    return this.option('isBand');
  }

  @Input() public set isBand(value: boolean) {
    this.option('isBand', value);
  }

  public get lookup(): {
    allowClearing?: boolean;
    dataSource?: any;
    displayExpr?: string | ((data: any) => string);
    valueExpr?: string;
  } {
    return this.option('lookup');
  }

  @Input() public set lookup(value: {
    allowClearing?: boolean;
    dataSource?: any;
    displayExpr?: string | ((data: any) => string);
    valueExpr?: string;
  }) {
    this.option('lookup', value);
  }

  public get minWidth(): number {
    return this.option('minWidth');
  }

  @Input() public set minWidth(value: number) {
    this.option('minWidth', value);
  }

  public get name(): string {
    return this.option('name');
  }

  @Input() public set name(value: string) {
    this.option('name', value);
  }

  public get ownerBand(): number {
    return this.option('ownerBand');
  }

  @Input() public set ownerBand(value: number) {
    this.option('ownerBand', value);
  }

  public get renderAsync(): boolean {
    return this.option('renderAsync');
  }

  @Input() public set renderAsync(value: boolean) {
    this.option('renderAsync', value);
  }

  public get selectedFilterOperation():
    | '<'
    | '<='
    | '<>'
    | '='
    | '>'
    | '>='
    | 'between'
    | 'contains'
    | 'endswith'
    | 'notcontains'
    | 'startswith' {
    return this.option('selectedFilterOperation');
  }

  @Input() public set selectedFilterOperation(
    value:
      | '<'
      | '<='
      | '<>'
      | '='
      | '>'
      | '>='
      | 'between'
      | 'contains'
      | 'endswith'
      | 'notcontains'
      | 'startswith'
  ) {
    this.option('selectedFilterOperation', value);
  }

  public get setCellValue(): (
    newData: any,
    value: any,
    currentRowData: any,
    columnOptions: any
  ) => void | Promise<void> | JQueryPromise<void> {
    return this.parent.editable ? this.option('setCellValue') : undefined;
  }

  @Input() public set setCellValue(
    value: (
      newData: any,
      value: any,
      currentRowData: any,
      columnOptions: any
    ) => void | Promise<void> | JQueryPromise<void>
  ) {
    this.option('setCellValue', this.setCellValueWithFocus(value));
  }

  public get showEditorAlways(): boolean {
    return this.option('showEditorAlways');
  }

  @Input() public set showEditorAlways(value: boolean) {
    this.option('showEditorAlways', value);
  }

  public get showInColumnChooser(): boolean {
    return this.option('showInColumnChooser');
  }

  @Input() public set showInColumnChooser(value: boolean) {
    this.option('showInColumnChooser', value);
  }

  public get showWhenGrouped(): boolean {
    return this.option('showWhenGrouped');
  }

  @Input() public set showWhenGrouped(value: boolean) {
    this.option('showWhenGrouped', value);
  }

  public get sortIndex(): number {
    return this.option('sortIndex');
  }

  @Input() public set sortIndex(value: number) {
    this.option('sortIndex', value);
  }

  public get sortOrder(): 'asc' | 'desc' | undefined {
    return this.option('sortOrder');
  }

  @Input() public set sortOrder(value: 'asc' | 'desc' | undefined) {
    this.option('sortOrder', value);
  }

  public get sortingMethod(): (value1: any, value2: any) => number {
    return this.option('sortingMethod');
  }

  @Input() public set sortingMethod(
    value: (value1: any, value2: any) => number
  ) {
    this.option('sortingMethod', value);
  }

  public get trueText(): string {
    return this.option('trueText');
  }

  @Input() public set trueText(value: string) {
    this.option('trueText', value);
  }

  public get type():
    | 'adaptive'
    | 'buttons'
    | 'detailExpand'
    | 'groupExpand'
    | 'selection' {
    return this.option('type');
  }

  @Input() public set type(
    value: 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection'
  ) {
    this.option('type', value);
  }

  public get userData(): any {
    return this.option('userData');
  }

  @Input() public set userData(value: any) {
    this.option('userData', value);
  }

  public get validationRules(): any[] {
    return this.option('validationRules');
  }

  @Input() public set validationRules(value: any[]) {
    this.option('validationRules', value);
  }

  public get visible(): boolean {
    return this.option('visible');
  }

  @Input() public set visible(value: boolean) {
    this.option('visible', value);
  }

  public get visibleIndex(): number {
    return this.option('visibleIndex');
  }

  @Input() public set visibleIndex(value: number) {
    this.option('visibleIndex', value);
  }

  public get width(): number | string {
    return this.option('width');
  }

  @Input() public set width(value: number | string) {
    this.option('width', value);
  }

  @ContentChildren(ColumnComponent, { descendants: false })
  public set contentColumns(columns: QueryList<ColumnComponent>) {
    this._columns = columns;
  }

  public get columns(): QueryList<ColumnComponent> {
    return this._columns;
  }

  public getSettings(): any {
    this._options.columns = this._columns?.length
      ? this._columns.map((x) => x.getSettings())
      : undefined;
    return Object.assign(
      {},
      { ...this._options },
      { setCellValue: this.parent?.editable ? this.setCellValue : undefined }
    );
  }

  public ngAfterContentInit(): void {
    this._initialized = true;
  }

  public option(optionName: keyof ColumnComponent, value?: any): any {
    if (value !== undefined) {
      this._options[optionName] = value;
      this.notifyChanges(optionName, value);
    } else {
      return this._options[optionName];
    }
  }

  /**
   * There is a weird bug where dev extreme doesn't give focus back to the table (in our current version) after a value is set.
   * This function is only to alleviate this issue and should be removed when it's fixed.
   * @param before A function that gets called before giving focus back to the table
   * @returns A function that dev extreme will call when setting the cell value in the column.
   */
  private setCellValueWithFocus = (
    before?: (
      newData: any,
      value: any,
      currentRowData: any,
      columnOptions: any
    ) => void | Promise<void> | JQueryPromise<void>
  ): ((
    newData: any,
    value: any,
    currentRowData: any
  ) => void | Promise<void>) => {
    if (before) {
      // we need to call before, and wait for it to resolved if it's a Promise
      return (newData: any, value: any, currentRowData: any) =>
        new Promise((resolve) => {
          // Dev extreme doesn't give us the options. The only way to get them if the function is unbound
          // This is to circumvent that behavior, and always have it at our disposal
          const column = this.columnOption();
          const beforeValue = before(newData, value, currentRowData, column);
          if (beforeValue instanceof Promise) {
            beforeValue.then(() => {
              setTimeout(() => {
                this._parent.instance?.focus();
              }, 10);
              resolve();
            });
          } else {
            resolve();
          }
        });
    }

    return (newData: any, value: any) => {
      // don't do this.columnOption('defaultSetCellValue'), because "this" will not be bound to the column in the function, and it will fail
      const column = this.columnOption();
      if (column.defaultSetCellValue) {
        column.defaultSetCellValue(newData, value);
      }
      setTimeout(() => {
        this._parent.instance?.focus();
      }, 10);
    };
  };

  private notifyChanges(optionName: string, value: any): void {
    if (this._initialized && this._parent?.instance?._isReady) {
      // dev extreme will find the column based on any of these 3 values in
      // ./node_modules/devextreme/ui/grid_core/ui.grid_core.columns_controller.js
      // in the findColumn function
      // This will work for nested columns as well
      this.columnOption(optionName, value);
    }
  }

  private columnOption(optionName?: string, value?: any): any {
    if (value !== undefined) {
      this._parent?.instance?.columnOption(
        this.columnIdentifier(),
        optionName,
        value
      );
    } else {
      // To anyone using this in the future, if the option you're trying to grab is a function, it's better to just get the column object
      // And then call the function from the column. If you don't do it that way, "this" will not be bound to the column.
      if (optionName) {
        return this._parent?.instance?.columnOption(
          this.columnIdentifier(),
          optionName
        );
      }
      return this._parent?.instance?.columnOption(this.columnIdentifier());
    }
  }

  private columnIdentifier(): string {
    return this.name || this.dataField || this.caption;
  }
}
