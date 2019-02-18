export interface Option {
  id: string;
}

export interface IconOption extends Option {
  iconClass: string;
}

export interface WeatherOption extends IconOption {

}

export interface CategoryOption extends IconOption {

}

export interface ItemOption extends IconOption {

}

export interface SizeOption extends Option {
  name: string;
}
