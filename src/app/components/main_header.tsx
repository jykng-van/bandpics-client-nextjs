import Login from "./login";

export default function MainHeader(){
    return (
        <header className="flex items-center justify-between">
            <strong className="font-bold text-xl">Live Show Pictures</strong>
            <Login />
        </header>
    )
}

