const { default: mongoose } = require('mongoose');
const slugify = require('slugify');

const locationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: [50, 'Location name has a max length of 50 characters'],
      minLength: [5, 'Location name has a max length of 5 characters']
    },
    slug: String,
    address: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    exactLocation: {
        lat: Number,
        longitude: Number
    },
    wheelChairAccessible: {
        type: String,
        enum: {
            values: ['easy', 'okay', 'difficult', 'inaccessible'],
            message: 'Ratings are easy, okay, difficult, or inaccessible'
        }
    },
    ratingsAverage: {
        type: Number,
        default: null,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be below 6']
    },
    ratingsQty: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    imgCover: {
        type: String,
        required: true
    },
    imgs: [String],
    free: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
  }, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
  })

/*

Mongoose model middleware (others are query, aggregate, document)

- the event is the save event
- runs before save, create



locationSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

// query middleware

locationSchema.pre(/^find/, function(next) {
    // filters out the "secret tours"
    // this.find({ secretTour: { $ne: true }})
    next();
})

// aggregation middleware

locationSchema.pre('aggregate', function(next) {
    console.log(this.pipeline());
    next()
})

*/

const Location = mongoose.model('Location', locationSchema);
  
module.exports = Location;

/*

Virtual properties

- property created each time you get something from database
- property does not persist in database
- 'this' keyword doesn't apply to arrow functions, so normal one is used below


tourSchema.virtual('durationWeeks').get(function() {

    // this points to current document

    return this.duration / 7;
})

*/




