import config from  './../../config';

const axios = require('axios');
const data = require('./__test__/test_data.json');


export const makeHttpCall = async (options) => {

    console.log(">>>>>>>>>>>>>>> makeHttpCall"); 
    
    try {
        
        let response = await axios(options);
        console.log('response',response);
        return  response.data;
    }
    catch (e) {
        throw new Error("makeHttpCall" + e.message );
    }
}

export const getData = async ( playerId) => {
    console.log(">>>>>>>>>>>>>>> getData");
    const options =
    {
        method: 'get',
        url: config.SERVER_BASE_URL +'/v1/player/getdocument/'+ playerId
    }

    try
    {
        
        const data = await makeHttpCall(options);
        
        if(data.message !== undefined)
        {
            alert(`Player ${playerId} not fount`);
            return [];
        }  
        console.log(">>>>>>>>>>>>>>> RETURNING Data", data);      
        return data.documents;              
    } 
    catch(e){
        alert(e.message);
    }

}





