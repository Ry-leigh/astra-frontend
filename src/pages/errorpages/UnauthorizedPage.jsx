import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
    return (
        <div>
            <h1>401 Unauthorized</h1>
            <Link to={"/"}>
                Home
            </Link>
            <br />
            <Link to={"/login"}>
                Login
            </Link>
        </div>
    )
}