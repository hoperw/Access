class QueryManager {

    constructor(query, urlQuery) {
        this.query = query;
        this.urlQuery= urlQuery;
    }

    filter() {
        // create an object from the queryString
        const queryObj = {...this.urlQuery};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];

        excludedFields.forEach(field => delete queryObj[field]);

        let queryStr = JSON.stringify(queryObj);
        // change queries to include MonoDB operators when found
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }
    sort() {
        if (this.urlQuery.sort) {
            const sortBy = this.urlQuery.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    limit() {
        // field limiting
        if (this.urlQuery.fields) {
            const fields = this.urlQuery.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        } else {
            // automatically remove mongoose automated response
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate() {
        // pagination
        // skip is to the page, limit is amount on page
        const page = this.urlQuery.page * 1 || 1;
        const limit = this.urlQuery.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = QueryManager;