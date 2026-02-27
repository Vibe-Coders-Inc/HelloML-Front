from openai import OpenAI
import os

client = OpenAI()
voices = ["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse", "marin"]
out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "voices")
os.makedirs(out_dir, exist_ok=True)

for voice in voices:
    path = os.path.join(out_dir, f"{voice}.mp3")
    if os.path.exists(path):
        print(f"Skipping {voice} (already exists)")
        continue
    print(f"Generating {voice}...")
    response = client.audio.speech.create(model="gpt-4o-mini-tts", voice=voice, input="Hello! How can I help you today?")
    response.stream_to_file(path)
    print(f"  Saved {path}")

print("Done!")
