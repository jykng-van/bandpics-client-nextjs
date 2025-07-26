import {  useState, useRef, ReactNode, createContext /*,FC */ } from "react";
//import { DialogContext } from "./dialog_context";

/* type ConfirmationDialogContextProviderProps = {
    children: ReactNode
} */


export const DialogContext = createContext({});

export const ConfirmDialog = ({ children }: { children: ReactNode }) => {
    //const ConfirmationContext = createContext<DialogContextType>({} as DialogContextType);
    const [message, setMessage] = useState<string>('Are you sure you want to do this?');
    const resolver = useRef<((value: boolean) => void) | null>(null); //resolver is either a resolver function or null
    const dialogElement = useRef<HTMLDialogElement>(null);

    const showConfirmation = (text:string): Promise<boolean> => {
        console.log('showConfirmation!!!');
        setMessage(text);

        if (dialogElement && dialogElement.current){
            dialogElement.current.showModal();
        }

        return new Promise((resolve) => {
            resolver.current = resolve;
        });
    };

    const dialogProps:DialogContextProp = {
        showConfirmation
    };

    const handleOk = () => {
        if (resolver.current){
            resolver.current(true);
        }
        //setShowConfirm(false)
        if (dialogElement.current){
            dialogElement.current.close();
        }
    };

    const handleCancel = () => {
        if (resolver.current){
            resolver.current(false);
        }
        //setShowConfirm(false)
        if (dialogElement.current){
            dialogElement.current.close();
        }
    };

    return <DialogContext.Provider value={dialogProps}>
      {children}
      <dialog ref={dialogElement} id="confirm-dialog" className="bg-white p-4 rounded-md shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm
      fixed m-auto box-border">
          <div className="py-4">{message}</div>
          <div className="flex flex-row justify-center items-center gap-2">
              <button className="bg-blue-800 text-white w-1/4" onClick={handleOk}>Yes</button>
              <button className="bg-red-800 text-white w-1/4" onClick={handleCancel}>No</button>
          </div>
      </dialog>
    </DialogContext.Provider>
}