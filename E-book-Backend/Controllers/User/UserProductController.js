import Products from "../../Models/ProductModel.js";
import mongoose from "mongoose";
import Offer from '../../Models/OfferModel.js'
import Cart from '../../Models/CartModel.js'
import Wishlist from '../../Models/WhishlistModel.js'




/**
 * get offers
 */


const getOffer = async (product_id) => {


  try {
    const product = await Products.findById(product_id);

    if (!product) {
      throw new Error(`Product with ID ${product_id} not found`);
    }

    const offerForProduct = await Offer.find({
      discountTarget: { $in: [product_id] },
      status: true,
      expireDate: { $gt: Date.now() },
    });

    const offerForCategory = await Offer.find({
      discountTarget: { $in: [product.category] },
      status: true,
      expireDate: { $gt: Date.now() },
    });

    const allOffers = [...offerForProduct, ...offerForCategory];

    const largestOffer = allOffers.reduce(
      (max, current) => (current.offer > max ? current.offer : max),
      0 
    );

    return largestOffer; 
  } catch (error) {
    console.error("Error in getOffer:", error.message);
    throw error;
  }
};



/**
 * list  products
 */

const ListProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit; 
    const category = req.query.category;
    const sort = req.query.sort || "" ;

    const sortOption = {};
    if (sort == 'price-all')  sortOption.price    
    if (sort == 'price-accending')  sortOption.price = -1;   
    if (sort == 'price-descending') sortOption.price = 1;
    if (sort == 'Popularity') sortOption.price = -1
    if (sort == 'newest')  sortOption.createdAt = -1

    /**
     * filtering category
     */

    const categoryFilter = { status : true };
    if (category && category !=  "all") {
      categoryFilter.category = category
    }
    const allProducts = await Products.find(categoryFilter)
    const products = await Products.find(categoryFilter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    const totalProducts = await Products.countDocuments(categoryFilter);
    const totalPage = Math.ceil(totalProducts / limit);
    const currentPage = page;

    if (!products || products.length === 0) {
      return res.status(401).json({ message: "block products" });
    }
    res
      .status(200)
      .json({
        message: "products listing succussfully",
        totalPage,
        totalProducts,
        currentPage,
        products,
        allProducts
      });
  } catch (error) {
    res.status(500).json({ message: "error retrieve products" });
  }
};

/**
 * Get single product details
 */
const ProductDetails = async (req, res) => {
  const { product_id, userId } = req.query;

 console.log('userId', userId)
  try {
    if (!mongoose.Types.ObjectId.isValid(product_id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const offer = await getOffer(product_id)
    const productDetails = await Products.findById(product_id);
    
    // if (!productDetails) {
    //   return res.status(404).json({ message: "Product details not found" });
    // }
    if(userId&& userId !== 'null'){
      const cart = await Cart.findOne({
        user_id: userId,
        items: { $elemMatch: { product_id: product_id } }
      });
      const wishlist=await Wishlist.findOne({
        user_id:userId,
        items:{$elemMatch:{product_id:product_id}}
      })
      const isCart = !!cart;
      const isWishlist = !!wishlist;     

    res.status(200).json({ message: "Success", productDetails,isCart, isWishlist });
    }else{
    res.status(200).json({ message: "Success", productDetails,offer });

    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


export { ProductDetails, ListProduct };
