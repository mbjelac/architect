export interface BuildingCreation {
  type: string;
  x: number;
  y: number;
}

export interface CreateBuildingResult {
  error: undefined | string;
  addedBuildings: BuildingCreation[];
}

export class Sektor {
  private buildings: BuildingCreation[] = [];

  createBuilding(building: BuildingCreation): CreateBuildingResult {
    if (this.buildings.some((b) => b.x === building.x && b.y === building.y)) {
      return { error: "locationOccupied", addedBuildings: [] };
    }

    this.buildings.push(building);
    return { error: undefined, addedBuildings: [building] };
  }
}
