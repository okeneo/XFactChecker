import logging
import os
import re

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from openai import OpenAI

app = FastAPI()

load_dotenv()

logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_KEY")

NOT_APPLICABLE_CODE = "CHECKFACT"
API_PROVIDER_URL = "https://openrouter.ai/api/v1"
MODEL = "meta-llama/llama-3.3-70b-instruct:free"
SYSTEM_PROMPT = (
    "You are a fact checking assistant. Use reliable, evidence-based sources. "
    "You give only the percentage on how true a statement is. "
    "If there is a statement such as 'I am pregnant' where it is "
    f"impossible to know if the user is pregnant, add '{NOT_APPLICABLE_CODE}' to the response."
)


@app.post("/fact")
def fact_check(payload: dict):
    text = payload.get("text", "")

    if not text:
        raise HTTPException(status_code=404, detail="Text not found")

    response = model(text)
    logger.info(response)
    return {"message": response}


def model(content):
    logger.info(f'Requested text: "{content}"')
    client = OpenAI(base_url=API_PROVIDER_URL, api_key=OPENROUTER_API_KEY)
    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {"role": "user", "content": content},
        ],
    )
    message = completion.choices[0].message
    logger.info(message)
    result = extract_result(message.content)
    return result


def extract_result(input_str):
    if NOT_APPLICABLE_CODE in input_str:
        return NOT_APPLICABLE_CODE

    match = re.match(r"(\d+%)(.*)", input_str)
    if match:
        percentage = match.group(1).strip().rstrip("%")
        return percentage
    return None
