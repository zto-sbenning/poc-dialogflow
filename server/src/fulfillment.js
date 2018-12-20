

module.exports = {
    read(request) {
        console.log(request);
        return {
            request
        };
    }
}

