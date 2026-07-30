import asyncio
import os
import base64
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

load_dotenv(Path(__file__).parent.parent / "backend" / ".env")

ASSETS = Path(__file__).parent.parent / "frontend" / "src" / "assets"
API_KEY = os.getenv("EMERGENT_LLM_KEY")

PROMPT = (
    "Create a professional e-commerce product photograph of a 200 ml automobile dashboard "
    "polish bottle for the premium brand ELVORA-X. Match the exact brand style of the reference "
    "image: the circular emblem of green leaves with a glossy blue water droplet, the navy-blue "
    "serif 'ELVORA-X' wordmark, gold accents and a clean premium digital-printed label. "
    "The bottle is a sleek modern 200 ml plastic bottle with a black flip-top cap. "
    "The printed label must clearly read, top to bottom: 'ELVORA-X' with the emblem, then "
    "'CAR DASHBOARD POLISH', then 'PREMIUM AUTOMOBILE INTERIOR CARE', a small round 'PREMIUM QUALITY' "
    "gold seal, '200 ml', and at the bottom 'RICH SHINE - UV PROTECTION - ANTI DUST'. "
    "The label artwork should feature a glossy dark car dashboard / interior with a soft shine highlight, "
    "using a deep navy and forest-green palette with gold trim. "
    "Studio product shot: the single upright bottle centered on a clean white marble surface, "
    "soft realistic reflection and shadow, bright even lighting, sharp focus, photorealistic, "
    "vertical composition, plenty of clean background around the bottle."
)


async def main():
    ref_path = ASSETS / "royal-forest.png"
    with open(ref_path, "rb") as f:
        ref_b64 = base64.b64encode(f.read()).decode("utf-8")

    chat = LlmChat(api_key=API_KEY, session_id="elvora-bottle-gen", system_message="You are a product design image generator.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])

    msg = UserMessage(text=PROMPT, file_contents=[ImageContent(ref_b64)])
    text, images = await chat.send_message_multimodal_response(msg)
    print("text:", (text or "")[:120])
    if images:
        out = ASSETS / "car-dashboard-polish.png"
        with open(out, "wb") as f:
            f.write(base64.b64decode(images[0]["data"]))
        print("SAVED", out, images[0]["mime_type"])
    else:
        print("NO IMAGE RETURNED")


asyncio.run(main())
