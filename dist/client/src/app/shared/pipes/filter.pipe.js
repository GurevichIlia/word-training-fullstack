"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let FilterPipe = class FilterPipe {
    transform(value, args) {
        if (args) {
            const founded = this._filter(value, args);
            return founded;
        }
        else {
            return value;
        }
    }
    _filter(array, value) {
        const filterValue = value.toLowerCase();
        return array.filter(word => word.word.toLowerCase().includes(filterValue) || word.translation.toLowerCase().includes(filterValue));
    }
};
FilterPipe = __decorate([
    core_1.Pipe({
        name: 'filter'
    })
], FilterPipe);
exports.FilterPipe = FilterPipe;
//# sourceMappingURL=filter.pipe.js.map