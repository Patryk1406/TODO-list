class NotFoundError extends Error {}

function handleError(err, req, res, next) {
    console.log('xdf');
    res.render('error');
}

module.exports = {
    handleError
}