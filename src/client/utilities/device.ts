import { Rectangle } from "../../common/utilities/rectangle.js";

const isTouch: boolean = "ontouchstart" in window || !!navigator.maxTouchPoints || !!navigator.maxTouchPoints;
const orientation: "landscape" | "portrait" = window.innerWidth >= window.innerHeight ? "landscape" : "portrait";
const touchControlPaneModifier: Rectangle = orientation === "landscape" ? { x: 1, y: 0, width: 0.5, height: 1 } : { x: 0, y: 1, width: 1, height: 0.5 };

export { isTouch, orientation, touchControlPaneModifier };
