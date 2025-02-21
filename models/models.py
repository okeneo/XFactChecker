import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

openrouter_api_key = os.getenv("OPENROUTER_KEY")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_KEY")
API_PROVIDER_URL = "https://openrouter.ai/api/v1"
MODEL = "meta-llama/llama-3.3-70b-instruct:free"
SYSTEM_CONTENT = (
    "You are a fact checking assistant. You give only the percentage on how true a statement is."
)
def model(content):
    client = OpenAI(base_url=API_PROVIDER_URL, api_key=OPENROUTER_API_KEY)
    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_CONTENT,
            },
            {"role": "user", "content": content},
        ],
    )
    result = completion.choices[0].message.content
    return result