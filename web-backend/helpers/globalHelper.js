import cloudinary from 'cloudinary';

/**
* DOCU: This function is used to get the image url uploaded using cloudinary. <br>
* This is being called when there's an uploading of images. <br>
* Last Updated Date: December 17, 2024 <br>
* @function
* @param {object} image_file - the uploaded image
* @author Cesar
*/
const getUploadedImageUrl = async (image_file) => {
    /* Convert the image file buffer into a base64 encoded string */
    const convert_to_base64 = Buffer.from(image_file.buffer).toString("base64");
    
    /* Construct the data URI for the image */
    const dataURI = `data:${image_file.mimetype};base64,${convert_to_base64}`;

    /* Upload the image to Cloudinary and get the image URL */
    const uploadResult = await cloudinary.v2.uploader.upload(dataURI);

    return uploadResult?.url
}

/**
* DOCU: This function is used to format date to locale date for readibility. <br>
* This is being called to format date. <br>
* Last Updated Date: December 17, 2024 <br>
* @function
* @param {string} dateToFormat - date to be formatted
* @author Cesar
*/
const formatToLocaleDate = (dateToFormat) => {
    const date = new Date(dateToFormat);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return formattedDate;
}

/**
* DOCU: This function is used to format date to locale date for readibility. <br>
* This is being called to format date. <br>
* Last Updated Date: December 17, 2024 <br>
* @function
* @param {number} page - page number
* @param {number} limit - data limitation per page
* @param {string} sortKey - key for sorting
* @param {string} sortDirection - sort direction (ascending or descending)
* @author Cesar
*/
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