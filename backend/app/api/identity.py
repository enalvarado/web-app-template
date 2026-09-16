import getpass

from fastapi import APIRouter, Request

from ..models.schemas import WhoAmIOut

router = APIRouter()


@router.get("/whoami", response_model=WhoAmIOut)
def whoami(request: Request):
    # Purely a default/prefill — informational, not an access check. Once deployed
    # behind IIS/a reverse proxy with Windows Authentication, the proxy passes the
    # authenticated domain user through this header.
    remote_user = request.headers.get("x-remote-user")
    if remote_user:
        return WhoAmIOut(username=remote_user.split("\\")[-1], source="windows")

    # Locally (no proxy in front), fall back to the OS login of whoever is running
    # the backend process.
    return WhoAmIOut(username=getpass.getuser(), source="local")
