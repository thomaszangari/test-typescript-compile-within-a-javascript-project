
import React, { useEffect, useState } from 'react';

import FindPrescriptionHome from './FindPrescriptionHome';
import Location from './Location';

import ChooseYourCoupon from './ChooseYourCoupon';
import CouponDetails from './CouponDetails';
import CircularProgress from '@material-ui/core/CircularProgress';
//import styles from './../../../../styles/Home.module.scss'; used for version 1

/**
 * @Pages
 * 
 * Home page
 * 
 * refrencing version of: 1/28/2021
 * source: https://github.com/emilynorton?tab=repositories 
 * 
 * uses
 * 
 * @pages ChooseYourCoupon
 * @pages FindPrescriptionHome
 * @pages Location
 * @pages CouponDetails
 * 
 */

 const r ={
    component:"",
    prescriptions:"",
    location:"",
    coupon:"",
    container:"",
    language:"",
}  ;

const Home = ({router = r }:any) => {
    

    const{
            component,
            prescriptions,
            location,
            coupon,
            container,
            language,
    }  = router;


    /**@gets @sets  sets the has path for reload page in order not to flicker beteween components */
    const [routerHasPath, setRouterHasPath] = useState((router.asPath === '/' ? false : true));

    let data = {
        search_name: "",        
    }

    /**@gets @sets    sthe size of the window used in version 1*/
    const [windowWidth, setWindowWidth] = useState(0);

    /** @gets @sets prescription used when using the back button to pass the pescription*/
    const [getPrescription, setPrescriptionUseState] = useState(data);

    /**
     * Used for responsive design for version 1 of wire frames 
     */
    // const getSizes = () => {
    //     setWindowWidth(window.innerWidth);
    // }

    // useEffect(() => {
    //     setWindowWidth(window.innerWidth);
    //     window.addEventListener(
    //         "resize", getSizes, false);

    // });

    const setPrescription = (value:any) => {

        setPrescriptionUseState(value);

    }



    return (
        <>
            {
                /**
                  * refrencing version of: 1/28/2021
                  * source: https://github.com/emilynorton?tab=repositories
                  */
            }

            <main>
                <h2>Save on Prescriptions!</h2>

                <section className={`stepped_process`}>

                    
                    {(container === undefined || container === '' || container === null) &&
                        <>

                            {/** first component when the page   loads*/}
                            {((component === undefined || component === '' || component === null) && !routerHasPath) && <FindPrescriptionHome  language={language} prescriptionFromRoute={prescriptions} getPrescriptionDetails={getPrescription} setPrescriptionDetails={setPrescription} />}
                            {component === 'choose-your-coupon' && < ChooseYourCoupon language={language} prescriptionFromRoute={prescriptions} location={location} />}
                            {component === 'prescription' &&
                                <FindPrescriptionHome
                                    language={language}
                                    location={location}
                                    prescriptionFromRoute={prescriptions}
                                    getPrescriptionDetails={getPrescription}
                                    setPrescriptionDetails={setPrescription} />}


                            {component === 'location' && <Location  language={language} prescriptionFromRoute={prescriptions} location={location} />}

                        </>}
                    {container === 'coupon' && <CouponDetails language={language} windowWidth={windowWidth} prescription={prescriptions} coupon={coupon} />}

                </section>

            </main>






            {/* 
            
                  // version 1 from wire frames
                  // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=25%3A1&viewport=520%2C440%2C0.5&scaling=min-zoom
                  // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=102%3A1390&viewport=212%2C389%2C0.5&scaling=min-zoom
                  // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=349%3A797&viewport=317%2C508%2C0.5&scaling=scale-down 
   
            
                {(windowWidth <= 550 && container === 'coupon') &&                  
                <CouponDetails language={language} windowWidth={windowWidth} prescription={prescriptions} coupon={coupon} />
            
            }
            { (windowWidth > 1440 || (windowWidth <= 550 && container !== 'coupon' )) &&
                 <>    
                     <div className={styles.main_desktop_container}>
                     {(language === 'english' ||  language === undefined) && <> <div className={styles.main_desktop_title}>Check here <b>First</b> for your <b>Rx</b> savings!</div></>}
                     {language === 'spanish' &&   <><div className={styles.main_desktop_title}> Spanish  <b>Spanish</b> for your <b>Rx</b> Spanish!</div></>}
                      
                        <div className={styles.main_desktop_sides_container}>
                            {(container === undefined || container === '' || container === null) &&
                                <div className={styles.main_desktop_sides_inner_container}>
                                    <span className={styles.main_desktop_side_left}>
                                        {component === 'choose-your-coupon' && < ChooseYourCoupon language={language} prescriptionFromRoute={prescriptions} location={location} />}
                                        {component === 'prescription' &&
                                            <FindPrescriptionHome
                                                language={language}
                                                location={location}
                                                prescriptionFromRoute={prescriptions}
                                                getPrescriptionDetails={getPrescription}
                                                setPrescriptionDetails={setPrescription} />}
                                         
                                         
                                        {component === 'location' && <Location language={language} prescriptionFromRoute={prescriptions} location={location} />}
                                        {(component === undefined || component === '' || component === null) && <FindPrescriptionHome language={language} prescriptionFromRoute={prescriptions} getPrescriptionDetails={getPrescription} setPrescriptionDetails={setPrescription} />}


                                    </span>

                                    {windowWidth > 550 && <span className={styles.main_desktop_side_right}></span>}
                                </div>
                            }
                            {container === 'coupon' && <CouponDetails language={language} windowWidth={windowWidth} prescription={prescriptions} coupon={coupon} />}
                        </div>
                    </div>
                    <div className={styles.main_desktop_bottom_container}>
                    { (language === 'english' ||  language === undefined) &&    <span className={styles.main_desktop_bottom_text}>This is an easy and simple process to get big savings. Find the lowest price at a
                    pharmacy near you. Get texted a coupon. Bring to your pharmacist. Save $.</span>}
                    {language === 'spanish' &&    <span className={styles.main_desktop_bottom_text}>{'<<Spanish>>'} This is an easy and simple process to get big savings. Find the lowest price at a
                    pharmacy near you. Get texted a coupon. Bring to your pharmacist. Save $.</span>}
                    
                    </div>
                </>}
            { (windowWidth > 550 && windowWidth <= 1440 ) &&
                 <>    
                     
                     {(language === 'english' ||  language === undefined) &&   <><div className={styles.main_desktop_title}>Check here <b>First</b> for your <b>Rx</b> savings!</div></>}
                     {language === 'spanish' &&   <><div className={styles.main_desktop_title}> Spanish  <b>Spanish</b> for your <b>Rx</b> Spanish!</div></> }
                     
                        <div className={styles.main_desktop_sides_container}>
                        {(container === undefined || container === '' || container === null) &&
                                <div className={styles.main_desktop_sides_inner_container}>
                                    <span className={styles.main_desktop_side_left}>
                                        {component === 'choose-your-coupon' && < ChooseYourCoupon language={language} prescriptionFromRoute={prescriptions} location={location} />}
                                        {component === 'prescription' &&
                                            <FindPrescriptionHome
                                                language={language}
                                                location={location}
                                                prescriptionFromRoute={prescriptions}
                                                getPrescriptionDetails={getPrescription}
                                                setPrescriptionDetails={setPrescription} />}

                                        {component === 'location' && <Location language={language} prescriptionFromRoute={prescriptions} location={location} />}
                                        {(component === undefined || component === '' || component === null) && <FindPrescriptionHome  language={language} prescriptionFromRoute={prescriptions} getPrescriptionDetails={getPrescription} setPrescriptionDetails={setPrescription} />}


                                    </span>

                                    {windowWidth > 550 && <span className={styles.main_desktop_side_right}></span>}
                                </div>
                            }
                            {container === 'coupon' && <CouponDetails language={language} windowWidth={windowWidth} prescription={prescriptions} coupon={coupon} />}
                        </div>
                    
                    <div className={styles.main_desktop_bottom_container}>
                    {(language === 'english' ||  language === undefined) &&    <span className={styles.main_desktop_bottom_text}>This is an easy and simple process to get big savings. Find the lowest price at a
                    pharmacy near you. Get texted a coupon. Bring to your pharmacist. Save $.</span>}
                    {language === 'spanish' &&    <span className={styles.main_desktop_bottom_text}>{'<<Spanish>>'} This is an easy and simple process to get big savings. Find the lowest price at a
                    pharmacy near you. Get texted a coupon. Bring to your pharmacist. Save $.</span>}
                    </div>
                </>} 
                </main> */}





        </>

    );
}

export async function getStaticProps() {

    // By returning { props: posts }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            render: {},
        },
    }
}


export default Home;