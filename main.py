import logging

from fastapi import FastAPI, HTTPException

from models.models import fact_checker

app = FastAPI()

logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


@app.post("/fact")
def fact_check(payload: dict):
    text = payload.get("text", "")

    if not text:
        raise HTTPException(status_code=400, detail="Text not provided")

    response = fact_checker(text)
    logger.info(response)
    return {"message": response}
