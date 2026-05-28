import { exec } from "child_process";
import Product from "../models/product.model.js";

export const aiProductSearch = async (req, res) => {
 
  const { message } = req.body;

  console.log("Received message for AI:", message);

  exec(
    `../.venv/bin/python3 ai/shopping_agent2.py "${message}"`,
    
    async (error, stdout, stderr) => {

      if (error) {
        return res.status(500).json({
          error: error.message,
        });
      }

      try {
        console.log("Raw AI Output:", stdout);
        const result = JSON.parse(stdout);
        console.log("AI Response:", result);
        const pids = Array.isArray(result.products)
          ? result.products
              .map((product) => product.pid || product)
              .filter(Boolean)
          : [];

        const products = pids.length
          ? await Product.find({ pid: { $in: pids } })
          : [];

        const productByPid = new Map(
          products.map((product) => [product.pid, product])
        );

        res.json({
          ...result,
          products: pids
            .map((pid) => productByPid.get(pid))
            .filter(Boolean),
        });

      } catch(error){
        console.error("Error parsing AI response:", error);
        res.status(500).json({
          error: "Invalid AI response",
        });
      }
    }
  );

};
