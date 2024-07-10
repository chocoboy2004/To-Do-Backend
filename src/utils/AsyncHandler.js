const AsyncHandler = (requestHandle) => {
    return (req, res, next) => {
        Promise
        .resolve(requestHandle(req, res, next))
        .catch(error => next(error))
    }
}

export default AsyncHandler