const Location = require('./../models/locationModel');
const QueryManager = require('./../utils/queryManager');
const catchAsyncError = require('./../utils/catchAsyncError');
const ErrorManager = require('./../utils/errorManager');

const highestRated = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = 'ratingsQty';
    req.query.fields = 'name, ratingsQty, address, imgCover'
    next();
}

const createLocation = catchAsyncError(async (req, res, next) => {

    const newLocation = await Location.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            location: newLocation
        }
    });
})

const getAllLocations = catchAsyncError(async (req, res, next) => {

    let urlQuery = req.query;
    
    const queryManager = new QueryManager(Location.find(), urlQuery)
        .filter()
        .sort()
        .limit()
        .paginate();

    const locations = await queryManager.query;

    res.status(200).json({
        status: 'success',
        results: locations.length,
        data: {
            locations
        }
    })
})

const getLocation = catchAsyncError(async (req, res, next) => {


    const location = await Location.findById(req.params.id);

    if (!location) {
        return next(new ErrorManager('No tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'success', 
        data: {
            location
        }
    })
})

const updateLocation = catchAsyncError(async (req, res, next) => {

    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!location) {
        return next(new ErrorManager('No tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'success', 
        data: {
            location
        }
    })

})

const deleteLocation = catchAsyncError(async (req, res, next) => {

    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
        return next(new ErrorManager('No tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'success', 
        data: null
    })

})

const getLocationStats = catchAsyncError(async (req, res, next) => {

    const stats = await Location.aggregate([
        {
            $match: { ratingsQty: { $gte: 0 }, free: { $eq: true}}
        },
        {
            $group: {
                // group by id 
                _id: { $toUpper: '$address' },
                numLocations: { $sum: 1 },
                ratingsAvg: { $avg: '$ratingsQty' },
                minRating: { $min: '$ratingsQty'},
                sumRatings: { $sum: '$ratingsQty'}
            }
        },
        {
            $sort: { sumRatings: 1 }
        },
        {
            $match: { _id: { $ne: '2220 BARTON SPRINGS RD, AUSTIN, TX 78746'}}
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });

})

module.exports = {
    getAllLocations,
    getLocation, 
    createLocation,
    updateLocation,
    deleteLocation,
    highestRated,
    getLocationStats
}