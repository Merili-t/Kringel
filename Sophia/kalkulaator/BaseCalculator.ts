export abstract class BaseCalculator{ 
    protected panelContents: string = ''; //kalkulaatori mälu
    abstract evaluate(): string | number; 

    insert(content: string): void {
        this.panelContents += content; 
    }

    setContents(content: string): void {
        this.panelContents = content;
    }

    getContents(): string {
        return this.panelContents;
    }

    clear(): void {
        this.panelContents = '';
    }

    //backspace(): void {
        //this.panelContents = this.panelContents.slice(0, -1);
    //}
}