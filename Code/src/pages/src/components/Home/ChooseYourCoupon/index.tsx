import React, { useState } from 'react';

import PrescriptionDetailedForm from '../../component/PrescriptionDetailedForm';
import CouponsTiles from '../../component/CouponsTiles';
import { Link } from 'react-router-dom';

//import styles from '../../../../../styles/ChooseYourCoupon.module.scss'; used in version 1



export interface CouponStructureInterface {
  drugs: DrugsInterface;
  forms: LocatedDrugFormInterface;
  names: LocatedDrugNameInterface;
  quantities: LocatedDrugQtyInterface;
  strengths: LocatedDrugStrengthInterface;
}
export interface LocatedDrugFormInterface {
  locatedDrugForm: GetLocatedDrugFormInterface[];
}
export interface LocatedDrugNameInterface {
  locatedDrugName: GetLocatedDrugNameInterface;
}
export interface DrugsInterface {
  locatedDrug:LocatedDrugInterface[];
}
export interface LocatedDrugQtyInterface {
  locatedDrugQty: GetLocatedDrugQtyInterface[]

}
export interface LocatedDrugStrengthInterface {
  locatedDrugStrength: GetLocatedDrugStrengthInterface[];
}
export interface GetLocatedDrugStrengthInterface {
  strength: PharmacyTextInterface;
  gsn: PharmacyTextInterface;
  isSelected: PharmacyTextInterface;
  ranking: PharmacyTextInterface;
}


export interface GetLocatedDrugQtyInterface {
  quantity: PharmacyTextInterface
  quantityUomr: PharmacyTextInterface
  gsn: PharmacyTextInterface
  isSelected: PharmacyTextInterface
  ranking: PharmacyTextInterface
}

export interface GetLocatedDrugFormInterface {
  form: PharmacyTextInterface;
  gsn: PharmacyTextInterface;
  isSelected: PharmacyTextInterface;
  ranking: PharmacyTextInterface;
  awpPrice: PharmacyTextInterface;
}

export interface GetLocatedDrugNameInterface {
  drugName: PharmacyTextInterface
  brandGenericIndicator: PharmacyTextInterface
  isSelected: PharmacyTextInterface
}



export interface LocatedDrugInterface {
  pharmacy: PharmacyInterface
  drug: DrugInterface
  pricing: PricingInterface
}

export interface PharmacyInterface {
  name: PharmacyTextInterface;
  streetAddress: PharmacyTextInterface;
  city: PharmacyTextInterface;
  state: PharmacyTextInterface;
  zipCode: PharmacyTextInterface;
  latitude: PharmacyTextInterface;
  longitude: PharmacyTextInterface;
  hoursOfOperatio: PharmacyTextInterface;
  phone: PharmacyTextInterface;
  npi: PharmacyTextInterface;
  chainCode: PharmacyTextInterface;
  distance: PharmacyTextInterface;
}

export interface DrugInterface {
  ndcCode: PharmacyTextInterface;
  brandGenericIndicator: PharmacyTextInterface;
  gsn: PharmacyTextInterface;
  drugRanking: PharmacyTextInterface;
  quantity: PharmacyTextInterface;
  quantityRacking: PharmacyTextInterface;
}

export interface PricingInterface {
  price: PharmacyTextInterface;
  priceBasis: PharmacyTextInterface;
  usualAndCustomaryPrice: PharmacyTextInterface;
  macPrice: PharmacyTextInterface;
  awpPrice: PharmacyTextInterface;
}
export interface PharmacyTextInterface {
  _text: string;
}




/**
 * @Pages
 * 
 * List of coupons based on prescriptin details
 * uses coupon service
 * 
 * refrencing version of: 1/28/2021
 * source: https://github.com/emilynorton?tab=repositories
 * 
 * @param language the language to display the data 
 * @param prescriptionFromRoute the prescription passed by the Route 
 * @param location the location where to search
 * 
 * uses
 * 
 * @component CouponTiles
 * @component PrescriptionDetailedForm
 */

 let allTheData:CouponStructureInterface;
const ChooseYourCoupon = ({ language, prescriptionFromRoute, location }:any) => {

      location = JSON.parse(location);  
      prescriptionFromRoute = JSON.parse(prescriptionFromRoute);
      console.log('location',location,prescriptionFromRoute);
  

  let pharmacyText: PharmacyTextInterface = {
    _text: ""
  }

  let locatedDrugStrength: GetLocatedDrugStrengthInterface[];

  let locatedDrugQty: GetLocatedDrugQtyInterface[];

  let locatedDrugForm: GetLocatedDrugFormInterface[];

  let drug: DrugInterface = {
    ndcCode: pharmacyText,
    brandGenericIndicator: pharmacyText,
    gsn: pharmacyText,
    drugRanking: pharmacyText,
    quantity: pharmacyText,
    quantityRacking: pharmacyText
  }

  let pharmacy: PharmacyInterface = {
    name: pharmacyText,
    streetAddress: pharmacyText,
    city: pharmacyText,
    state: pharmacyText,
    zipCode: pharmacyText,
    latitude: pharmacyText,
    longitude: pharmacyText,
    hoursOfOperatio: pharmacyText,
    phone: pharmacyText,
    npi: pharmacyText,
    chainCode: pharmacyText,
    distance: pharmacyText,
  }

  let pricing = {
    price: pharmacyText,
    priceBasis: pharmacyText,
    usualAndCustomaryPrice: pharmacyText,
    macPrice: pharmacyText,
    awpPrice: pharmacyText,
  }


  let locatedDrug: LocatedDrugInterface[] = []; 

  let locatedDrugName: GetLocatedDrugNameInterface = {
    drugName: pharmacyText,
    brandGenericIndicator: pharmacyText,
    isSelected: pharmacyText
  }

  let drugs: DrugsInterface = {
    locatedDrug
  };
  let forms: LocatedDrugFormInterface = {
    locatedDrugForm:[]
  };
  let names: LocatedDrugNameInterface = {
    locatedDrugName

  };
  let quantities: LocatedDrugQtyInterface = {
    locatedDrugQty:[]
  };

  let strengths: LocatedDrugStrengthInterface = {
    locatedDrugStrength:[]
  };
  let couponData: CouponStructureInterface = {
    drugs,
    forms,
    names,
    quantities,
    strengths

  }
  const [coupons, setCoupons] = useState<CouponStructureInterface>(couponData);
 
  const [ valuesForFilter,setValuesForFilter ] = useState({
    form:"",
    dosage:"",
    quantity:""                 
});
  
 let  filterValues = {form:"",
 dosage:"",
 quantity:""  }
  const setValuesForFilterCoupons = (value:any) =>{
         
    setValuesForFilter(Object.assign(valuesForFilter ,value));
        //setValuesForFilter(Object.assign(valuesForFilter,value));
      
        //fileterCoupons();
                
  }
  const fileterCoupons =()=>{

    //coupons.drugs.locatedDrug = allTheData.drugs.locatedDrug.filter((e:LocatedDrugInterface) => e.drug.quantity._text === valuesForFilter.quantity);
    setCoupons(JSON.parse(JSON.stringify(coupons)));
            
  }


  /**
   * returns to the location pages 
   * 
   */
  const returnToLocation = () => {
    // router.push
    //   (
    //     {
    //       pathname: '/src/components/Home',
    //       query: {
    //         component: 'location',
    //         prescriptions: prescriptionFromRoute,
    //         location: location,
    //         language: language
    //       },
    //     })

  }
  let arr = [];

  /**
   * helper function for development 
   * filles the coupons
   * 
   * @component CouponTiles 
   */
  const fillCoupon = () => {

    for (let i = 0; i < 7; i++) {
      arr.push(
        <CouponsTiles language={language} prescription={prescriptionFromRoute} couponsData={prescriptionFromRoute} />);

    }


  }

  /**
   * Call to the service Prescription to retreve the prescriptionsfordatalist available
   * @useState  setPrescriptionDetailsForPrescriptionDetailComponent
   * @param setPrescriptionDetails // passed in from the function
   * @useState
   *  
   */
  // 
  
  fillCoupon();
  // Object.keys(coupons).length <= 0 && getCoupons({ variables: { prescription: prescriptionFromRoute.search_name, latitude: location.latitude, longitude: location.longitude }, context: { clientName: 'coupon' } })
  //allTheData === undefined && getCoupons({ variables: { prescription: prescriptionFromRoute.search_name, latitude: location.latitude, longitude: location.longitude }, context: { clientName: 'coupon' } })


  return (
    <div>

      {/**
         * refrencing version of: 1/28/2021
         * source: https://github.com/emilynorton?tab=repositories
         */}

      {(language === 'english' || language === undefined) && <> <h3><span>Step 3 of 3: </span>Choose Your Coupon</h3></>}
      {language === 'spanish' && <><h3><span>{'<Spanish>'} Step 3 of 3: </span>Choose Your Coupon</h3></>}
      <div className='location cursor'>
        {(language === 'english' || language === undefined) &&
          <>
            Location: {location.myLocation} <Link to={{
                      pathname: '/src/components/Home',
            query:{
            component: 'location',
            prescriptions: prescriptionFromRoute,
            location: location,
            language: language}
          }}>Clear</Link>
          </>

        }
        {language === 'spanish' &&
          <>
            {'<Spanish>'}Location: {location} <u onClick={returnToLocation}>Clear</u>
          </>
        }
      </div>
       {coupons['drugs'].locatedDrug.length > 0 && <PrescriptionDetailedForm language={language} 
                                disabled={false}
                                coupons={coupons}                               
                                prescriptionName={prescriptionFromRoute}
                                filterCoupons={fileterCoupons}
                                setValuesForFilterCoupons={setValuesForFilterCoupons} /> }
      <div className="list_info">
        <p><span>Sorted by: </span>Price</p>
        <p><span>Number of Results: </span>3</p>
        <p className="radius"><span>Radius: </span>15 miles</p>
      </div>
      <div>        
        {coupons['drugs'].locatedDrug.map(element =>{  
            if(element.drug.quantity._text === valuesForFilter.quantity)              
                return <CouponsTiles language={language} prescription={prescriptionFromRoute} couponsData={element} />})}
      </div>


      
        
        {/* used in version 1 with wire frames
        // version 1 from wire frames
        // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=25%3A1&viewport=520%2C440%2C0.5&scaling=min-zoom
        // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=102%3A1390&viewport=212%2C389%2C0.5&scaling=min-zoom
        // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=349%3A797&viewport=317%2C508%2C0.5&scaling=scale-down 

        
        <span className={styles.desktop_main_left_find_prescription_home_title} >
        {(language === 'english' ||  language === undefined) && 'Step 3: Choose Your Coupon'}
        {language === 'spanish' &&  '<Spanish>Step 3: Choose Your Coupon'} 
          
          
          
        </span>
        <div className={styles.desktop_main_left_location_caption}>
        {(language === 'english' ||  language === undefined) && 
        <>
          In { location } <u onClick={returnToLocation}>Change Location</u> 
        </>
        
        }
        {language === 'spanish' &&  
        <>
         {'<Spanish>'}  In { location } <u onClick={returnToLocation}>Change Location</u> 
        </>        
        }
        </div>
        <PrescriptionDetailedForm language={language} disabled={true}  prescriptionFromRoute={prescriptionFromRoute}   />
        <br />
        <div className={styles.desktop_choose_your_coupon_sort}>
        {(language === 'english' ||  language === undefined) && 'Sorted by: Price'}
        {language === 'spanish' &&  'Sorted by: Price'}          
        </div>
        <div className={styles.desktop_choose_your_coupon_list_container}>
            {arr}
                
        </div>

    </div> */}
    </div>

  );

}

export default ChooseYourCoupon;