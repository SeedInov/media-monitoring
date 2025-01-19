from app.repo import Database

class NewsRepo:
    def __init__(self):
        self.news = Database().news

    async def fetch(self, limit, offset, match={}) -> list:
        news = list(
            await self.news.aggregate(
                [
                    {"$match": match},
                    {
                        "$addFields": {
                            "id": {"$toString": "$_id"},
                        }
                    },
                    {"$project": {"_id": 0}},
                    {"$skip": offset},
                    {"$limit": limit},
                ]
            ).to_list(None)
        )
        return news

    async def fetch_count(self, match={}) -> int:
        count = list(
            await self.news.aggregate([{"$match": match}, {"$count": "count"}]).to_list(
                None
            )
        )
        if count:
            return count[0]["count"]
        return 0
