const Provider = require('../models/Provider');

//@desc     Get all providers
//@route    GET /api/v1/providers
//@access   Public
exports.getProviders = async (req,res,next) => {
    let query;

    //Copy req.query
    const reqQuery = {...req.query};

    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over remove fields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    //Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Provider.find(JSON.parse(queryStr)).populate('bookings');

    //Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //Sort 
    if (req.query.sort) {
        const sortBy = req.query.select.split(',').join(' ');
        query = query.select(sortBy);
    } else {
        query = query.sort("name");
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    try {
        const total = await Provider.countDocuments();
        query = query.skip(startIndex).limit(limit);

        //Execute query
        const providers = await query;

        //Pagination result
        const pagination = {};

        if (endIndex < total){
            pagination.next = {
                page:page+1, 
                limit
            }
        }

        if (startIndex > 0){
            pagination.prev = {
                page:page-1, 
                limit
            }
        }

        res.status(200).json({success:true, count:providers.length, data:providers});
    } catch (err){
        res.status(400).json({success:false});
    }
    
};

//@desc     Get single provider
//@route    GET /api/v1/providers/:id
//@access   Public
exports.getProvider = async (req,res,next) => {
    try {
        const provider = await Provider.findById(req.params.id);

        if (!provider){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data:provider});
    } catch (err){
        res.status(400).json({success:false});
    }
    
};

//@desc     Create new provider
//@route    POST /api/v1/providers
//@access   Private
exports.createProvider = async (req,res,next) => {
    const provider = await Provider.create(req.body);
    res.status(201).json({success:true, data:provider});
};

//@desc     Update provider
//@route    PUT /api/v1/providers/:id
//@access   Private
exports.updateProvider = async (req,res,next) => {
    try {
        const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators:true
        });

        if (!provider){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data: provider});
    } catch (err){
        res.status(400).json({success:false});
    }
    
};

//@desc     Delete provider
//@route    DELETE /api/v1/providers/:id
//@access   Private
exports.deleteProvider = async (req,res,next) => {
    try {
        const provider = await Provider.findById(req.params.id);

        if (!provider){
            return res.status(404).json({success:false, message:`Provider not found with id of ${req.params.id}`});
        }

        await provider.deleteOne();
        res.status(200).json({success:true, data: {}});
    } catch (err){
        res.status(400).json({success:false});
    }
    
};