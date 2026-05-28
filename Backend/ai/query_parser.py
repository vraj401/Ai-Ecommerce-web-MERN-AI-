import re

def extract_filters(query):

    filters = {
        "max_price": None,
        "brand": None,
        "category": None
    }

    q = query.lower()

    price_match = re.search(r'under\s*(\d+)', q)

    if price_match:
        filters["max_price"] = int(price_match.group(1))

    brands = ["nike", "adidas", "puma", "vector", "bone"]

    for b in brands:
        if b in q:
            filters["brand"] = b

    if "shoe" in q:
        filters["category"] = "Footwear"

    return filters