import React from "react";
//import styles from '../../../../../styles/PrescriptionDetailedForm.module.scss';// for version 1 with wire frames

import { GetLocatedDrugFormInterface, GetLocatedDrugQtyInterface, GetLocatedDrugStrengthInterface, LocatedDrugStrengthInterface } from "../../Home/ChooseYourCoupon";

/**
 * @COMPONENT
 * Displays the details of the prescription selected
 * 
 * refrencing version of: 1/28/2021
 * source: https://github.com/emilynorton?tab=repositories
 * 
 * @param language // the languages selected English|Spanish
 * @param disabled // for making the selects editable
 * @param dataFromServer //Prescription comming from the server
 * @param prescriptionFromRoute // the prescription passed in when using the route function
 * @useState setPrescriptionDetails // sets the prescription chosen 
 */

const PrescriptionDetailedForm = ({ language, disabled = false, coupons, prescriptionName, setValuesForFilterCoupons,filterCoupons }:any) => {
       
    let manufacturer = "";
    let form:GetLocatedDrugFormInterface[] = !Array.isArray(coupons['forms']['locatedDrugForm']) ? [coupons['forms']['locatedDrugForm']] : coupons['forms']['locatedDrugForm'][0];
    let dosage:GetLocatedDrugStrengthInterface[] =  !Array.isArray(coupons['strengths']['locatedDrugStrength']) ? [coupons['strengths']['locatedDrugStrength']] : coupons['strengths']['locatedDrugStrength'].sort((a,b)=> a.strength._text.toUpperCase().localeCompare(b.strength._text.toUpperCase()));
    let quantity:GetLocatedDrugQtyInterface[] = !Array.isArray(coupons['quantities']['locatedDrugQty']) ? [coupons['quantities']['locatedDrugQty']]: coupons['quantities']['locatedDrugQty'].sort((a,b)=> parseFloat(a.quantity._text) - parseFloat(b.quantity._text));
    
    let val={
        form:form[0].form._text,
        dosage:dosage[0].strength._text,
        quantity:quantity[0].quantity._text                 
    }
    setValuesForFilterCoupons(val);
      
    /**
     * Sets the values from the select tag
     * 
     * @useState setPrescriptionsDetails
     * @param e 
     */
    const onChange = (e:any) => {
        let val = {
            [e.target.name]: e.target.value
        }
        setValuesForFilterCoupons(val);
        filterCoupons();
    }
    return (
        <>
            {
                /**
                * refrencing version of: 1/28/2021
                * source: https://github.com/emilynorton?tab=repositories
                */
            }

            {/**@param disabled used when passed by Choose your coupon component*/
            !disabled && <>
                {(language === 'english' || language === undefined) && <><p className="instructions">Adjust the information below so it matches your exact prescription. You can also adjust the details later.</p></>}
                {language === 'spanish' && <><p className="instructions">{'<Spanish>'}Adjust the information below so it matches your exact prescription. You can also adjust the details later.</p></>}
                
                </>
            }
            <div id="rx" className="rx">
                <h4> {prescriptionName.search_name}</h4>

                <p>
                    {(language === 'english' || language === undefined) && <><label htmlFor="mfg">Manufacturer</label></>}
                    {language === 'spanish' && <>{'<Spanish>'}<label htmlFor="mfg">Manufacturer</label></>}

                    <select
                        disabled={disabled}
                        name="mfg"
                        onChange={onChange}
                        defaultValue={manufacturer}
                        id="mfg"
                    >
                       
                    
                    </select>
                </p>

                <p>
                    {(language === 'english' || language === undefined) && <><label htmlFor="form">Form</label></>}
                    {language === 'spanish' && <>{'<Spanish>'}<label htmlFor="form">Form</label></>}

                    <select
                        disabled={disabled}
                        name="form"
                        onChange={onChange}
                        id="form"
                    >
                       {form.map((e:GetLocatedDrugFormInterface,i:number)=> <option key={i} value={e.form._text} >{e.form._text}</option>)}
                    
                    </select>
                </p>

                <p>
                    {(language === 'english' || language === undefined) && <><label htmlFor="dosage">Dosage</label></>}
                    {language === 'spanish' && <>{'<Spanish>'}<label htmlFor="dosage">Dosage</label></>}

                    <select
                        name="dosage"
                        id="dosage"
                        disabled={disabled}
                        onChange={onChange}
                        
                    >                        
                        {
                            dosage.map((e:GetLocatedDrugStrengthInterface,i:number) => <option key={i} value={e.strength._text} >{e.strength._text}</option>)   
                        }
                        
                    
                    </select>
                </p>

                <p>
                    {(language === 'english' || language === undefined) && <><label htmlFor="qty">Quantity</label></>}
                    {language === 'spanish' && <>{'<Spanish>'}<label htmlFor="qty">Quantity</label></>}

                    <select
                        name="quantity"
                        id="qty"
                        disabled={disabled}
                        onChange={onChange}
                        
                    >
                     {  quantity.map((e:GetLocatedDrugQtyInterface,i:number)=> <option key={i} value={e.quantity._text} >{e.quantity._text}</option>)}   
                      
                    </select>
                </p>
            </div>











            {/* 
            
             
             // version 1 from wire frames
            // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=25%3A1&viewport=520%2C440%2C0.5&scaling=min-zoom
            // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=102%3A1390&viewport=212%2C389%2C0.5&scaling=min-zoom
            // https://www.figma.com/proto/f1Af0b6joE7OVyo4R4hb7i/FirstRx-Design?node-id=349%3A797&viewport=317%2C508%2C0.5&scaling=scale-down 


            <div className={styles.prescription_detailed_form_container}>
                <div className={styles.main_desktop_left_prescription_form_description}>

                    {language === 'english' || language === undefined && `Does this match your prescription? Make adjustments below
                so that we can accurately compare prices. Don't worry, you will be
                able to adjust this again.`}
                    {language === 'spanish' && `<Spanish> Does this match your prescription? Make adjustments below
                so that we can accurately compare prices. Don't worry, you will be
                able to adjust this again.`}

                </div>

                <div className={styles.main_desktop_left_prescription_form_title_container}>
                    <div
                        className={styles.main_desktop_left_prescription_form_title}>
                        {(prescriptionFromRoute !== undefined ? prescriptionFromRoute.search_name : (dataFromServer === undefined ? "" : dataFromServer[0].search_name))}

                    </div>
                </div>

                <div className={styles.main_desktop_left_prescription_form_description_container}>
                    <div className={styles.manufactor_container} >
                        <div className={`${styles.main_desktop_left_prescription_form_manufacturer_label} ${styles.main_desktop_left_prescription_form_label}`} >
                            {(language === 'english' || language === undefined) && 'Manufacture'}
                            {language === 'spanish' && '<Spanish>'}
                        </div>
                        
                            <select
                                disabled={disabled}
                                name="manufactor"
                                onChange={onChange}
                                defaultValue={prescriptionFromRoute && manufacturer}
                                className={(disabled ? styles.disabled_fonts_weight : "") + ` ${styles.main_desktop_left_prescription_form_manufacturer_select} ${styles.main_desktop_left_prescription_form_select}`}>
                                {
                                    dataFromServer && dataFromServer.map((element, index) =>
                                        <option key={`manufactor${index}`} value={element.manufacturer}>{element.manufacturer}</option>

                                    )
                                }
                                {dataFromServer === undefined && <option value={manufacturer}>{manufacturer}</option>}
                            </select>
                        
                    </div>
                    <div className={styles.form_container}>
                        <div className={`${styles.main_desktop_left_prescription_form_label} ${styles.main_desktop_left_prescription_form_format_label}`}>
                        {(language === 'english' || language === undefined) && 'Format'}
                            {language === 'spanish' && '<Spanish>'}
                            
                        </div>
                        
                        <select
                            disabled={disabled}
                            name="form"
                            onChange={onChange}
                            defaultValue={prescriptionFromRoute && form}
                            className={(disabled ? styles.disabled_fonts_weight : "") + ` ${styles.main_desktop_left_prescription_form_format_select} ${styles.main_desktop_left_prescription_form_select} `}>
                            {
                                dataFromServer && dataFromServer.map(element =>
                                    element.form.map((e, index) =>
                                        <option key={`form${index}`} value={e}>{e}</option>

                                    )


                                )
                            }
                            {dataFromServer === undefined && <option value={form} >{form} </option>}
                        </select>
                        
                    </div>
                    <div className={styles.dosage_container}>
                        <div className={` ${styles.main_desktop_left_prescription_form_label} ${styles.main_desktop_left_prescription_form_dosage_label}`} >
                        {(language === 'english' || language === undefined) && 'Dosage'}
                            {language === 'spanish' && '<Spanish>'}
                          
                            
                        </div>

                        <select
                            disabled={disabled}
                            name="dosage"
                            onChange={onChange}
                            defaultValue={prescriptionFromRoute && dosage}
                            className={(disabled ? styles.disabled_fonts_weight : "") + ` ${styles.main_desktop_left_prescription_form_select} ${styles.main_desktop_left_prescription_form_dosage_select}`}>
                            {
                                dataFromServer && dataFromServer.map(element =>
                                    element.dosage.map((e, index) =>
                                        <option key={`dosage${index}`} value={e.dosage}>{e.dosage}</option>

                                    )

                                )
                            }
                            {dataFromServer === undefined && <option value={dosage} > {dosage} </option>}
                        </select>
                    </div>
                    <div className={styles.quantity_container}>
                        <div className={`${styles.main_desktop_left_prescription_form_label} ${styles.main_desktop_left_prescription_form_quantity_label}`}>
                        {(language === 'english' || language === undefined) && 'Quantity'}
                            {language === 'spanish' && '<Spanish>'}
                          
                            
                        </div>
                        <select
                            disabled={disabled}
                            name="quantity"
                            onChange={onChange}
                            defaultValue={prescriptionFromRoute && quantity}
                            className={(disabled ? styles.disabled_fonts_weight : "") + ` ${styles.main_desktop_left_prescription_form_select} ${styles.main_desktop_left_prescription_form_quantity_select}`}>
                            {
                                dataFromServer && dataFromServer.map(element =>
                                    element.quantity.map((e, index) =>
                                        <option key={`quantity${index}`} value={e.quantity}>{e.quantity}</option>

                                    )

                                )
                            }
                            {dataFromServer === undefined && <option value={quantity}>{quantity}</option>}
                        </select>
                    </div>
                </div>
            </div> */}
        </>

    );
}
export default PrescriptionDetailedForm;