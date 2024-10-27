// see https://js.devexpress.com/Documentation/Guide/Widgets/DataGrid/Data_Binding/Custom_Sources/
export interface IPagedList<TModel> {
  totalCount?: number;
  data: TModel[];
}
