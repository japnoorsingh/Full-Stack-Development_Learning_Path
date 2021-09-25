const Tour = require('../models/tourModel.js');
const APIfeatures = require('../utils/appFeatures.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');

//================ Get all tours =========================
exports.getAllTours = catchAsync(async (req, res, next) => {

  const features = new APIfeatures(Tour.find(), req.query)
    .sort()
    .limitFields()
    .pagination();
  const tours = await features.query;
  // const tours = await query;

  //SEND RESPONSE
  res.json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });

  // try {
    //BUILD QUERY (Shifted to the class)
    //we might have done queryObj = req.query but updating queryObj would have updated req.query as well so we made a new object
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'limit', 'sort', 'fields'];

    // //Now we will loop over the excludedFields and remove the element from queryObject if it's present
    // excludedFields.forEach(el => {
    //   delete queryObj[el];
    // });

    // //we get req.query as original and then we remove the fields added in excluded and get new object as queryObj which we use for quering
    // console.log(req.query, queryObj); //Used for filetering in tours

    // // const tours = await Tour.find(req.query);//we used it when we wanted to filter with all the fields
    // let query = Tour.find(queryObj); //Now as we don't want to filter through all the query parameter we are using them

    //SORTING THE RESPONSE (Shifted to the class)
    //Sorting the response
    // if (req.query.sort) {
    //   query = query.sort(req.query.sort);
    // } else {
    //   query = query.sort('-createdAt;');
    // }

    //FILTERING ONLY REQUIRED FIELDS (Shifted to the class)
    //Getting only the required field in response
    //for http://localhost:300/api/v1/tours?fields=name,difficulty,duration we will make it 'name difficutly duration' for the query string
    // if (req.query.fields) {
    //   const field = req.query.fields.split(',').join(' ');
    //   query = query.select(field);
    // } else {
    //   query = query.select('-__v');
    // }

    //ADDING PAGINATION TO THE API (Shifted to the class)
    //Adding pagination to the api
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTour = await Tour.countDouments();
    //   if (skip >= numTour) {
    //     throw new Error('Page does not exist');
    //   }
    // }

    //EXECUTE QUERY
  //   const features = new APIfeatures(Tour.find(), req.query)
  //     .sort()
  //     .limitFields()
  //     .pagination();
  //   const tours = await features.query;
  //   // const tours = await query;

  //   //SEND RESPONSE
  //   res.json({
  //     status: 'success',
  //     results: tours.length,
  //     data: {
  //       tours
  //     }
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

//================ Get Single tour =========================
exports.getSingleTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if(!tour) {
    return next(new AppError('No tour found with the provided ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });

  //First iteration of error handling
  // try {
  //   const tour = await Tour.findById(req.params.id);

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       tour
  //     }
  //   });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     log: 'Id not found',
  //     message: err
  //   });
  // }
});

//================ Add a new tour =========================
exports.addNewTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });

  //=== ERROR HANDLING (Iteration 1) ===
  // try {
  //   const newTour = await Tour.create(req.body);

  //   res.status(201).json({
  //     status: 'success',
  //     data: {
  //       tour: newTour
  //     }
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

//================ Update a tour =========================
exports.updateSingleTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if(!tour) {
    return next(new AppError('No tour found with the provided ID', 404));
  }

  res.status(201).send({
    status: 'success',
    data: {
      updatedTour
    }
  });
  //First iteration
  // try {
  //   const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
  //     new: true,
  //     runValidators: true
  //   });

  //   res.status(201).send({
  //     status: 'success',
  //     data: {
  //       updatedTour
  //     }
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

//================ Delete a tour =========================
exports.deleteSingleTour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if(!tour) {
    return next(new AppError('No tour found with the provided ID', 404));
  }

  res.status(204).send({
    status: 'success',
    data: null
  });

  //First Iteration
  // try {
  //   await Tour.findByIdAndDelete(req.params.id);

  //   res.status(204).send({
  //     status: 'success',
  //     data: null
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

//======== AGGREGATION PIPELINE ADDED =============

//Take a look at docs here: https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
exports.getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
      {
        $match: {
          ratingAverage: { $gte: 4.5 }
        }
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingQuantity' },
          averageRating: { $avg: '$ratingAverage' },
          averagePrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $max: '$price' }
        }
      },
      {
        $sort: { averagePrice: 1 }
      }
    ]);

    res.json({
      status: 'success',
      results: stats.length,
      data: {
        stats
      }
    });


  //First Iteration
  // try {
  //   const stats = await Tour.aggregate([
  //     {
  //       $match: {
  //         ratingAverage: { $gte: 4.5 }
  //       }
  //     },
  //     {
  //       $group: {
  //         _id: '$difficulty',
  //         numTours: { $sum: 1 },
  //         numRatings: { $sum: '$ratingQuantity' },
  //         averageRating: { $avg: '$ratingAverage' },
  //         averagePrice: { $avg: '$price' },
  //         maxPrice: { $max: '$price' },
  //         minPrice: { $max: '$price' }
  //       }
  //     },
  //     {
  //       $sort: { averagePrice: 1 }
  //     }

  //     //This will exclude the matching results
  //     // {
  //     //   $match: {_id: {$ne: 'easy'}}
  //     // }
  //   ]);

  //   res.json({
  //     status: 'success',
  //     results: stats.length,
  //     data: {
  //       stats
  //     }
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tour: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' } //Adds additional field at the end of the object
    },
    {
      $project: {
        _id: 0 //Will hide _id in response coz we added 0
      }
    },
    {
      $sort: { numTourStarts: -1 } //This sorts in descending order
      // $sort: { numTourStarts: 1} This sorts in ascending order
    },
    {
      $limit: 12 //Limits responses
    }
  ]);

  res.json({
    status: 'success',
    results: plan.length,
    data: {
      plan
    }
  });

  //First Iteration
  // try {
  //   const year = req.params.year * 1;

  //   const plan = await Tour.aggregate([
  //     {
  //       $unwind: '$startDates'
  //     },
  //     {
  //       $match: {
  //         startDates: {
  //           $gte: new Date(`${year}-01-01`),
  //           $lte: new Date(`${year}-12-31`)
  //         }
  //       }
  //     },
  //     {
  //       $group: {
  //         _id: { $month: '$startDates' },
  //         numTourStarts: { $sum: 1 },
  //         tour: { $push: '$name' }
  //       }
  //     },
  //     {
  //       $addFields: { month: '$_id' } //Adds additional field at the end of the object
  //     },
  //     {
  //       $project: {
  //         _id: 0 //Will hide _id in response coz we added 0
  //       }
  //     },
  //     {
  //       $sort: { numTourStarts: -1 } //This sorts in descending order
  //       // $sort: { numTourStarts: 1} This sorts in ascending order
  //     },
  //     {
  //       $limit: 12 //Limits responses
  //     }
  //   ]);

  //   res.json({
  //     status: 'success',
  //     results: plan.length,
  //     data: {
  //       plan
  //     }
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err
  //   });
  // }
});

//========================= Importing data from JSON file==========================

// const fs = require('fs');
// const path = require('path');
// const tours = require(path.join(
//   __dirname,
//   '../dev-data/data/tours-simple.json'
// ));

// exports.checkBody = (req, res, next) => {
//   console.log('Checking if the name and price is defined correctly');

//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'name or price cannot be undefined'
//     });
//   }

//   next();
// };

// exports.checkId = (req, res, next, val) => {
//   console.log(`Id requested is ${req.params.id}`);
//   if (req.params.id >= tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// //================ Get all tours =========================
// exports.getAllTours = (req, res) => {
//   res.json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     result: tours.length,
//     data: {
//       tours
//     }
//   });
// };

// //================ Get Single tour =========================
// exports.getSingleTour = (req, res) => {
//   // console.log(req.params);

//   const id = req.params.id * 1;

//   //tours.find will return an object so we can access value using eg (tour.id)
//   const tour = tours.find(ele => {
//     return ele.id === id;
//   });

//   //tours.filter will return an array of oject (Although only one) so we can access value using eg (tour[0].id)
//   // const tour = tours.filter(ele => {
//   //  return ele.id === id;
//   // });

//   // if(id > tours.length){ //This is also one of the way to check invalid url
//   // if (!tour) {
//   //   res.status(404).send({
//   //     status: 'fail',
//   //     message: 'Invalid ID'
//   //   });
//   //   return;
//   // }

//   res.status(200).send({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// };

// //================ Add a new tour =========================
// exports.addNewTour = (req, res) => {
//   // console.log(req.body);

//   const newId = tours[tours.length - 1].id + 1;

//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);

//   fs.writeFile(
//     path.join(__dirname, '../dev-data/data/tours-simple.json'),
//     JSON.stringify(tours),
//     err => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour
//         }
//       });
//     }
//   );

//   // res.send('Done'); //We cannout send the reponse twice.
// };

// //================ Update a tour =========================
// exports.updateSingleTour = (req, res) => {
//   // res.status(201).send('Dummy Updated success');
//   const id = req.params.id * 1; //get the id from request

//   const tour = tours.find(ele => {
//     //Find the tour from the tours array
//     return ele.id === id;
//   });

//   //404 Error handler
//   // if (!tours) {
//   //   res.status(404).send({
//   //     status: 'fail',
//   //     message: 'Invalid ID'
//   //   });
//   // }

//   //201 Respose handler
//   const updatedTour = Object.assign(tour, req.body); //Update the tour

//   //Write the file with the update tour and send back the updated tour
//   fs.writeFile(
//     path.join(__dirname, './dev-data/data/tours-simple.json'),
//     JSON.stringify(tours),
//     err => {
//       res.status(201).send({
//         status: 'success',
//         data: {
//           updatedTour
//         }
//       });
//     }
//   );
// };

// //================ Delete a tour =========================
// exports.deleteSingleTour = (req, res) => {
//   const id = req.params.id * 1; //Took the id from request

//   const tour = tours.find(ele => {
//     //Finding the tour from the all the of tours
//     return ele.id === id;
//   });

//   //Handling 404 error (If no tour found with the id)
//   // if (!tour) {
//   //   res.status(404).send({
//   //     status: 'fail',
//   //     message: 'Invalid ID'
//   //   });
//   // }

//   //204 Status handler
//   //I will take all the tours which don't match the 'tour.id' in a single array and then overwrite the json file with this new array.

//   //Create a new array of tours excluding the tour which has to be deleted
//   const toursAfterDeletion = tours.filter(ele => {
//     return ele.id !== tour.id;
//   });

//   //Rewritting the file with the new tours array.
//   fs.writeFile(
//     path.join(__dirname, '../dev-data/data/tours-simple.json'),
//     JSON.stringify(toursAfterDeletion),
//     err => {
//       res.status(204).send({
//         status: 'success',
//         data: null
//       });
//     }
//   );
// };
