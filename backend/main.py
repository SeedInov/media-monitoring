import argparse
from typing import Optional
from pydantic import BaseModel
import uvicorn


class Args(BaseModel):
    port: int
    debug: bool
    workers: int
    keyfile: Optional[str]
    certfile: Optional[str]


def main(args: Args):
    uvicorn.run(
        app="app:app",
        host="0.0.0.0",
        port=args.port,
        workers=args.workers,
        reload=args.debug,
        ssl_keyfile=args.keyfile,
        ssl_certfile=args.certfile,
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FastAPI with SSL")
    parser.add_argument("--keyfile", type=str, help="Path to SSL private key file")
    parser.add_argument("--certfile", type=str, help="Path to SSL certificate file")
    parser.add_argument(
        "--debug", action="store_true", default=True, help="Enable debug mode"
    )
    parser.add_argument("--workers", type=int, default=1, help="Define Worker")
    parser.add_argument("--port", type=int, default=8000, help="Define Port")
    parsed_args = parser.parse_args()
    args = Args(
        keyfile=parsed_args.keyfile,
        certfile=parsed_args.certfile,
        debug=parsed_args.debug,
        workers=parsed_args.workers,
        port=parsed_args.port,
    )
    main(args)
