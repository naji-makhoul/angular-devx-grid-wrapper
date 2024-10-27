import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import {
  DxButtonModule,
  DxDataGridModule,
  DxPopupModule
} from "devextreme-angular";
import { ColumnComponent } from "./table/column.component";
import { TableComponent } from "./table/table.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    DxButtonModule,
    DxDataGridModule,
    DxPopupModule,
    HttpClientModule
  ],
  declarations: [AppComponent, ColumnComponent, TableComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
