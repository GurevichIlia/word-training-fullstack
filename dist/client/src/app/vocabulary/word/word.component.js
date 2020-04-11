"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let WordComponent = class WordComponent {
    constructor(
    // private change: ChangeDetectorRef
    ) {
        this.action = new core_1.EventEmitter();
        this.items = [{ title: 'Edit' }, { title: 'Delete' }];
    }
    ngOnChanges(changes) {
        // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        // Add '${implements OnChanges}' to the class.
        // console.log('WORD CHANGE DETECTION', this.word);
    }
    // ngDoCheck() {
    //   console.log('WORD CHANGE DETECTION');
    //   // this.change.markForCheck();
    // }
    ngOnInit() {
        // this.createEditFormForWord();
    }
    dispatchAction(action, payload) {
        this.action.emit({ action, payload });
    }
};
__decorate([
    core_1.Input()
], WordComponent.prototype, "word", void 0);
__decorate([
    core_1.Output()
], WordComponent.prototype, "action", void 0);
WordComponent = __decorate([
    core_1.Component({
        selector: 'app-word',
        templateUrl: './word.component.html',
        styleUrls: ['./word.component.scss'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    })
], WordComponent);
exports.WordComponent = WordComponent;
//# sourceMappingURL=word.component.js.map