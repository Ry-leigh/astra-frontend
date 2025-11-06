import { Navigate } from "react-router-dom";
import UnauthorizedPage from "../errorpages/UnauthorizedPage";
import ForbiddenPage from "../errorpages/ForbiddenPage";
import ServerErrorPage from "../errorpages/ServerErrorPage";
import NotFoundPage from "../errorpages/NotFoundPage";

export default function ErrorRoute({ code }) {
  switch (code) {
    case 401:
        return <UnauthorizedPage />;
    case 403:
        return <ForbiddenPage />;
    case 500:
        return <ServerErrorPage />;
    case 404:
    default:
        return <NotFoundPage />;
  }
}
