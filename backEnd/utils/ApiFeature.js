class ApiFeature{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }
    search(){
        // either keywrd is there or not
        const keyword=this.queryString.keyword ? {
            name:{
                $regex:this.queryString.keyword,
                $options:"i",
            },
        }:{};
        // out of all results find the given pattern
        // {...variable} provides a copy of variable rather than refrence
        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy={...this.queryString}
        // remove fields to filter for category
        const removeFields=["page","keyword","limit"]
        removeFields.forEach(key=>delete queryCopy[key])
        // for price and rating
        let queryString=JSON.stringify(queryCopy);
        // to convert the lt-->$lt for mongodb queries
        queryString=queryString.replace(/\b(lt|lte|gt|gte)\b/g,(key)=>`$${key}`);
        

        this.query=this.query.find(JSON.parse(queryString));
        return this;
    }
    pagination(resultsPerPage){
        const currentPage=Number(this.queryString.page)||1;
        const skip=resultsPerPage*(currentPage-1)
        // limts the no. of results and skips to given products
        this.query=this.query.limit(resultsPerPage).skip(skip);
        return this;
    }
}
module.exports=ApiFeature