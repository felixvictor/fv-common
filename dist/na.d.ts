import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/en";
import "dayjs/locale/en-gb";

//#region src/na/compass.d.ts
declare const compassDirections: readonly ["N", "N⅓NE", "N⅔NE", "NE", "E⅔NE", "E⅓NE", "E", "E⅓SE", "E⅔SE", "SE", "S⅔SE", "S⅓SE", "S", "S⅓SW", "S⅔SW", "SW", "W⅔SW", "W⅓SW", "W", "W⅓NW", "W⅔NW", "NW", "N⅔NW", "N⅓NW"];
declare const degreesPerDirection: number;
declare const compassToDegrees: (compass: string) => number;
declare const degreesToCompass: (degrees: number | undefined) => string;
declare const degreesToCompassSlider: (degrees: number | undefined) => string;
declare const compassDirectionFromSlider: (compassDirection: number | undefined) => number;
declare const displayCompassAndDegrees: (wind: number | string, svg?: boolean) => string;
declare const isCardinalOrIntercardinal: (index: number) => boolean;
declare const isCardinal: (index: number) => boolean;
//#endregion
//#region src/na/constants.d.ts
declare const speedFactor = 390;
declare const timeFactor = 2.63;
declare const distanceMapSize = 8192;
declare const mapSize = 8192;
declare const minDeepWaterBR = 22;
declare const serverMaintenanceHour = 10;
declare const hoursPerDay = 24;
declare const maxPortBattleHour: number;
declare const degreesFullCircle = 360;
declare const degreesHalfCircle = 180;
declare const degreesQuarterCircle = 90;
//#endregion
//#region src/na/coordinates.d.ts
declare const convertCoordX: (x: number, y: number) => number;
declare const convertCoordY: (x: number, y: number) => number;
declare const convertInvCoordX: (x: number, y: number) => number;
declare const convertInvCoordY: (x: number, y: number) => number;
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
declare const radiansToDegrees: (radians: number) => number;
declare const degreesToRadians: (degrees: number) => number;
declare const rotationAngleInDegrees: (centerPt: Point, targetPt: Point) => number;
declare const rotationAngleInRadians: (centerPt: Point, targetPt: Point) => number;
declare const getRadians: (centerPt: Point, targetPt: Point) => number;
declare const getAngle: (x: number, y: number) => number;
declare const addAngle: (a: number, b: number) => number;
declare const distancePoints: (centerPt: Coordinate, targetPt: Coordinate) => number;
declare const getDistance: (pt0: Coordinate, pt1: Coordinate) => number;
declare const coordinateAdjust: (x: number | PointTuple | PointTuple[], y?: number) => PointTuple | PointTuple[];
//#endregion
//#region src/na/server-time.d.ts
declare const getCurrentServerStart: () => dayjs.Dayjs;
declare const getPreviousServerStart: () => dayjs.Dayjs;
declare const getNextServerStart: () => dayjs.Dayjs;
declare const currentServerStartDateTime: string;
declare const currentServerStartDate: string;
declare const previousServerStartDate: string;
declare const currentServerDateYear: string;
declare const currentServerDateMonth: string;
//#endregion
//#region src/na/time.d.ts
declare const setDateLocale: (locale: string) => void;
declare const getPortBattleTime: (startHoursFromSMH: number, isNeutralPort?: boolean) => string;
declare const getToday: () => {
  begin: dayjs.Dayjs;
  end: dayjs.Dayjs;
};
declare const getYesterday: () => {
  begin: dayjs.Dayjs;
  end: dayjs.Dayjs;
};
declare const getThisWeek: () => {
  begin: dayjs.Dayjs;
  end: dayjs.Dayjs;
};
declare const getLastWeek: () => {
  begin: dayjs.Dayjs;
  end: dayjs.Dayjs;
};
//#endregion
//#region src/na/wind.d.ts
declare const numberSegments = 24;
declare const segmentRadians: number;
declare const circleRadiusFactor = 5;
declare const degreesPerSecond: number;
declare const subtractFromWind: (wind: number, sub: number) => number;
declare const subtractFromWindAlt: (wind: number, sub: number) => number;
//#endregion
export { type Coordinate, type Distance, type Extent, type Point, type PointTuple, addAngle, circleRadiusFactor, compassDirectionFromSlider, compassDirections, compassToDegrees, convertCoordX, convertCoordY, convertInvCoordX, convertInvCoordY, coordinateAdjust, currentServerDateMonth, currentServerDateYear, currentServerStartDate, currentServerStartDateTime, degreesFullCircle, degreesHalfCircle, degreesPerDirection, degreesPerSecond, degreesQuarterCircle, degreesToCompass, degreesToCompassSlider, degreesToRadians, displayCompassAndDegrees, distanceMapSize, distancePoints, getAngle, getCurrentServerStart, getDistance, getLastWeek, getNextServerStart, getPortBattleTime, getPreviousServerStart, getRadians, getThisWeek, getToday, getYesterday, hoursPerDay, isCardinal, isCardinalOrIntercardinal, mapSize, maxPortBattleHour, minDeepWaterBR, numberSegments, previousServerStartDate, radiansToDegrees, rotationAngleInDegrees, rotationAngleInRadians, segmentRadians, serverMaintenanceHour, setDateLocale, speedFactor, subtractFromWind, subtractFromWindAlt, timeFactor };
//# sourceMappingURL=na.d.ts.map