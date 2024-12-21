/**
* DOCU: This function is used to get the coordinates (longtitude, latitude) of the given address. <br>
* This is being called on seminar details, getting the coordinates to use on the minimap. <br>
* Last Updated Date: December 21, 2024 <br>
* @function
* @param {object} req - request
* @param {object} res - response
* @author Cesar
*/
const getCoordinates = async (req, res) => {
    /* Get address from query string */
    const { address } = req.query;
    /* Construct the URL to query the Nominatim API with the provided address */
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    try{
        /* Make a request to the Nominatim API */
        const response = await fetch(url);

        const data = await response.json();

        /* Check if the response contains at least one result */
        if(data.length > 0){
            /* Extract latitude and longitude from the first result */
            const { lat, lon } = data[0];

            res.json({ lat: parseFloat(lat), lon: parseFloat(lon) });
        }
        else{
            res.status(404).json({ error: 'No results found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching coordinates' });
    }
}


export default getCoordinates;