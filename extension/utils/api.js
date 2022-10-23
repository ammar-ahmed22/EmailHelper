class API{
    constructor(uri){
        //http://localhost:5000/api/v1
        this.uri = uri
    }

    get = async (endpoint) => {
        // endpoint = /test
        const url = this.uri + endpoint
        return await fetch(url).then( resp => resp.json()).then(data => data).catch( err => err)
    }
}

export default API;