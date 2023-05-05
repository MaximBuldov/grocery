export interface IProduct {
  id: number;
  title: {
    rendered: string;
  };
  acf: {
    shop: string[];
    selected: boolean;
    department: IDepartment;
  }
}

export interface IDepartment {
  value: string;
  label: string;
}