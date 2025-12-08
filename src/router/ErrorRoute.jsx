import { Navigate } from "react-router-dom";
import UnauthorizedPage from "../pages/errorpages/UnauthorizedPage";
import ForbiddenPage from "../pages/errorpages/ForbiddenPage";
import ServerErrorPage from "../pages/errorpages/ServerErrorPage";
import NotFoundPage from "../pages/errorpages/NotFoundPage";

export default function ErrorRoute({ code }) {
  switch (code) {
    case 401:
        return <UnauthorizedPage />;
    case 403:
        return <ForbiddenPage />;
    case 404:
        return <NotFoundPage />;
    case 500:
    default:
        return <ServerErrorPage />;
  }
}
