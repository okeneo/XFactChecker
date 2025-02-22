import logging
import os
import re

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

logger = logging.getLogger(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
NOT_APPLICABLE_CODE = "NOT_APPLICABLE"
API_PROVIDER_URL = "https://openrouter.ai/api/v1"
MODEL = "meta-llama/llama-3.3-70b-instruct:free"
SYSTEM_PROMPT = (
    "You are a fact checking assistant. Use reliable, evidence-based sources. "
    "You give only the percentage on how true a statement is. "
    "If there is a statement such as 'I am pregnant' where it is "
    f"impossible to know if the user is pregnant, add '{NOT_APPLICABLE_CODE}' to the response."
)


def fact_checker(content):
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
    if completion:
        if len(completion.choices) > 0:
            message = completion.choices[0].message
            logger.info(message)
            result = extract_result(message.content)
            return result
    return None


def extract_result(input_str):
    if NOT_APPLICABLE_CODE in input_str:
        return NOT_APPLICABLE_CODE

    match = re.search(r"(\d+)%", input_str)
    if match:
        percentage = match.group(1).strip().rstrip("%")
        return percentage
    return None
