def rerank(docs, filters):

    ranked = []

    for doc in docs:

        meta = doc.metadata or {}

        score = 0

        if filters["brand"]:
            if filters["brand"].lower() in str(meta.get("brand", "")).lower():
                score += 3

        if filters["max_price"]:
            price = meta.get("selling_price", 0)

            if price <= filters["max_price"]:
                score += 2

        rating = meta.get("average_rating", 0)

        score += float(rating)

        ranked.append((score, doc))

    ranked.sort(reverse=True, key=lambda x: x[0])

    return [doc for score, doc in ranked]