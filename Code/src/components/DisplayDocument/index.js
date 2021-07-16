import React, { useCallback, useEffect, useState } from 'react';
import styles from './css/styles.module.css';
import stylesPopUp from './css/styles_popup_box.module.css';
import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    makeHttpCall,
    getData
} from './functions'
import { faTrash, faCaretDown, faCaretUp, faPlusCircle, faMinusCircle, faReply } from '@fortawesome/free-solid-svg-icons';
import logo from './../../../src/me.png';
import eventEmitter from './../../service/EventEmiiter';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppToast from "../../toast";
import config from  './../../config';

const axios = require('axios');

const valuesOfDocumentType = [];
@inject('playerStore', 'claimStore')
@observer
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
            imageType: [],
            documentTypeId: [],
            isData: false,
            setDocumentType: undefined,
            popupRadioButtonResult: undefined,
            count: 0,
            eventListenerAdded: undefined,
            componentName: props.name,
            playersCurrentImage: undefined,
            refreshDataForImages: 0,
            showToast: false,
            showToastResponse: "",
        }



    }


    componentDidMount() {

        this.populateFields();
        if (this.state.eventListenerAdded === undefined)
            this.state.eventListenerAdded = eventEmitter.addListener('DisplayDiscount', this.triggerSetState);

    }
    componentDidUpdate() {
        //console.log("component did update");
        if (!this.state.toggle && valuesOfDocumentType.find(e => e === this.state.documentData[this.state.index].documentType) !== undefined)
            this.ScrollElement();
    }

    triggerSetState = (data) => {

        this.setState(data);
        console.log(">>>>>>> triggerSetState", this.state);
    }

    testIfImageIsAvailable = async () => {

        const options =
        {
            method: 'put',
            url: config.SERVER_BASE_URL + '/v1/player/testplayerimageavailable',
            data: {
                imageUrl: this.state.documentData[this.state.index].url
            }
        }

        try {
            console.log(' >>>>>>>>>>>>>> testing image');
            const response = await makeHttpCall(options);
            this.state.playersCurrentImage = "";
           
            if (response.statusCode === 200) {
                this.state.playersCurrentImage = options.data.imageUrl;
                this.setState({ playersCurrentImage: options.data.imageUrl, refreshDataForImages: 0 });
                return;
            }
            else if (response.statusCode === 403) {

                
                if (this.state.refreshDataForImages++ < 2 && response.refreshStatus === true) {
                    this.populateFields();
                    return;
                }
            }

            this.state.showToastResponse = `${response.statusCode} ${response.statusMessage}`;
            this.setState({ playersCurrentImage: this.state.playersCurrentImage, showToast: true, showToastResponse: this.state.showToastResponse });

        } catch (e) {
            console.log(e.message);
            this.setState({playersCurrentImage:""});
            alert(`${options.url} ${e.message}`);
           
        }

    }


    populateFields = () => {


        return new Promise((resolve, reject) => {
            if (this.state.count === 0) {
                this.state.count++;

                getData(this.state.playerId)
                    .then((data) => {
                        this.state.documentData = [];
                        this.state.imageType = [];
                        this.state.documentTypeId = [];
                        if (data !== undefined && data !== null) {
                            data.forEach((element, i) => {
                                this.state.documentData.push(element);
                                this.state.imageType.push(<option key={`image${i + 1}`} value={`Image ${i + 1}`}>Image {i + 1}</option>)
                            });

                            this.state.documentTypeId.push('Select');
                            this.state.documentTypeId.push('Govt. Issued Id (Front)');
                            valuesOfDocumentType.push('GOV_ID_FRONT');
                            this.state.documentTypeId.push('Govt. Issued Id (Back)');
                            valuesOfDocumentType.push('GOV_ID_BACK');
                            this.state.documentTypeId.push('Social Security Card');
                            valuesOfDocumentType.push('SSN_CARD');
                            this.state.documentTypeId.push('Other');
                            valuesOfDocumentType.push('OTHER');
                            this.setState(
                                {
                                    imageType: this.state.imageType,
                                    documentData: this.state.documentData,
                                    documentTypeId: this.state.documentTypeId,
                                    isData: true,
                                    playersCurrentImage: this.state.playersCurrentImage,
                                    count: 0
                                }
                            );

                        }

                        resolve(true);

                    });
            }

        });

    }
    getImageType = (e) => {
        console.log(">>>>>>>>>>>>>>> getImageType");
        this.state.index = (e.target.value.split(" ")[1] - 1);
        this.setState({ index: this.state.index, toggle: true, playersCurrentImage: undefined });
    }
    deleteImage = async (uploadId) => {

        console.log(">>>>>>>>>>>>>>> deleteImage");
        if (uploadId === "") {
            this.state.showToastResponse = `Upload id is empty`;
            this.setState({ showToast: true, showToastResponse: this.state.showToastResponse });
            return;
        }
        const options =
        {
            method: 'delete',
            url: config.SERVER_BASE_URL + '/v1/player/deletedocument/' + uploadId
        }

        try {
            const response = await makeHttpCall(options);
            if (response.statusCode === 200) {

                this.state.documentData = this.state.documentData.filter(element => element.uploadId !== uploadId)
                const data = {
                    documentData: this.state.documentData === undefined ? [] : this.state.documentData,
                    index: --this.state.index <= 0 ? 0 : this.state.index,
                    imageType: [],
                    playersCurrentImage: undefined
                }
                data.imageType = this.state.documentData === undefined ? [] : this.state.documentData.map((e, i) =>
                    <option key={`image${i + 1}`} selected={data.index === i ? true : false} value={`Image ${i + 1}`}>Image {i + 1}</option>);
                eventEmitter.emit('DisplayDiscount', data);
            }

            alert(`${options.url}\n ${response.statusCode}: ${response.message} `);

        } catch (e) {
            this.setState({playersCurrentImage:""});
            alert(e);
        }

    }
    getDocumentType = async (documentType, uploadId) => {
        console.log(">>>>>>>>>>>>>>> getDocumentType");
        const ev = documentType;
        const options =
        {
            method: 'put',
            url: config.SERVER_BASE_URL + '/v1/player/putdocument/' + uploadId,
            data: {
                type: ev
            }
        }

        try {
            const response = await makeHttpCall(options);
            console.log('response', response);
            if (response.statusCode === 200) {
                const data = {
                    documentData: this.state.documentData.map(element => {
                        if (element.uploadId === uploadId)
                            element.documentType = ev;
                        return element;
                    })
                }
                eventEmitter.emit('DisplayDiscount', data);
            }
            alert(`${options.url}\n ${response.statusCode}: ${response.message} `);

        }
        catch (e) {
            console.log('exception', e.message);
            this.setState({playersCurrentImage:""});
            alert(e);
        }

    }

    getpopUpCheckButton(event) {
        let value = false;

        if (event.target.value === 'document_type_approved')
            value = true;

        this.setState({ popupRadioButtonResult: value });

    }

    setDocumentTypeFromPopUp(event) {
        this.setState({ setDocumentType: event.target.value });
    }

    getMonth(val) {
        switch (val) {
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

    setDateFormat(value) {
        let date = value.split('T')[0];
        date = date.split('-');
        let year = date[0]
        return `${this.getMonth(date[1])} ${date[2]}, ${year}`;

    }
    popupActionCancel() {
        this.setState({
            setDocumentType: undefined,
            popupRadioButtonResult: undefined,
            toggle: !this.state.toggle
        });
    }
    popupActionSave() {
        if (this.state.popupRadioButtonResult === undefined) {
            this.state.showToastResponse = `Please Select a option`;
            this.setState({ showToast: true, showToastResponse: this.state.showToastResponse });

            return;
        }
        if (valuesOfDocumentType.find(e => e === this.state.setDocumentType) === undefined && this.state.popupRadioButtonResult === true) {
            this.state.showToastResponse = `Please Select a Document Type`;
            this.setState({ showToast: true, showToastResponse: this.state.showToastResponse });
            return;

        }

        if (this.state.popupRadioButtonResult === true)
            this.getDocumentType(this.state.setDocumentType, this.state.documentData[this.state.index].uploadId);
        else
            this.deleteImage(this.state.documentData[this.state.index].uploadId);

        this.setState({ toggle: !this.state.toggle })
    }
    getDocumentTypeId() {
        try {
            console.log('>>>>>>>>>>>>>>>>>>>>> getDocumentTypeId');
            let index = valuesOfDocumentType.indexOf(this.state.documentData[this.state.index].documentType);
            console.log(this.state.documentData);
            console.log(index, this.state.index, this.state.documentData[this.state.index].documentType, this.state.documentTypeId[index + 1],)
            return index === -1 ? "" : this.state.documentTypeId[index + 1];
        } catch (e) {
            alert(e.message);
            return "";
        }
    }
    ScrollElement() {
        document.getElementById('container').scrollIntoView(false);
    }
    renderMountedPageWithData() {

        return (
            <>
                {
                    this.state.showToast &&
                    <div style={{ zIndex: 1000, position: 'fixed', width: '41vmax', height: '6vmax', top: '5vmax', left: '41vmax' }}>

                        {/* {this.props.playerStore.setToastErrorSuccessMessage(this.state.showToast, this.state.showToastResponse,this.state.showToastResponse)} */}
                        {this.props.playerStore.setToastErrorSuccessMessage(true, this.state.showToastResponse, null)}
                        {this.setState({ showToast: false })}
                    </div>
                }
                <div id='container' ref='container' style={{ minHeight: (this.state.toggle ? '5.52vmax' : '54.523vh') }}
                    className={styles['document-image-outer-container']}>
                    <div className={styles['player-document-info-players-document-label-container']}>
                        <div className={styles['player-document-info-players-document-text']}
                            aria-label="Player's Documents"
                            tabIndex='0'
                        >Player's Documents</div>
                        <div className={styles['player-document-info-players-document-selection-text']}
                            aria-label="Selection"
                            tabIndex='0'
                        >Selection</div>
                        <select style={{ fontSize: '1.5em', minHeight: '1.52vmax' }}
                            className={styles['player-document-info-players-document-selection']}
                            defaultValue={this.state.imageType[0]} onChange={(e) => this.getImageType(e)} tabIndex='0'  >

                            {this.state.imageType}
                        </select>
                    </div>
                    <div className={`${styles['player-document-info-players-document-details-labels-container']}`}>
                        <div className={`${styles['player-document-info-players-document-details-labels-text']} ${styles['player-document-info-players-document-details-labels-text-upload-date']}`} aria-label='Upload Date' tabIndex='0'>Upload Date</div>
                        <div className={styles['player-document-info-players-document-details-labels-text']} aria-label='File Type' tabIndex='0'>File Type</div>
                        <div className={styles['player-document-info-players-document-details-labels-text']} aria-label='Document Type' tabIndex='0'>Document Type</div>
                    </div>
                    <div style={{ width: '98.5%', height: '.7em', marginBottom: '.7em' }}>
                        <hr className={styles['document-image-outer-container-hr']} />
                    </div>


                    <div style={{ height: '3.437vmax' }}
                        className={`${styles['player-document-info-players-document-details-content-container']}`}>
                        <div className={`${styles['player-document-info-players-document-details-content-text']} 
                            ${styles['player-document-info-players-document-details-content-text-upload-date']}`}
                            tabIndex='0'
                            aria-label={this.setDateFormat(this.state.documentData[this.state.index].createdAt)}>
                            {this.setDateFormat(this.state.documentData[this.state.index].createdAt)}
                        </div>
                        <div className={styles['player-document-info-players-document-details-content-text']} tabIndex='0'>{"JPG"}</div>


                        <div tabIndex='0' style={{ minHeight: '100%' }}
                            className={styles['player-document-info-players-document-details-content-select']}
                        >
                            {this.getDocumentTypeId()}


                        </div>
                        {/* <div onClick={(e) => this.deleteImage( this.state.documentData[this.state.index].uploadId ) }
                                style={{ height: (this.state.toggle ? `100%` : '70%') }}
                                className={styles['player-document-info-players-document-details-content-delete']}>
                                <FontAwesomeIcon icon={faTrash} />
                            </div> */}

                        <div role='button' aria-pressesd={!this.state.toggle} tabIndex='0' style={{ height: '1.875vmax', cursor: 'pointer' }} onClick={(e) => { this.setState({ toggle: !this.state.toggle, refreshDataForImages: 0 }); }} className={styles['player-document-info-players-document-details-content-button-hide-show']}>
                            <div tabIndex='0'>{valuesOfDocumentType.find(e => e === this.state.documentData[this.state.index].documentType) === undefined ? 'Review' :  this.state.toggle ? 'Show': 'Hide'}</div>
                            {/* {this.state.toggle ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />} */}
                            {valuesOfDocumentType.find(e => e === this.state.documentData[this.state.index].documentType) !== undefined ? ( this.state.toggle ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faCaretUp} /> ) : "" }
                        </div>
                    </div>


                    {(!this.state.toggle && valuesOfDocumentType.find(e => e === this.state.documentData[this.state.index].documentType) !== undefined) && <><div id='document_image' className={styles['document-image-container']}>

                        <div

                            style={
                                {
                                    backgroundSize: ` ${this.state.zoom === 100 ? 'cover' : `${this.state.zoom}%`}`,
                                    backgroundImage: `url(${this.state.playersCurrentImage === undefined ? this.testIfImageIsAvailable() : this.state.playersCurrentImage})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    textAlign: 'center',
                                }
                            }
                            className={`${styles['document-image-src-container']}                         
                        ${this.state.rotation === 90 ? styles['rotateimg90'] :
                                    this.state.rotation === 180 ? styles['rotateimg180'] :
                                        this.state.rotation === 270 ? styles['rotateimg270'] :
                                            styles['rotateimg0']
                                }`} alt={'image_name'} >
                                     {
                                            this.state.playersCurrentImage === "" &&
                                            <h2>Image Not available</h2>

                                    }
                        </div>
                        {
                            this.state.playersCurrentImage === undefined &&
                            <div style={{ position: 'absolute', top: '37%', left: '45%' }}>
                                <CircularProgress />
                            </div>
                        }                        
                        <div className={styles['document-image-src-controll-container']}>
                            <div role='button' aria-pressed="false"
                                tabIndex='0'
                                aria-describedby='rotation'
                                onClick={(e) => this.setState({ rotation: ((this.state.rotation + 90) % 360) })}
                            >
                                <span style={{ display: 'none' }} id='rotation' aria-label='rotate 90 degrees.' ></span>
                                <FontAwesomeIcon role='img' tabIndex='0' aria-label='faReply icon' icon={faReply} />

                            </div>
                            <div style={{ display: 'inline' }} >
                                <span onClick={(e) => this.setState((state, props) => ({ zoom: state.zoom + 10 }))}
                                    role='button'
                                    tabIndex='0'
                                    aria-pressed="false"
                                    style={{ marginRight: '.2em' }}
                                    aria-describedby='zoomOut'
                                >
                                    <span style={{ display: 'none' }} id='zoomOut' arial-label='zoom out.'> </span>
                                    <FontAwesomeIcon role='img' arial-label='zoom out.' tabIndex='0' icon={faPlusCircle} />

                                </span>
                                <span role='button'
                                    tabIndex='0'
                                    aria-pressed="false"
                                    onClick={(e) => this.setState((state, props) => ({ zoom: state.zoom - 10 }))}
                                    aria-describedby='zoomIn'
                                >
                                    <span style={{ display: 'none' }} id='zoomIn' arial-label='zoom in.'></span>
                                    <FontAwesomeIcon role='img' tabIndex='0' arial-label='faMinusCircle' icon={faMinusCircle} />
                                </span>
                            </div>
                        </div>
                    </div></>}
                </div>

                {(!this.state.toggle
                    &&
                    valuesOfDocumentType.find(e => e === this.state.documentData[this.state.index].documentType) === undefined)
                    &&
                    <>


                        <div className={stylesPopUp['document-image-pop-up-outer-container']}>
                            <div className={stylesPopUp['document-image-pop-up-container']} >
                                <h3 tabIndex='0'>Review Document</h3>
                                <div className={stylesPopUp['document-image-container']}>
                                    <div
                                        style={
                                            {
                                                backgroundSize: ` ${this.state.zoom === 100 ? 'cover' : `${this.state.zoom}%`}`,
                                                backgroundImage: `url(  ${this.state.playersCurrentImage === undefined ? this.testIfImageIsAvailable() : this.state.playersCurrentImage} )`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center',
                                            }
                                        }
                                        className={`${stylesPopUp['document-image-src-container']}

                        ${this.state.rotation === 90 ? stylesPopUp['rotateimg90'] :
                                                this.state.rotation === 180 ? stylesPopUp['rotateimg180'] :
                                                    this.state.rotation === 270 ? stylesPopUp['rotateimg270'] :
                                                        stylesPopUp['rotateimg0']
                                            }`} alt={'image_name'} >
                                        {
                                            this.state.playersCurrentImage === "" &&

                                            <h2>Image Not available</h2>

                                        }
                                    </div>
                                    {
                                        this.state.playersCurrentImage === undefined &&
                                        <div style={{ position: 'absolute', top: '43%', left: '46%' }}>
                                            <CircularProgress />
                                        </div>
                                    }


                                    <div tabIndex='0' role='button' aria-pressed="false" className={stylesPopUp['document-image-src-controll-container']}>
                                        <FontAwesomeIcon tabIndex='0' arial-label='rotate 90 degrees.' onClick={(e) => this.setState((state, props) => ({ rotation: ((state.rotation + 90) % 360) }))} icon={faReply} />
                                        <div>
                                            <FontAwesomeIcon tabIndex='0' arial-label='zoom out.' onClick={(e) => this.setState((state, props) => ({ zoom: state.zoom + 10 }))} style={{ marginRight: '.2em' }} icon={faPlusCircle} />
                                            <FontAwesomeIcon tabIndex='0' arial-label='zoom in.' onClick={(e) => this.setState((state, props) => ({ zoom: state.zoom - 10 }))} icon={faMinusCircle} />
                                        </div>
                                    </div>
                                </div>
                                <h6>{this.setDateFormat(this.state.documentData[this.state.index].createdAt)}</h6>
                                <div className={stylesPopUp['document-image-pop-up-actions']}>
                                    <div className={stylesPopUp['document-image-pop-up-actions-radio-buttons-container']}>
                                        <div className={stylesPopUp['document-image-pop-up-actions-radio-select-container']}>
                                            <input type="radio" value="document_type_approved" name="document_type" onChange={(e) => this.getpopUpCheckButton(e)} />
                                            <div tabIndex='0' >Approved and</div>

                                            <select tabIndex='0' style={{ height: '1.875vmax'}}
                                                className={stylesPopUp['player-document-info-players-document-details-content-select']}
                                                onChange={(e) => this.setDocumentTypeFromPopUp(e)}   >
                                                {
                                                    this.state.documentTypeId.map((element, i) => {
                                                        return <option key={element} value={i === 0 ? undefined : valuesOfDocumentType[i - 1]}>{element}</option>;

                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className={stylesPopUp['document-image-pop-up-actions-radio-container']}>
                                            
                                                <input type="radio" value='document_type_deny' name="document_type" onChange={(e) => this.getpopUpCheckButton(e)} />
                                                <div tabIndex='0' /*style={{ marginLeft: '.95vw' }} */>Deny and delete file</div><br />
                                                <div style={{width:'7.5vmax'}}></div>
                                            
                                        </div>

                                        <div role='button' aria-pressesd="false" tabIndex='0' style={{ height: '2.5vmax', cursor: 'pointer' }} onClick={(e) => this.popupActionSave()} className={stylesPopUp['player-document-info-players-document-details-content-button-hide-show']}>
                                            <div> Save</div>
                                        </div>
                                        <div role='button' tabIndex='0' aria-pressesd="false" style={{ cursor: 'pointer' }} onClick={(e) => this.popupActionCancel()} style={{ fontSize: '1.1em', color: '#173E67' }}>Cancel</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>}

            </>

        );

    }


    render() {
        return (<>{(this.state.isData && this.state.documentData.length > 0) && this.renderMountedPageWithData()}</>);
    }
}

export { DisplayDocument }

