import React, { useCallback, useEffect, useState } from 'react';
import styles from './css/styles.module.css';
import {
    getData,
    makeHttpCall
    
} from './functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCaretDown, faCaretUp, faPlusCircle, faMinusCircle, faReply } from '@fortawesome/free-solid-svg-icons';
import logo from './../../../src/me.png';


class DisplayDocument extends React.Component {
    
    
    constructor(props) {
        super(props);
        this.state = {
            documentData: [],
            toggle: true,
            zoom: 100,
            rotation: 0,
            index: 0,
            playerId: props.playerId,
            imageType:[],
            documentTypeId:[],
            isData:false,
            
        }
        this.populateFields();
    
    }







    populateFields = () => {


        return new Promise((resolve, reject) => {

              getData(this.state.playerId)
                .then((data) => {
                    this.state.documentData.splice(0, this.state.documentData.length - 1);
                    this.state.imageType.splice(0, this.state.imageType.length - 1);
                    this.state.documentTypeId.splice(0,this.state.documentTypeId.length - 1 )
                   if(data !== undefined && data !== null){  
                       data.forEach((element, i) => {
                        this.state.documentData.push(element);
                        this.state.imageType.push(<option key={`image${i+1}`} value={`Image ${i+1}`}>Image {i+1}</option>)
                    });
                    this.state.documentTypeId.push('Select');
                    
                    this.state.documentTypeId.push('Govt. Issued Id (Front)');
                    this.state.documentTypeId.push('Govt. Issued Id (Back)');
                    this.state.documentTypeId.push('Social Security Card');
                    this.state.documentTypeId.push('Other')
                    this.setState(
                        {
                          imageType:this.state.imageType,  
                          documentData:this.state.documentData,
                          documentTypeId:this.state.documentTypeId,
                          isData:true
                        }
                        );
                        
                    }   
                    resolve(true);

                });

        });

    }    
    getImageType = ( e ) =>{
        console.log(">>>>>>>>>>>>>>> getImageType");
        this.state.index = (e.target.value.split(" ")[1] - 1);
        this.setState({index:this.state.index});
    }
    deleteImage = (uploadId) => {
       
            console.log(">>>>>>>>>>>>>>> deleteImage");
            if(uploadId === "")
            {
                alert('Upload id is empty');
                return;
            }
            const options =
            {
                method: 'delete',
                url: process.env.REACT_APP_BACK_END_GET_DOCUMENT_IMAGE+'/document/'+ uploadId
            }
        
            try
            {
               alert(makeHttpCall(options).message);
               this.state.documentData = this.state.documentData.filter(element =>{ if(element.uploadId !== uploadId) return element; })
               this.setState({documentData:this.state.documentData === undefined ? [] :this.state.documentData,
                              imageType:this.state.documentData === undefined ? [] :this.state.documentData.map((e,i)=>
                              <option key={`image${i+1}`} value={`Image ${i+1}`}>Image {i+1}</option>), 
                             
                index:0});
            }catch(e){
                alert(e);
            }
        
        }
        getDocumentType = async (event, uploadId) => {
            console.log(">>>>>>>>>>>>>>> getDocumentType");            
            const ev = event.target.value;
            const options =
            {
                method: 'put',
                url: process.env.REACT_APP_BACK_END_GET_DOCUMENT_IMAGE+'/document/'+ uploadId,
                data: {
                     type: ev
                  }
            }
        
            try
            {
                const data = await makeHttpCall(options);
                this.setState((state,props) => ({documentData:state.documentData.map(element =>
                    { if(element.uploadId === uploadId)
                         element.documentType = ev; 
                        return element; 
                })}));                     
                             
            } 
            catch(e){
                alert(e);
            }
        
        }
        getMonth(val){
            switch(val){
                case '01': return 'Jan'
                case '02': return 'Feb'
                case '03': return 'Mar'
                case '04': return 'Apr'
                case '05': return 'May'
                case '06': return 'Jun'
                case '07': return 'Jul'
                case '08': return 'Aug'
                case '09': return "Sep"
                case '10': return 'Oct'
                case '11': return 'Nov'
                case '12': return 'Dec'
                default: return "undefined"
            }
        }
        setDateFormat(value){
           let date = value.split('T')[0];
           date = date.split('-');
           let year = date[0]
           return `${this.getMonth(date[1])} ${date[2]}, ${year}`;  

        }
    
    renderMountedPageWithData(){
        
        return(
              <>                
                    <div style={{ height: (this.state.toggle ? '13vh' : '45.523vh') }} className={styles['document-image-outer-container']}>
                        <div className={styles['player-document-info-players-document-label-container']}>
                            <div className={styles['player-document-info-players-document-text']}>Player's Documents</div>
                            <div className={styles['player-document-info-players-document-selection-text']}>Selection</div>
                            <select style={{ fontSize: '1.5em', height: (this.state.toggle ? '82.25%' : '42.25%') }}
                                className={styles['player-document-info-players-document-selection']}
                                defaultValue={this.state.imageType[0]} onChange={(e) => this.getImageType(e)}   >
                                {this.state.imageType}
                            </select>
                        </div>
                        <div className={`${styles['player-document-info-players-document-details-labels-container']}`}>
                            <div className={`${styles['player-document-info-players-document-details-labels-text']} ${styles['player-document-info-players-document-details-labels-text-upload-date']}`} aria-label='Upload Date' tabIndex='0'>Upload Date</div>
                            <div className={styles['player-document-info-players-document-details-labels-text']} aria-label='File Type' tabIndex='0'>File Type</div>
                            <div className={styles['player-document-info-players-document-details-labels-text']} aria-label='Document Type' tabIndex='0'>Document Type</div>
                        </div>
                        <div style={{ width: '91.5%', height: '.7em', marginBottom: '.7em' }}>
                            <hr className={styles['document-image-outer-container-hr']} />
                        </div>
                        <div style={{ height: (this.state.toggle ? '27.124%' : '19.124%') }}
                            className={`${styles['player-document-info-players-document-details-content-container']}`}>
                            <div className={`${styles['player-document-info-players-document-details-content-text']} 
                            ${styles['player-document-info-players-document-details-content-text-upload-date']}`} 
                            tabIndex='0'>
                                { this.setDateFormat(this.state.documentData[this.state.index].createdAt) }
                            </div>
                            <div className={styles['player-document-info-players-document-details-content-text']} tabIndex='0'>{"JPG"}</div>
                            <div onClick={(e) => this.deleteImage( this.state.documentData[this.state.index].uploadId ) }
                                style={{ height: (this.state.toggle ? `100%` : '70%') }}
                                className={styles['player-document-info-players-document-details-content-delete']}>
                                <FontAwesomeIcon icon={faTrash} />
                            </div>
                            
                            <div style={{ height: (this.state.toggle ? '100%' : '70%') }} onClick={(e) => this.setState({toggle:!this.state.toggle})} className={styles['player-document-info-players-document-details-content-button-hide-show']}>
                                <div>{this.state.toggle ? 'Show' : 'Hide'}</div>
                                {this.state.toggle ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
                            </div>
                        </div>
                        {!this.state.toggle && window.scrollTo(100, 100)}  
                        {!this.state.toggle && <><div className={styles['document-image-container']}>
                            <div
                                style={
                                    {
                                        backgroundSize: ` ${this.state.zoom === 100 ? 'cover' : `${this.state.zoom}%`}`,
                                        backgroundImage: `url(${this.state.documentData[this.state.index].url})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                    }
                                }
                                className={`${styles['document-image-src-container']}                         
                        ${this.state.rotation === 90 ? styles['rotateimg90'] :
                                        this.state.rotation === 180 ? styles['rotateimg180'] :
                                            this.state.rotation === 270 ? styles['rotateimg270'] :
                                                styles['rotateimg0']
                                    }`} alt={'image_name'} >
                            </div>
                            <div className={styles['document-image-src-controll-container']}>
                                <FontAwesomeIcon onClick={(e) => this.setState((state, props) => ({ rotations: ((state.rotation + 90) % 360) }))} icon={faReply} />
                                <div>
                                    <FontAwesomeIcon onClick={(e) => this.setState((state, props) => ({ zoom: state.zoom + 10 }))} style={{ marginRight: '.2em' }} icon={faPlusCircle} />
                                    <FontAwesomeIcon onClick={(e) => this.setState((state, props) => ({ zoom: state.zoom - 10 }))} icon={faMinusCircle} />
                                </div>
                            </div>
                        </div></>}
    
                    </div>
                </>
    
        );

    }


    render() { 
        console.log('index ',this.state.index);       
        return (<>{(this.state.isData && this.state.documentData.length > 0) && this.renderMountedPageWithData()}</> );
    }
}

export { DisplayDocument } 

