import argparse
import uvicorn


def main(args):
    uvicorn.run(
        app="app:app",
        host="0.0.0.0",
        port=8000,
        workers=args.workers,
        reload=args.debug,
        ssl_keyfile=args.keyfile,
        ssl_certfile=args.certfile,
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FastAPI with SSL")
    parser.add_argument("--keyfile", type=str, help="Path to SSL private key file")
    parser.add_argument("--certfile", type=str, help="Path to SSL certificate file")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode")
    parser.add_argument("--workers", type=int, default=1, help="Define Worker")
    args = parser.parse_args()
    main(args)
