import logging
import sys
from app.core.config import settings

def get_logger(name: str):
    """Creates a logger with a given name"""
    logger = logging.getLogger(name)
    level = logging.DEBUG if settings.DEBUG else logging.INFO
    logger.setLevel(level)
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    if not logger.handlers:
        logger.addHandler(console_handler)

    return logger
