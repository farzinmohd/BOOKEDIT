// import mongoose from "mongoose";
// import Offer from "../../Models/OfferModel.js";

// const AddOffer = async (req, res) => {
//   console.log("Request received at AddOffer");

//   try {
//     const {
//       offerName,
//       offerType,
//       discountValue,
//       discountTarget,
//       targets,
//       startDate,
//       expireDate,
//       description, // Include this in your schema as well
//     } = req.body;

//     console.log("Parsed offer data:", {
//       offerName,
//       offerType,
//       discountValue,
//       discountTarget,
//       targets,
//       startDate,
//       expireDate,
//       description,
//     });

//     // Create a new offer
//     const newOffer = await Offer.create({
//       offerName,
//       offerType,
//       discountValue,
//       discountTarget,
//       startDate,
//       expireDate,
//       description,
//     });

//     console.log("New offer created:", newOffer);

//     res.status(200).json({ message: "Offer added successfully", offer: newOffer });
//   } catch (error) {
//     console.error("Error adding offer:", error);
//     res.status(500).json({ message: "Internal server error", error });
//   }
// };

// export { AddOffer };

import Offer from "../../Models/OfferModel.js";

/**
 * create offer
 */

const AddOffer = async (req, res) => {
  try {
    const {
      offerName,
      offerType,
      discountValue,
      discountTarget,
      targets,
      startDate,
      expireDate,
      description,
    } = req.body;

    console.log("Parsed offer data:", {
      offerName,
      offerType,
      discountValue,
      discountTarget,
      targets,
      startDate,
      expireDate,
      description,
    });

    if (!targets || targets.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one target is required." });
    }

    const isValidTargetType =
      discountTarget === "Category" || discountTarget === "Product";
    if (!isValidTargetType) {
      return res.status(400).json({ message: "Invalid discount target type." });
    }
    console.log("check");

    // Create a new offer
    const newOffer = await Offer.create({
      offerName,
      offerType,
      discountValue,
      discountTarget,
      targets,
      startDate,
      expireDate,
      description,
    });

    res
      .status(200)
      .json({ message: "Offer added successfully", offer: newOffer });
  } catch (error) {
    console.error("Error adding offer:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

/**
 * getting offer
 */

const ListOffer = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const offers = await Offer.find().skip(skip).limit(limit);
    const totalOffers = await Offer.countDocuments();
    const totalOfferPage = Math.ceil(totalOffers / limit);
    const currentPage = page;


    res
      .status(200)
      .json({
        message: "offer getting successfully ",
        offers,
        totalOfferPage,
        totalOfferPage,
        currentPage
      });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * for block offer 
 */

const BlockOffer = async (req,res)=>{
    try {
        const {id} = req.body
        const offer = await Offer.findById(id);
        if (!offer) {
            return res.status(404).json({ message: "not fount"})
        }
        offer.status = !offer.status
        await offer.save();
        res.status(200).json({ message: "offer block and unblock successfully"})
    } catch (error) {
        
    }
}

export { AddOffer, ListOffer, BlockOffer };
