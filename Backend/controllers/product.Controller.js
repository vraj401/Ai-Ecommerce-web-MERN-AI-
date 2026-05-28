import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

const query = {};

if (keyword) {
      query.$text = {
        $search: keyword,
      };
    }

     if (category) {
      query.category = category;
    }

    // Brand Filter
    if (brand) {
      query.brand = brand;
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.sellingPrice = {};

      if (minPrice) {
        query.sellingPrice.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.sellingPrice.$lte = Number(maxPrice);
      }
    } 
    
  
    let sortOption = {};

    // Sorting
    switch (sort) {
      case "lowToHigh":
        sortOption = { sellingPrice: 1 };
        break;

      case "highToLow":
        sortOption = { sellingPrice: -1 };
        break;

      case "rating":
        sortOption = { averageRating: -1 };
        break;

      case "newest":
        sortOption = { createdAt: -1 };
        break;

      default:
        sortOption = {};
    }


 const skip = (page - 1) * limit;

 const totalProducts = await Product.countDocuments(query);

 const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });


  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductsByPids = async (req, res) => {
  try {
    const pids = Array.isArray(req.body.pids)
      ? req.body.pids.filter(Boolean)
      : [];

    if (!pids.length) {
      return res.json({ products: [] });
    }

    const products = await Product.find({
      pid: { $in: pids },
    });

    const productByPid = new Map(
      products.map((product) => [product.pid, product])
    );

    res.json({
      products: pids
        .map((pid) => productByPid.get(pid))
        .filter(Boolean),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
