import {  useState, useRef, ReactNode, createContext, useEffect /*,FC */ } from "react";
//import { DialogContext } from "./dialog_context";

/* type ConfirmationDialogContextProviderProps = {
    children: ReactNode
} */


export const DialogContext = createContext({});

export const ConfirmDialog = ({ children }: { children: ReactNode }) => {
    //const ConfirmationContext = createContext<DialogContextType>({} as DialogContextType);
    const defaultMessage = 'Are you sure you want to do this?'; //default message if no value given
    const [message, setMessage] = useState<string | null>(null); //message to show in dialog, it controls the dialog appearance too
    const resolver = useRef<((value: boolean) => void) | null>(null); //resolver is either a resolver function or null
    const dialogElement = useRef<HTMLDialogElement>(null);

    //deal with the opening and closing of the dialog message here
    useEffect(()=>{
        const dialog = dialogElement && dialogElement.current;
        if (dialog){
            if(message !== null){
                dialog.showModal();
            }else{
                dialog.close();
            }
        }
    }, [message]);
    const showConfirmation = (text?:string): Promise<boolean> => {
        console.log('showConfirmation!!!');
        setMessage(text || defaultMessage); //which will trigger showModal on the dialog

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
        setMessage(null); //which will trigger the dialog closing
    };

    const handleCancel = () => {
        if (resolver.current){
            resolver.current(false);
        }
        setMessage(null); //which will trigger the dialog closing
    };

    return <DialogContext.Provider value={dialogProps}>
      {children}
      {message &&
      <dialog ref={dialogElement} id="confirm-dialog" className="bg-white p-4 rounded-md shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm
      fixed m-auto box-border">
          <div className="py-4">{message}</div>
          <div className="flex flex-row justify-center items-center gap-2">
              <button className="bg-blue-800 text-white w-1/4" onClick={handleOk}>Yes</button>
              <button className="bg-red-800 text-white w-1/4" onClick={handleCancel}>No</button>
          </div>
      </dialog>}
    </DialogContext.Provider>
}