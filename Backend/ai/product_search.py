from db import products_collection

def search_products(filters):

    query = {}

    # PRICE
    if filters.get("max_price"):
        query["sellingPrice"] = {
            "$lte": filters["max_price"]
        }

    # BRAND
    if filters.get("brand"):
        query["brand"] = {
            "$regex": filters["brand"],
            "$options": "i"
        }

    # CATEGORY/TITLE
    if filters.get("category"):
        query["title"] = {
            "$regex": filters["category"],
            "$options": "i"
        }

    products = list(
        products_collection.find(query).limit(5)
    )

    for product in products:
        product["_id"] = str(product["_id"])

    return products