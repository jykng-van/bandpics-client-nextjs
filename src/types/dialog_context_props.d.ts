interface DialogContextProp {
    showConfirmation: (text:string) => Promise<boolean> //((value: boolean) => void) | null;
}