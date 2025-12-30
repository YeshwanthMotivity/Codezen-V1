# documentation_agent.py
import google.generativeai as genai
import time

class DocumentationAgent:
    def __init__(self, model_name="gemini-2.5-flash"):
        self.model_name = model_name
        print("[INIT] Initializing DocumentationAgent...")

        try:
            self.model = genai.GenerativeModel(model_name)
            print(f"✅ Model loaded successfully: {model_name}")
        except Exception as e:
            print(f"❌ Error initializing Gemini model: {e}")
            raise

    def generate_docs_for_file(self, file_name, file_content):
        """Generate documentation for a single file"""
        print(f"\n[START] Generating docs for file: {file_name}")
        start_time = time.time()

        try:
            print(f"[DEBUG] File size: {len(file_content)} characters")

            # Step 1: Preparing prompt
            print("[STEP] Building prompt for Gemini model...")

            prompt = f"""
            You are a professional technical writer.
            Analyze this Python file and generate documentation with the following format:

            File: {file_name}

            Format:
            1. **Purpose:** Explain what the file does.
            2. **Key Functions and Classes:** Summarize their roles.
            3. **Dependencies:** Mention imported modules or dependencies.
            4. **Example Usage:** Provide an example if possible.
            5. **Overall Summary:** Summarize the file in one paragraph.

            Code:
            {file_content}
            """

            # Step 2: Send to Gemini
            print("[STEP] Sending prompt to Gemini model for generation...")
            response = self.model.generate_content(prompt)

            # Step 3: Process response
            print("[STEP] Processing Gemini response...")
            result = response.text.strip()

            elapsed = round(time.time() - start_time, 2)
            print(f"✅ Documentation generated for: {file_name} (Time: {elapsed}s)")
            return result

        except Exception as e:
            print(f"⚠️ Error generating docs for {file_name}: {e}")
            return f"Error generating documentation: {e}"
