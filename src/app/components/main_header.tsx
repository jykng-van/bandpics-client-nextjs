import Login from "./login";
import Link from "next/link";

export default function MainHeader(){
    return (
        <header className="flex items-center justify-between">
            <Link className="font-bold text-xl" href="/">Live Show Pictures</Link>
            <Login />
        </header>
    )
}

