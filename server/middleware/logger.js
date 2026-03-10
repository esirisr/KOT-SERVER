const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        const bodyCopy = { ...req.body };
        if (bodyCopy.password) bodyCopy.password = '********';
        console.log('Body:', bodyCopy);
    }
    next();
};

export default logger;
