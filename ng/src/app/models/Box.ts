export class Box {
  id: string;

  amount: number;
  weight: number;

  weather: string[] = [];
  categories: string[] = [];
  items: string[] = [];
  sizes: string[] = [];

  custom: string = '';

  warehouse: string;
  location: string;

  history: string[] = [];

  constructor(id?: string) {
    this.id = id;
  }
}
