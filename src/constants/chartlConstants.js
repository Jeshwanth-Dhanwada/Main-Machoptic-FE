export const CHART_TABS = {
    SHOVELS: "Shovels",
    TRUCKS: "Trucks",
    MINEPLAN: "Mineplan",
    PARAMETERS: "KPI"
}

export const ROW_STEPS = 200;
export const COL_STEPS = 160;

export const PARAMETER_types = {
    Queue: "Average Queue",
    Trips: "Trips Count",
}

export const TRUCK_TONS_CHILDS = {
    Break_Time: "Break Time",
    Refuel: "Refuel",
    Empty_Queue_Time: "Waiting",
    DwellTime: "Dwelling",
    Productive_Time: "Productive Time"
}

export const SHOVEL_TONS_CHILDS = {
    Maintanencetime:"Maintanencetime",
    Breaktime: "Break Time",
    Movement: "Movement Time",
    Hangtime: "Hang Time",
    Productivetime: "Productive Time"
}

export const Mine_TONS_CHILDS = {
    MaterialGrade:"MaterialGrade",
    Breaktime: "Break Time",
    Movement: "Movement Time",
    Hangtime: "Hang Time",
    Productivetime: "Productive Time"
}

export const SHOVEL_TONAGE_KEY = "Tonnage"
export const TRUCK_TONAGE_KEY = "TruckTonnage"

export const NODE_WIDTH = 100;
export const NODE_HEIGHT = 40;

export const PRODUCTIVE_CHILDS = {
    Trip_Count: "Trips",
    AvgLoadingtime: "Average Loading Time",
    AvgQueueingtime: "Average Queue Time",
    QueueLength: "Average Queue Length"
}

export const TRUCK_PRODUCTIVE_CHILDS = {
    EmptySpotTime: "Empty Spot Time",
    FullSpotTime: "Full Spot Time",
    DumpTime:"Dump Time",
    EmptyHaulTime: "Empty Haul Time",
    FullHaulTime: "Full Haul Time",
    LoadTime: "Load Time",
    TruckTrips: "Truck Trips"
}

const FIELDS = {
    INPUT:"input",
    CHECKBOX: "checkbox",
    NUMBER: "number"
}

export const PROPERTY_FIELD_TYPES = {
    height: FIELDS.INPUT,
    hidden: FIELDS.CHECKBOX,
    nodeValue: FIELDS.NUMBER,
    width: FIELDS.NUMBER
}

export const FILTER_OPTIONS = {
    1:"Best 5",
    2:"Worst 5",
    3:"All"
}