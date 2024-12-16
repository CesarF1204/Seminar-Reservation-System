import cloudinary from 'cloudinary';

const getUploadedImageUrl = async (image_file) => {
    /* Convert the image file buffer into a base64 encoded string */
    const convert_to_base64 = Buffer.from(image_file.buffer).toString("base64");
    
    /* Construct the data URI for the image */
    const dataURI = `data:${image_file.mimetype};base64,${convert_to_base64}`;

    /* Upload the image to Cloudinary and get the image URL */
    const uploadResult = await cloudinary.v2.uploader.upload(dataURI);

    return uploadResult?.url
}

const formatToLocaleDate = (dateToFormat) => {
    const date = new Date(dateToFormat);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return formattedDate;
}

const paginationAndSorting = ({ page, limit, sortKey, sortDirection }) => {
    /* Convert to numbers and determine sort order */
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const sortOrder = sortDirection === 'asc' ? 1 : -1;

    /* Calculate the skip value for pagination */
    const skip = (pageNumber - 1) * limitNumber;

    return {
        pageNumber,
        limitNumber,
        skip,
        sort: { [sortKey]: sortOrder },
    };
};

export { getUploadedImageUrl, formatToLocaleDate, paginationAndSorting };