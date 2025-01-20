import logging
from logging.config import dictConfig


log_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "()": "uvicorn.logging.DefaultFormatter",
            "fmt": "%(levelprefix)s %(message)s [%(asctime)s]",
            "datefmt": "%Y-%m-%dT%H:%M:%S",
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",
        },
    },
    "loggers": {
        "Media Monitoring API": {
            "handlers": ["default"],
            "level": "DEBUG",
        },
    },
}


dictConfig(log_config)

logger = logging.getLogger("Media Monitoring API")
