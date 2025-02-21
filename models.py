import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

openrouter_api_key = os.getenv("OPENROUTER_KEY")

client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=openrouter_api_key)

completion = client.chat.completions.create(
    model="meta-llama/llama-3.3-70b-instruct:free",
    messages=[
        {"role": "system", "content": "You are a fact checking assistant."},
        {"role": "user", "content": "Write a haiku about recursion in programming."},
    ],
)

print(completion.choices[0].message)
