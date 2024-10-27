import { INestedOptionContainer } from 'devextreme-angular/core';

export interface IColumnContainer extends INestedOptionContainer {
  editable: boolean;
  focus(): void;
}
