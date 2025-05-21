export class BaseCalculator {
    constructor() {
        this.panelContents = ''; //kalkulaatori mälu
        //backspace(): void {
        //this.panelContents = this.panelContents.slice(0, -1);
        //}
    }
    insert(content) {
        this.panelContents += content;
    }
    setContents(content) {
        this.panelContents = content;
    }
    getContents() {
        return this.panelContents;
    }
    clear() {
        this.panelContents = '';
    }
}
