import dayjs from "dayjs";
import "dayjs/locale/de.js";
import "dayjs/locale/en.js";
import "dayjs/locale/en-gb.js";
//#region src/na/compass.d.ts
export declare const compassDirections: readonly ["N", "N⅓NE", "N⅔NE", "NE", "E⅔NE", "E⅓NE", "E", "E⅓SE", "E⅔SE", "SE", "S⅔SE", "S⅓SE", "S", "S⅓SW", "S⅔SW", "SW", "W⅔SW", "W⅓SW", "W", "W⅓NW", "W⅔NW", "NW", "N⅔NW", "N⅓NW"];
export declare const degreesPerDirection: number;
export declare const compassToDegrees: (compass: string) => number;
export declare const degreesToCompass: (degrees: number | undefined) => string;
export declare const degreesToCompassSlider: (degrees: number | undefined) => string;
export declare const compassDirectionFromSlider: (compassDirection: number | undefined) => number;
export declare const displayCompassAndDegrees: (wind: number | string, isSvg?: boolean) => string;
export declare const isCardinalOrIntercardinal: (index: number) => boolean;
export declare const isCardinal: (index: number) => boolean;
//#endregion
//#region src/na/constants.d.ts
export declare const speedFactor = 390;
export declare const timeFactor = 2.63;
export declare const distanceMapSize = 8192;
export declare const mapSize = 8192;
export declare const minDeepWaterBR = 22;
export declare const serverMaintenanceHour = 10;
export declare const hoursPerDay = 24;
export declare const maxPortBattleHour: number;
export declare const degreesFullCircle = 360;
export declare const degreesHalfCircle = 180;
export declare const degreesQuarterCircle = 90;
//#endregion
//#region src/na/coordinates.d.ts
export declare const convertCoordX: (x: number, y: number) => number;
export declare const convertCoordY: (x: number, y: number) => number;
export declare const convertInvCoordX: (x: number, y: number) => number;
export declare const convertInvCoordY: (x: number, y: number) => number;
interface Coordinate {
  x: number;
  y: number;
}
interface Distance extends Array<number> {
  0: number;
  1: number;
  2: number;
}
type Extent = [Point, Point];
interface Point extends Array<number> {
  0: number;
  1: number;
}
type PointTuple = [number, number];
export declare const radiansToDegrees: (radians: number) => number;
export declare const degreesToRadians: (degrees: number) => number;
export declare const rotationAngleInDegrees: (centerPt: Point, targetPt: Point) => number;
export declare const rotationAngleInRadians: (centerPt: Point, targetPt: Point) => number;
export declare const getRadians: (centerPt: Point, targetPt: Point) => number;
export declare const getAngle: (x: number, y: number) => number;
export declare const addAngle: (a: number, b: number) => number;
export declare const distancePoints: (centerPt: Coordinate, targetPt: Coordinate) => number;
export declare const getDistance: (pt0: Coordinate, pt1: Coordinate) => number;
export declare const coordinateAdjust: (x: number | PointTuple | PointTuple[], y?: number) => PointTuple | PointTuple[];
//#endregion
//#region src/na/server-time.d.ts
export declare const getCurrentServerStart: () => dayjs.Dayjs;
export declare const getPreviousServerStart: () => dayjs.Dayjs;
export declare const getNextServerStart: () => dayjs.Dayjs;
export declare const currentServerStartDateTime: string;
export declare const currentServerStartDate: string;
export declare const previousServerStartDate: string;
export declare const currentServerDateYear: string;
export declare const currentServerDateMonth: string;
//#endregion
//#region src/na/time.d.ts
export declare const setDateLocale: (locale: string) => void;
export declare const getPortBattleTime: (startHoursFromSMH: number, isNeutralPort?: boolean) => string;
export declare const getToday: () => {
  begin: dayjs.Dayjs;
  end: dayjs.Dayjs;
};
export declare const getYesterday: () => {
  begin: dayjs.Dayjs;
  end: dayjs.Dayjs;
};
export declare const getThisWeek: () => {
  begin: dayjs.Dayjs;
  end: dayjs.Dayjs;
};
export declare const getLastWeek: () => {
  begin: dayjs.Dayjs;
  end: dayjs.Dayjs;
};
//#endregion
//#region src/na/wind.d.ts
export declare const numberSegments = 24;
export declare const segmentRadians: number;
export declare const circleRadiusFactor = 5;
export declare const degreesPerSecond: number;
export declare const subtractFromWind: (wind: number, sub: number) => number;
export declare const subtractFromWindAlt: (wind: number, sub: number) => number;
//#endregion
export type { Coordinate, Distance, Extent, Point, PointTuple };
//# sourceMappingURL=na.d.ts.map