import React, { useState } from 'react';


import Coupon from '../../component/Coupon';

//import styles from './../../../../../styles/CouponDetails.module.scss'; used inversion 1

// import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';

/**
 * @context textMessage
 * 
 * uses 
 * 
 * @serviceApi text_messages
 *  
 * 
 * */

// const SEND_PHONENUMBER_AND_COUPON = gql`
// mutation  SendTextMessageMutation($value:String){
//     SendTextMessageMutation(value:$value)
//       {
//            code
//            message
           
//       }
// }
// `;

/**
 * @Pages
 * 
 * Details of the coupon 
 * 
 * refrencing version of: 1/28/2021
 * source: https://github.com/emilynorton?tab=repositories
 * 
 * @param language the language to display the data 
 * @param prescription the prescription details 
 * @param coupon the data for the Coupon
 * 
 * uses
 * 
 * @component Coupon
 */

const CouponDetails = ({ language, windowWidth, prescription, coupon }:any) => {

   
    /** @gets @sets @type String  //the phone number to be sent to the service */ 
    const [phoneNumber, setPhoneNumber] = useState("");

    
    /**
     * Used on version 
     * print's the coupon
     */    
    // const printCoupon = () => {
    //     window.print();        
    // }

      
    /**
     * gets the phone number from the input box
     * 
     * @param e 
     * @useState setPhoneNumber
     * 
     */   
    const getPhoneNumberEvent = (e:any) => {        
        setPhoneNumber(e.target.value);
    }
    
    /**
     * value check and trigers the mutation to send phone number and coupon details 
     *  to the service
     * 
     * 
     * @param e 
     * 
     * @mutatio sendPhobneNumberAndCoupon 
     *  
     */

    const sendCouponAndPhoneNumber = (e:any) => {
        
        
        if(isNaN(+phoneNumber) || phoneNumber.length !== 10)
        {
            alert(`there is an error is the format ${phoneNumber}`);
            return;
        }

        sendPhobneNumberAndCoupon({ variables: { value: phoneNumber }, context: { clientName: 'textMessage' } });

    }

    // const [sendPhobneNumberAndCoupon] = useMutation(SEND_PHONENUMBER_AND_COUPON, {
    //     onError(err) {
    //         console.log(err);
    //         alert(err);

    //     },
    //     update(proxy, result) {
    //         console.log(result);
    //         if(result.data.SendTextMessageMutation.code !== 200)
    //         {
    //             alert(`there was an error ${result.data.message} ` )
    //             return;
    //         }
    //         alert(`Message succesfully sent` );
    //     }
    // });
    
    /**
     * clears the input box
     * 
     * @useState setPhoneNumber
     */
    const clearInput = ()=>{

        setPhoneNumber("");
    }   

    return (
        <>
           {/**
             * refrencing version of: 1/28/2021
             * source: https://github.com/emilynorton?tab=repositories
             */}
              
              <Link to={
                        {
                            pathname: '/',
                            query: { language: language,component:'prescription' }
                        }
                    }  >
                        <p className="start_over cursor">
                            <u>
                                {(language === 'english' || language === undefined) && 'New Search'}
                                {language === 'spanish' && '<Spanish> New Search'}
                            </u>

                        </p>
                        
                    </Link>
					
					<h3>
                        {(language === 'english' || language === undefined) && 'Your Coupon'}
                        {language === 'spanish' && '<Spanish> Your Coupon'}                        
                    </h3>
					
					<h4 className='coupon'>
                    {(language === 'english' || language === undefined) && 'Show this coupon to the pharmacist at:'}
                    {language === 'spanish' && '<Spanish> Show this coupon to the pharmacist at:'}                        
                        <address><strong>Walgreens</strong> 1201 E. Superior Street, Duluth, MN 55805 </address><a href="https://maps.google.com" target="_blank">Map</a>
                    </h4>
                    <Coupon language={language} windowWidth={windowWidth} prescription={prescription} coupon={coupon} />
					
					
						<form id="text_coupon" className="text_coupon">
							<label htmlFor="text_coupon">Enter Mobile Number</label>
                            <input
                            type="tel"
                            onFocus={clearInput}
                            value={phoneNumber}
                            onChange={getPhoneNumberEvent}                            
                            placeholder='Type your phone number'
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
							<button type="submit" form="text_coupon">Text Me The Coupon</button>
							<div>
                                <div className='cursor' onClick={sendCouponAndPhoneNumber}>
                                    {(language === 'english' || language === undefined) && 'Text Me The Coupon'}
                                    {language === 'spanish' && '<Spanish> Text Me The Coupon'}                                
                                </div>
							</div>
						</form>		
						
								
						<div className="clickthrough_hide">
							<div className="back">{'< Back>'}</div>
							<div>Start Over</div>
						</div>		
            







            {/*            
             
            // version 1 from wire frames
            // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=25%3A1&viewport=520%2C440%2C0.5&scaling=min-zoom
            // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=102%3A1390&viewport=212%2C389%2C0.5&scaling=min-zoom
            // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=349%3A797&viewport=317%2C508%2C0.5&scaling=scale-down 
               
            {windowWidth > 550 ?
                <div className={styles.main_desktop_home_coupon_container}>
                    <Link href={
                        {
                            pathname: '/',
                            query: { language: language }
                        }
                    } as='/'>
                        <a className={styles.main_desktop_home_coupon_new_search}>
                            <u>
                                {(language === 'english' || language === undefined) && 'New Search'}
                                {language === 'spanish' && '<Spanish> New Search'}
                            </u>
                        </a>
                    </Link>
                    <div className={styles.main_desktop_home_coupon_printer_container}>
                        <IconContext.Provider value={{ className: styles.main_desktop_home_coupon_printer_icon }}>
                            <MdPrint />
                        </IconContext.Provider>
                        <map name="print">
                            <area shape="rect" coords="0,0,82,126" />
                        </map>

                        <div onClick={printCoupon} className={styles.main_desktop_home_coupon_printer_text}>
                            <u>

                                {(language === 'english' || language === undefined) && <>Print The <br /> Coupon</>}
                                {language === 'spanish' && <>{'<Spanish>'} Print The<br />Coupon</>}
                            </u>
                        </div>

                    </div>
                    <div className={styles.main_desktop_home_coupon_label} >
                        {(language === 'english' || language === undefined) && 'Your Coupon'}
                        {language === 'spanish' && '<Spanish> Your Coupon'}
                    </div>
                    <Coupon language={language} windowWidth={windowWidth} prescription={prescription} coupon={coupon} />
                    <div className={styles.main_desktop_home_coupon_phone_text_container}>
                        <input
                            type="tel"
                            onFocus={clearInput}
                            value={phoneNumber}
                            onChange={getPhoneNumberEvent}
                            className={styles.main_desktop_home_coupon_phone_input}
                            placeholder='Type your phone number'
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
                        <div onClick={sendCouponAndPhoneNumber} className={styles.main_desktop_home_coupon_text_me}>
                            <u>

                                {(language === 'english' || language === undefined) && 'Text Me The Coupon'}
                                {language === 'spanish' && '<Spanish> Text Me The Coupon'}
                            </u>
                        </div>
                    </div>
                </div>
                :
                <div className={styles.main_desktop_home_coupon_container}>
                    <Link href=
                        {
                            {
                                pathname: '/',
                                query: { language: language }
                            }
                        }
                        as='/'
                    ><a className={styles.main_desktop_home_coupon_new_search}>
                            <u>
                                {(language === 'english' || language === undefined) && 'New Search'}
                                {language === 'spanish' && '<Spanish> New Search'}
                            </u>
                        </a>
                    </Link>

                    <div className={styles.main_desktop_home_coupon_label} >
                        {(language === 'english' || language === undefined) && 'Your Coupon'}
                        {language === 'spanish' && '<Spanish> Your Coupon'}
                    </div>
                    <div className={styles.desktop_coupon_component_store_info}>
                        <b>
                            {(language === 'english' || language === undefined) && 'Show this coupon at'}
                            {language === 'spanish' && '<Spanish> Show this coupon at'}
                        </b> {'Store'}, {'Store Address'}
                    </div>

                    <div className={styles.desktop_coupon_component_phone_number} >
                        {(language === 'english' || language === undefined) && 'Questions? Give us a call at'}
                        {language === 'spanish' && '<Spanish> Questions? Give us a call at'}
                        <b>800.555.1212</b>
                    </div>

                    <Coupon language={language} windowWidth={windowWidth} prescription={prescription} coupon={coupon} />
                    <div className={styles.main_desktop_home_coupon_phone_text_container}>
                        <input
                            type="tel"
                            onFocus={clearInput}
                            value={phoneNumber}
                            onChange={getPhoneNumberEvent}
                            className={styles.main_desktop_home_coupon_phone_input}
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
                        <div onClick={sendCouponAndPhoneNumber} className={styles.main_desktop_home_coupon_text_me}>
                            <u>
                                {(language === 'english' || language === undefined) && 'Text Me The Coupon'}
                                {language === 'spanish' && '<Spanish> Text Me The Coupon'}
                            </u>
                        </div>
                    </div>
                </div>
            } */}
        </>


    );


}

export default CouponDetails;

function sendPhobneNumberAndCoupon(arg0: { variables: { value: string; }; context: { clientName: string; }; }) {
    throw new Error('Function not implemented.');
}
