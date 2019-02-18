import { Warehouse } from './Warehouse';

export interface Location {
    description: string;
    warehouse: Warehouse;
    location: Coordinates;
    // getBoxes(): Box[];
}
