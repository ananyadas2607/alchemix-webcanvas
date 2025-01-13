import httpx
from typing import List
from app.core.config import settings
from app.schemas.template import Image, ImageCredit

class UnsplashService:
    def __init__(self):
        self.api_url = "https://api.unsplash.com"
        self.access_key = settings.UNSPLASH_ACCESS_KEY

    async def get_images(self, keywords: List[str], count: int = 3) -> List[Image]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.api_url}/search/photos",
                    params={
                        "query": " ".join(keywords),
                        "per_page": count,
                        "orientation": "landscape",
                    },
                    headers={
                        "Authorization": f"Client-ID {self.access_key}"
                    }
                )
                response.raise_for_status()
                
                data = response.json()
                return [
                    Image(
                        id=photo["id"],
                        url=photo["urls"]["regular"],
                        credit=ImageCredit(
                            name=photo["user"]["name"],
                            link=photo["user"]["links"]["html"]
                        )
                    )
                    for photo in data["results"]
                ]
            except Exception as e:
                raise Exception(f"Error fetching images: {str(e)}")