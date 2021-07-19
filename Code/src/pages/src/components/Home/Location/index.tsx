import React, { useEffect, useState } from 'react';

import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
//import styles from '../../../../../styles/Location.module.scss'; used on version 1


/**
 * @context location
 * 
 * uses 
 * 
 * @serviceApi location
 *  
 * 
 */
// const GET_LOCATION = gql`
// mutation GetLocationFromZipOrCity($value:String){
//       GetLocationFromZipOrCity(value:$value)
//       {
//            code
//            message
//            results{
             
//              geometry{
//                 location{
//                   lat
//                   lng
//                 }
//               }
//            }
//            predictions
//            {
//              description
//            }
//       }
// }
// `;

/**
 * @Pages
 * 
 * Location page to detect current position or find loation
 * uses location service
 * 
 * refrencing version of: 1/28/2021
 * source: https://github.com/emilynorton?tab=repositories
 * 
 * @param language the language to display the data 
 * @param prescriptionFromRoute the prescription been pased when useRoute is used
 * @param location the location passed from the route
 */

const Location = ({ language, prescriptionFromRoute, location }:any) => {

  let locationWithOutComas = "";

  /**@gets @sets the locations array from the mutation */
  const [locationsFromMutation, setLocationsFromMutation] = useState([]);

  /** @gets @sets the selected location  */
  const [getLocation, setLocation] = useState({});

  /**@gets @sets the reset to clear the location passed in the function*/
  const [reset, setReset] = useState(false);

  /** @set @gets windowsWidth  */
  const [windowWidth, setWindowWidth] = useState(0);

  /** @sets @gets the value in the input box */
  const [valueForInputValue, setValueForInputValue] = useState("");


  






  /** for alert message box */
  //const alert = useAlert();



  const getSizes = () => {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener(
      "resize", getSizes, false);
  });

  /**
   * Get Location Mutation Mutation that calls location service to retreve
   * location info from input box. It supports by city name and zip code 
   * 
   * @variable event.target.value
   * @context location  for Apollo.Link     
   */
  // const [getLocations, { loading: mutationLoading }] = useMutation(GET_LOCATION, {
  //   onError(err) {
  //     console.log(err);
  //     alert(err);

  //   },
  //   update(proxy, result) {
  //     try {
  //       console.log(result);
  //       if (result.data.GetLocationFromZipOrCity.code !== 200) {
  //         alert(result.data.GetLocationFromZipOrCity.message);
  //         return;
  //       }        
  //       if (result.data.GetLocationFromZipOrCity.predictions !== null && result.data.GetLocationFromZipOrCity.predictions !== undefined) {
           
  //         if(location === undefined && result.data.GetLocationFromZipOrCity.predictions.length === 0)
  //            return;
  //         if (result.data.GetLocationFromZipOrCity.predictions.length === 0) {
  //           alert("No Location Retreved");
  //           return;
  //         }
  //       }
  //       if (result.data.GetLocationFromZipOrCity.results !== null) {
        
  //         setValueForInputValue(undefined);
  //         const location = result.data.GetLocationFromZipOrCity.results[0].geometry.location;
  //         getAddressFromLatAndLng(location.lat, location.lng);
  //         setLocationsFromMutation(result.data.GetLocationFromZipOrCity.results);
  //         return;
  //       }
     
  //       setLocationsFromMutation(result.data.GetLocationFromZipOrCity.predictions)
  //     }
  //     catch (e) {
  //       alert(e);
  //     }
  //   }
  // });

  /**
   * Respondes to onChange function from input box
   * set the value and context for the GraphQl call 
   * 
   * @useState setValueForInputValue
   * @mutation getLocations
   * @event e
   */
  const searchLocation = (e:any) => {

    setValueForInputValue(e.target.value);
    setLocationsFromMutation([]);
    //getLocations({ variables: { value: e.target.value }, context: { clientName: 'location' } });


  }

  /**
   * Clears and resets the values from the input box 
   * 
   * @useState setValueForInputValue
   * @useState setReset
   * @useState setLocation
   * @event e 
   */
  const clearInput = (e:any) => {
    setValueForInputValue("");
    setReset(true);
    setLocation({});
    setLocationsFromMutation([]);
  }

  /**
   * Gets the reverse geocode for address with zip from latitude
   * and longitude 
   * 
   * @url https://api.bigdatacloud.net/data/reverse-geocode-client";
   * @useState setLocation
   * @useState setValueForInputValue
   * @param lat latitude
   * @param lng longitude
   * @function handleError
   */
  const getAddressFromLatAndLng = async (lat:any, lng:any) => {
    let myLocation:any;
    let latitude:any = `latitude=${lat}`;
    let longitude:any = `&longitude=${lng}`;
    let query:any = latitude + longitude + "&localityLanguage=en";
    let bigdatacloud_api:any = process.env.locationUrl;

    bigdatacloud_api += `?${query}`;
    let myObj:any = await fetch(bigdatacloud_api)
      .catch(()=>{console.log("error")});

    if (myObj.ok) {
      let obj = await myObj.json();
      console.log(obj);
      myLocation = {
        latitude: lat,
        longitude: lng,
        postCode: obj.postcode,
        city: obj.locality,
        country: obj.countryName,
        state: obj.principalSubdivisionCode.split('-')[1],
      };

      let valueMyLocation = ` ${myLocation.postCode}, ${myLocation.city}, ${myLocation.state}`;
      myLocation.myLocation = valueMyLocation
      setLocation(myLocation);
      setValueForInputValue(valueMyLocation);
    }
    var handleError = function (err:any) {
      console.warn(err);
      return new Response(JSON.stringify({
        code: 400,
        message: 'Stupid network Error'
      }));
    };
  }

  /**
   * Get's the Current position of the user
   * 
   * @api navigator.geolocation
   */
  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let latitude = `${position.coords.latitude}`;
      let longitude = `${position.coords.longitude}`;
      getAddressFromLatAndLng(latitude, longitude);
    });
  }

  /**
   * set the location passed from useRoute 
   */
  useEffect(() => {

    if (location !== undefined && location !== '') {
      console.log(location);
      //getLocations({ variables: { value: location }, context: { clientName: 'location' } });


    }

  });

const createLocationWithOutCommas = (value:any) =>{
  if(value === undefined)
     return;
  let s = "";
  let array = value.split(',');
  array.forEach((element:any) => {
         s += element ;
         s += ' '; 
  });
  return s; 
}

  return (
    <div >
      {/**
       * refrencing version of: 1/28/2021
       * source: https://github.com/emilynorton?tab=repositories
       */}
      
      {reset && (location = undefined)}
      {(language === 'english' || language === undefined) && <> <h3><span>Step 2 of 3: </span>Your Location</h3></>}
      {language === 'spanish' && <><h3><span>{'<Spanish>'} Step 2 of 3: </span>Your Prescription</h3></>}
      <form id="location" className="location">
        {(language === 'english' || language === undefined) && <><label htmlFor="find_rx">Enter Your location</label></>}
        {(language === 'spanish') && <>{'<Spanish>'}<label htmlFor="find_rx">Enter Your location</label></>}


        {/* {((Object.keys(getLocation).length !== 0 && valueForInputValue !== undefined) ?
          <div className="results">
            {valueForInputValue} <u className='cursor' onClick={clearInput}>
              {(language === 'english' || language === undefined) && 'Clear'}
              {language === 'spanish' && '<Spanish>Clear'}
            </u>
          </div>
          :
          <>
            <input value={valueForInputValue} autoComplete="off" onFocus={(e) => clearInput(e)} placeholder="Type City or Zip Code" type="text" list="Locations" onChange={searchLocation} id="location" />
            <datalist id="Locations" className='location-datalist'>
              {
                
                locationsFromMutation.map((element:any, index:any) => {
                  
                return <option key={`${Math.random().toString(36).substr(16)}${new Date().toISOString()}${Math.random() * index}`}>{createLocationWithOutCommas(element.description)}</option>}
                )}
            </datalist>
          </>)
        } */}

        {(Object.keys(getLocation).length === 0) && <><div onClick={getCurrentPosition}>
          {(language === 'english' || language === undefined) &&
            <>
              Or...<u className='cursor'>Detect Location</u>
            </>}
          {language === 'spanish' && <>{'<Spanish>'}
              Or...<u className='cursor'>Detect Location</u>
          </>}
        </div></>}

        <button type="submit" form="location">Map My Location</button>

      </form>
      <p className="instructions">Enter a location close to where you'd like to pick up your prescription.</p>

      <div className="clickthrough">
        <Link className="back cursor" to={
          
            {
              pathname: '/src/components/Home',
              query: {
                component: 'prescription',
                prescriptions: prescriptionFromRoute,
                location: JSON.stringify(getLocation).trim(),
                language: language

              }
            }
        }>{'<<'}
          {(language === 'english' || language === 'undefined') && "Step 1"}
          {(language === 'spanish') && "<Spanish>Step 1"}`

        </Link>

       

          <Link className='cursor' to={
            
              {
                pathname: '/dashboard',
                query: {
                  component: 'choose-your-coupon',
                  prescriptions: prescriptionFromRoute,
                  location: JSON.stringify(getLocation).trim(),
                  language: language
                },
              }
          }>

            {(language === 'english' || language === undefined) && 'Next: Step3'}
            {language === 'spanish' && '<Spanish>Next: Step3'}
            {'>>'}
          </Link>
      </div>



      {/*
        used in version 1 with wire frames
        // version 1 from wire frames
        // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=25%3A1&viewport=520%2C440%2C0.5&scaling=min-zoom
        // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=102%3A1390&viewport=212%2C389%2C0.5&scaling=min-zoom
        // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=349%3A797&viewport=317%2C508%2C0.5&scaling=scale-down 

      
      <span className={styles.desktop_main_left_find_prescription_home_title}>
        {console.log('language', language)}
        {(language === 'english' || language === undefined) && 'Step 2: Your Location'}
        {language === 'spanish' && '<Spanish>Step 2: Your Location'}
      </span>
      
      <div className={styles.desktop_main_left_location_caption}>
        {(language === 'english' || language === undefined) && 'Choose a location where you would like to pick up your prescription.'}
        {language === 'spanish' && '<Spanish>Choose a location where you would like to pick up your prescription.'}

      </div>
      
      { (windowWidth <= 520 && valueForInputValue ?
        <div className={styles.desktop_location_clear}>
          {valueForInputValue} <u onClick={clearInput}>
            {(language === 'english' || language === undefined) && 'Clear'}
            {language === 'spanish' && '<Spanish>Clear'}
          </u>
        </div>
        :
         <>
          <input value={valueForInputValue} autoComplete="off" onFocus={(e) => {
              clearInput(e);
              
            }          
          }
            placeholder="Type City or Zip Code" className={styles.desktop_main_left_find_prescription_home_input} type="text" list="Locations" onChange={searchLocation} id="location" />
          <datalist  className="desktop-main-left-find-prescription-home-datalist" id="Locations">
            {console.log('locationsfrommutation', locationsFromMutation)}
            {locationsFromMutation.map((element, index) =>
              <option key={`location${index}`} value={element.description} />
            )}
          </datalist>
        </>)
      }
      {(windowWidth <= 520 && valueForInputValue) ? null :
        <div onClick={getCurrentPosition} className={styles.desktop_main_location_detect_location}>
          {(language === 'english' || language === undefined) &&
            <>
              Or...<u>Detect Location</u>
            </>}
          {language === 'spanish' && <>{'<Spanish>'}
          Or...<u>Detect Location</u>
          </>}
        </div>
      }
      {console.log('getLocation', getLocation)}
      {((Object.keys(getLocation).length !== 0 && getLocation.constructor === Object) || location) && <button className={`next-button ${styles.desktop_button_location}`} onClick={() => router.push
        (
          {
            pathname: '/src/components/Home',
            query: {
              component: 'choose-your-coupon',
              prescriptions: prescriptionFromRoute,
              location: valueForInputValue.trim(),
              language: language
            },
          })
      }>
        {(language === 'english' || language === undefined) && 'Next: Step3'}
        {language === 'spanish' && '<Spanish>Next: Step3'}
        {'>>'}</button>}
      <div className={styles.desktop_location_back_button} onClick={() => router.push
        (
          {
            pathname: '/src/components/Home',
            query: {
              component: 'prescription',
              prescriptions: prescriptionFromRoute,
              location: valueForInputValue.trim(),
              language: language

            }
          })
      }><u>{'<<'}
          {(language === 'english' || language === 'undefined') && ` ${(windowWidth > 520 ? "Step 1: Your Prescription" : "Step 1")}`}
          {(language === 'spanish') && `${(windowWidth > 520 ? "<Spanish>Step 1: Your Prescription" : "<Spanish>Step 1")}`}
        </u>
      </div> */}

    </div>

  );

}

export default Location;