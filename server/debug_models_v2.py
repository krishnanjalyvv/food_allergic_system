
import google.generativeai as genai
import sys
import os
from dotenv import load_dotenv

output_path = "models_list.txt"

with open(output_path, "w", encoding="utf-8") as f:
    try:
        f.write(f"google-generativeai version: {genai.__version__}\n")
        
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            f.write("ERROR: GOOGLE_API_KEY not found in .env\n")
            sys.exit(1)
            
        genai.configure(api_key=api_key)
        
        f.write("Listing models:\n")
        for m in genai.list_models():
            f.write(f"Model: {m.name}\n")
            if 'generateContent' in m.supported_generation_methods:
                f.write(f"  Supported: YES (generateContent)\n")
            else:
                f.write(f"  Supported: NO (methods: {m.supported_generation_methods})\n")
            f.write("-" * 20 + "\n")
            
    except Exception as e:
        f.write(f"Error: {e}\n")
