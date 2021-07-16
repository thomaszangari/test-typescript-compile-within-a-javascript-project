import React from "react";
// import { useRouter } from "next/router";
//import styles from '../../../../../styles/Coupon.module.scss'; used in version 1


/**
 * @Component
 * 
 * Specifics of the Coupon 
 * 
 * refrencing version of: 1/28/2021
 * source: https://github.com/emilynorton?tab=repositories
 * 
 * @param language the language to display the data 
 * @param prescription the prescription details 
 * @param coupon the data for the Coupon
 */

const Coupon = ({ language, windowWidth, prescription, coupon = undefined }:any) => {
    let search_name = "";
    let dosage = "";
    let form = "";

    if (prescription !== undefined) {
        prescription = JSON.parse(prescription);
        search_name = prescription.search_name;
        dosage = prescription.dosage;
        form = prescription.form;

    }

    return (
        <>
            {/**
             * refrencing version of: 1/28/2021
             * source: https://github.com/emilynorton?tab=repositories
          */}
            <article className="single_coupon">
                <p className="drugcode"><span>{ search_name }</span>{`${form} ${dosage}`}</p>

                <p className="price">$8.09</p>

                <p className="address">
                   
                   {(language === 'english' || language === undefined) && 'Pick up at:'}
                   {language === 'spanish' && '<Spanish> Pick up at:'}
                     
                    
                    <address><strong>Walgreens</strong> 1201 E. Superior Street, Duluth, MN 55805 </address>
                </p>
                <dl>
                    <dt>ID:</dt>
                    <dd>######</dd>
                    <dt>BIN: </dt>
                    <dd>######</dd>
                    <dt>PCN:</dt>
                    <dd>######</dd>
                    <dt>GRP:</dt>
                    <dd>######</dd>
                </dl>

                <p className="disclaimer">
                   {(language === 'english' || language === undefined) && 'This is not insurance'}
                   {language === 'spanish' && '<Spanish> This is not insurance'}                   
                </p>

                <p className="fineprint">
                   {(language === 'english' || language === undefined) && ' All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here.'}
                   {language === 'spanish' && '<Spanish>  All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here. All of the fine print text goes here. '}
                </p>

            </article>

            {/* {

            // version 1 from wire frames
            // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=25%3A1&viewport=520%2C440%2C0.5&scaling=min-zoom
            // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=102%3A1390&viewport=212%2C389%2C0.5&scaling=min-zoom
            // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=349%3A797&viewport=317%2C508%2C0.5&scaling=scale-down 
            windowWidth > 550 ?
                <div className={styles.desktop_coupon_component_container}>

                    <div className={styles.desktop_coupon_component_store_info}>
                        {(language === 'english' || language === undefined) &&
                            <>
                                <b>Show this coupon at</b>
                            </>
                        }
                        {language === 'spanish' &&
                            <>
                                {'<Spanish>'}<b> Show this coupon at </b>
                            </>
                        }


                        {'Store'}, {'Store Address'}</div>

                    <div className={styles.desktop_coupon_component_phone_number} >
                    {(language === 'english' || language === undefined) &&
                            <>
                                Questions? Give us a call at <b>800.555.1212</b>
                            </>
                        }
                        {language === 'spanish' &&
                            <>
                                {'<Spanish>'}Questions? Give us a call at <b>800.555.1212</b>
                            </>
                        }                      
                        </div>

                    <div className={styles.desktop_coupon_component_prescription}> {search_name} {dosage} , {form} </div>
                    <div className={styles.desktop_coupon_component_details_container}>
                        <ul className={styles.desktop_coupon_component_deatils_identification}>
                            <li>ID: {'XXXXXXXXXX'}</li>
                            <li>BIN: {'XXXXXXXXXXX'}</li>
                            <li>PCN: {'XXXXXXXXXXX'}</li>
                            <li>GRP: {'XXXXXXXXXXX'}</li>
                        </ul>
                        <div className={styles.desktop_coupon_component_deatils_price}>${'0.00'}</div>
                    </div>
                    <div className={styles.desktop_coupon_component_fine_print} >
                    {(language === 'english' ||  language === undefined) && 'All the fine print goes here'}
                    {language === 'spanish' &&  '<Spanish>All the fine print goes here'}  
                         
                    </div>
                    <div className={styles.desktop_coupon_component_fine_declairment}>
                    {(language === 'english' || language === undefined) &&
                            <>
                                DISCOUNT ONLY - <br />NOT INSURANCE
                            </>
                        }
                        {language === 'spanish' &&
                            <>
                                {'<Spanish>'}DISCOUNT ONLY - <br />NOT INSURANCE
                            </>
                        }                    
                    </div>
                </div>
                :
                <div className={styles.desktop_coupon_component_container}>
                    <div className={styles.desktop_coupon_prescrition_detailes_container}>
                        <div className={styles.desktop_coupon_component_prescription}> {search_name} {dosage} , {form} </div>
                        <div className={styles.desktop_coupon_component_deatils_price}>${'0.00'}</div>
                    </div>
                    <div className={styles.desktop_coupon_component_store_info_component}>{'Store'}, {'Store Address'}</div>

                    <div className={styles.desktop_coupon_component_details_container}>
                        <ul className={styles.desktop_coupon_component_deatils_identification}>
                            <li>ID: {'XXXXXXXXXX'}</li>
                            <li>BIN: {'XXXXXXXXXXX'}</li>
                            <li>PCN: {'XXXXXXXXXXX'}</li>
                            <li>GRP: {'XXXXXXXXXXX'}</li>
                        </ul>
                    </div>
                    <div className={styles.desktop_coupon_component_fine_declairment}>
                    {(language === 'english' || language === undefined) &&
                            <>
                                DISCOUNT ONLY - NOT INSURANCE
                            </>
                        }
                        {language === 'spanish' &&
                            <>
                                {'<Spanish>'}DISCOUNT ONLY - NOT INSURANCE
                            </>
                        }                    
                        
                    </div>
                    <div className={styles.desktop_coupon_component_fine_print} >
                    {(language === 'english' ||  language === undefined) && 'All the fine print goes here'}
                    {language === 'spanish' &&  '<Spanish>All the fine print goes here'}  
                     
                         </div>

                </div>
        } */}
        </>
    );
}

export default Coupon