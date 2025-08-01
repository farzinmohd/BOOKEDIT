import Products from "../../Models/ProductModel.js";

/**
 * admin add product
 */

const AddProduct = async (req, res) => {
  const {
    productName,
    price,
    stock,
    author,
    description,
    category,
    publisher,
    images,
    language,
  } = req.body;


const review=[
    {user_id:'6728eea845cc2dc73be65f74',userName:"Vinod",star:3,comment:"very nice "},
    {user_id:'672b1849e3ba520c9f1389d8',userName:"Hari",star:2,comment:" nice product"},
    {user_id:'6728618a4970cb6d054bd4f3',userName:"John",star:4,comment:"very nice product"},
  ]
  if(productName.trim()===''){
    return res.status(401).json({messageToProductname:"*This field is required"})
  }
  if(price===''){
    return res.status(401).json({messageToStock:"*This field is required"})
  }
  if(stock===''){
    return res.status(401).json({messageToCarat:"*This field is required"})
  }
  if(author===''){
    return res.status(401).json({messageToPrice:"*This field is required"})
  }
  if(description.trim()===''){
    return res.status(401).json({messageToDescription:"*This field is required"})
  }
  if(category.trim()===''){
    return res.status(401).json({messageToCategory:"*This field is required"})
  }
  if(publisher.trim()===''){
    return res.status(401).json({messageToOrigin:"*This field is required"})
  }
  if(language.trim()===''){
    return res.status(401).json({messageToOrigin:"*This field is required"})
  }
try {
    const product = await  Products.create({
        productName,
        price,
        stock,
        author,
        description,
        category,
        publisher,
        review,
        images,
        language,
      })
      res.status(200).json({ message: " product addedd successfull",product })
} catch (error) {
    res.status(500).json({ message: "internal server error" })
}
};

/**
 * listing product 
 * pagination
 */

const ListProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 

    const skip = (page - 1) * limit; 
    const products = await Products.find().skip(skip).limit(limit); 
    const totalProducts = await Products.countDocuments(); 
    const totalPage = Math.ceil(totalProducts / limit);
    const currentPage = page;

    res.status(200).json({
      message: "Products listed successfully",
      totalPage,
      totalProducts,
      currentPage,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
};

/**
 * admin block and unblock products
 */
const BlockProduct = async (req,res)=>{
  const { id } = req.body;

  try {
    if (id) {
      const product = await Products.findById(id);
      if (!product) {
        return res.status(404).json({ message: "product not fount"})
      }
      product.status = !product.status;
      await product.save();
      res.status(200).json({ message: "success" });
    }else{
      res.status(400).json({ message: "Invalid or missing user ID" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}  

/**
 * admin edit product
 */

const EditProduct =async (req,res)=>{
  const {
    productName,
    price,
    stock,
    author,
    description,
    category,
    publisher,
    language,
    _id,
  } = req.body
  if(productName.trim()===''){
    return res.status(401).json({messageToProductname:"*This field is required"})
  }
  if(price===''){
    return res.status(401).json({messageToStock:"*This field is required"})
  }
  if(stock===''){
    return res.status(401).json({messageToCarat:"*This field is required"})
  }
  if(author===''){
    return res.status(401).json({messageToPrice:"*This field is required"})
  }
  if(description.trim()===''){
    return res.status(401).json({messageToDescription:"*This field is required"})
  }
  if(category.trim()===''){
    return res.status(401).json({messageToCategory:"*This field is required"})
  }
  if(publisher.trim()===''){
    return res.status(401).json({messageToOrigin:"*This field is required"})
  }
  if(language.trim()===''){
    return res.status(401).json({messageToOrigin:"*This field is required"})
  }
  try {
    const product = await Products.findByIdAndUpdate(_id,req.body);
    console.log(product)
    res.status(200).json({ message: "update successfully" });
  } catch (error) {
    console.log(error)
  }
}

/**
 * get edit product
 */

const GetEditProduct = async (req,res)=>{

  const { product_id } = req.query

  try {
   const product = await Products.findById(product_id)
   res.status(200).json({ message: "get edit data successfully",product });
  } catch (error) {
    console.log(error)
  }
}

/**
 * admin delete product
 */
const DeleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Products.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export {
    AddProduct,
    ListProduct,
    BlockProduct,
    EditProduct,
    GetEditProduct,
    DeleteProduct,
}