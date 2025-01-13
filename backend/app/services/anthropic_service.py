import json
import logging
from anthropic import Anthropic
from ..core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def generate_template(description: str):
    try:
        anthropic = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        
        prompt = f"""You are a professional web developer. I need you to create a website template based on this description: "{description}"

        Important: Your response must be a valid JSON object with exactly this structure:
        {{
            "html": "<!-- Your HTML code here -->",
            "css": "/* Your CSS code here */"
        }}

        The HTML should be modern and semantic. The CSS should use modern practices. Make sure both work together to create a responsive design.
        Do not include any explanation or additional text - ONLY return the JSON object.
        """

        logger.info("Sending request to Anthropic...")
        
        message = anthropic.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=4000,
            temperature=0.7,
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )

        response_text = message.content[0].text.strip()
        logger.info(f"Raw response from Anthropic: {response_text[:200]}...")

        # Try to clean the response if it contains markdown code blocks
        if response_text.startswith("```") and response_text.endswith("```"):
            response_text = response_text.strip("```")
            if response_text.startswith("json"):
                response_text = response_text[4:].strip()

        try:
            response_data = json.loads(response_text)
            
            # Validate response structure
            if not isinstance(response_data, dict):
                raise ValueError("Response is not a dictionary")
            if "html" not in response_data or "css" not in response_data:
                raise ValueError("Response missing required fields")
            if not isinstance(response_data["html"], str) or not isinstance(response_data["css"], str):
                raise ValueError("HTML or CSS is not a string")

            logger.info("Successfully parsed template response")
            return {
                "html": response_data["html"],
                "css": response_data["css"]
            }
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            logger.error(f"Problematic text: {response_text}")
            raise Exception("Failed to parse AI response as JSON")
            
    except Exception as e:
        logger.error(f"Error in generate_template: {str(e)}")
        logger.error(f"Full error: {e}", exc_info=True)
        raise Exception(f"Failed to generate template: {str(e)}")