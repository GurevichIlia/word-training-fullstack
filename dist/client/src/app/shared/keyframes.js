"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const animations_1 = require("@angular/animations");
exports.swing = [
    animations_1.style({ transform: 'rotate3d(0, 0, 1, 15deg)', offset: .2 }),
    animations_1.style({ transform: 'rotate3d(0, 0, 1, -10deg)', offset: .4 }),
    animations_1.style({ transform: 'rotate3d(0, 0, 1, 5deg)', offset: .6 }),
    animations_1.style({ transform: 'rotate3d(0, 0, 1, -5deg)', offset: .8 }),
    animations_1.style({ transform: 'none', offset: 1 }),
];
exports.bounceInRight = [
    animations_1.style({ animation: 'cubic-bezier(0.215, 0.61, 0.355, 1)', offset: 0 }),
    animations_1.style({
        opacity: 0,
        transform: 'translate3d(3000px, 0, 0)', offset: 0
    }),
    animations_1.style({
        opacity: 1,
        transform: 'translate3d(-25px, 0, 0)', offset: .6
    }),
    animations_1.style({ transform: 'translate3d(10px, 0, 0)', offset: .75 }),
    animations_1.style({ transform: 'translate3d(-5px, 0, 0)', offset: 0.9 }),
    animations_1.style({ transform: 'none', offset: 1 }),
];
exports.bounceOutUp = [
    // style({ transform: 'translate3d(0, -10px, 0)', offset: .2 }),
    // style({  opacity: 1, transform: 'translate3d(0, 20px, 0)', offset: .4 }),
    animations_1.style({ opacity: 0, transform: 'translate3d(0, -2000px, 0)', offset: 1 }),
];
exports.bounceInDown = [
    animations_1.style({ animation: 'cubic-bezier(0.215, 0.61, 0.355, 1)', offset: 0 }),
    animations_1.style({
        opacity: 0,
        transform: 'translate3d(0, -3000px, 0)', offset: 0
    }),
    animations_1.style({
        opacity: 1,
        transform: 'translate3d(0, 25px, 0)', offset: .6
    }),
    animations_1.style({ transform: 'translate3d(0, -10px, 0)', offset: .75 }),
    animations_1.style({ transform: 'translate3d(0, 5px, 0)', offset: 0.9 }),
    animations_1.style({ transform: 'none', offset: 1 }),
];
exports.bounceInLeft = [
    animations_1.style({ animation: 'cubic-bezier(0.215, 0.61, 0.355, 1)', offset: 0 }),
    animations_1.style({
        opacity: 0,
        transform: 'translate3d(-3000px, 0, 0)', offset: 0
    }),
    animations_1.style({
        opacity: 1,
        transform: 'translate3d(25px, 0, 0)', offset: .6
    }),
    animations_1.style({ transform: 'translate3d(-10px, 0, 0)', offset: .75 }),
    animations_1.style({ transform: 'translate3d(5px, 0, 0)', offset: 0.9 }),
    animations_1.style({ transform: 'none', offset: 1 }),
];
//# sourceMappingURL=keyframes.js.map