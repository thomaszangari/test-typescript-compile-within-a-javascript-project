import React from "react";
import {action, observable, toJS} from "mobx";
import config from "../config";

export class SettingsStore {

    rootStore = null;

    @observable showConfirmSaveModal = false;
    @observable showToast = false;
    @observable successMessage = '';
    @observable errorMessage = '';

    @observable inboundRules = []
    @observable inboundRules_UNMODIFIED = []

    @observable myIPAddress = '';

    constructor(rootStore) {
        this.rootStore = rootStore;

    }

    setShowConfirmSaveModal(flag) {
        this.showConfirmSaveModal = flag
    }

    /**
     *
     */
    @action getMFABypassRules() {

        /*        this.inboundRules = [
                    {id: 1, source: 'source1', ip: '0.0.0.0', description: 'test1'},
                    {id: 2, source: 'source2', ip: '1.1.1.1', description: 'test2'},
                    {id: 3, source: 'source3', ip: '2.2.2.2', description: 'test3'}
                ];

                this.inboundRules_UNMODIFIED = this.inboundRules;

        */

        fetch(`${config.SERVER_BASE_URL}/v1/settings/inboundrules`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.data) {
                    this.setMFABypassRules(res.data);
                    this.setMFABypassRules_UNMODIFIED(res.data);
                } else if (res && res.error) {
                    const errorMessage = res.error;
                }
            })
            .catch((error) => {
                // alert(error.toString())
                this.errorMessage = error.toString();
            });

    }

    /**
     *
     * @param data
     */
    @action setMFABypassRules(data) {
        //this.inboundRules.splice(0, this.inboundRules.length)
        if (data) {
            this.inboundRules = data;
        } else {
            this.inboundRules = [];
        }
    }

    /**
     *
     * @param data
     */
    @action setMFABypassRules_UNMODIFIED(data) {
        this.inboundRules_UNMODIFIED.splice(0, this.inboundRules_UNMODIFIED.length)
        if (data) {
            this.inboundRules_UNMODIFIED = data;
        } else {
            this.inboundRules_UNMODIFIED = [];
        }
    }

    /**
     *
     * @param source
     * @param description
     */
    @action addMFABypassRule(source, description) {
        const _inboundRules = this.inboundRules;
        const id = Math.random();
        const obj = {
            id: id,
            source: '',
            ip: '',
            description: ''
        }
        _inboundRules.push(obj);
        this.inboundRules = _inboundRules;
    }

    /**
     *
     * @param source
     * @param description
     */
    @action deleteMFABypassRule(id) {
        const _inboundRules = toJS(this.inboundRules);
        const index = _inboundRules.findIndex(obj => obj.id === id);
        _inboundRules.splice(index, 1);
        this.inboundRules = _inboundRules;
    }

    /**
     *
     */
    @action saveMFABypassRules() {

        //alert(JSON.stringify(this.inboundRules))

        // API CALL

        fetch(`${config.SERVER_BASE_URL}/v1/settings/inboundrules`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.inboundRules),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.message) {
                    this.setMFABypassRules_UNMODIFIED(this.inboundRules);
                    this.successMessage = res.message;
                    this.errorMessage = null;
                    this.showToast = true;
                    this.showConfirmSaveModal = false;
                } else if (res && res.error) {
                    this.successMessage = null;
                    this.errorMessage = res.error
                    this.showToast = true;
                    this.showConfirmSaveModal = false;
                }
            })
            .catch((error) => {
                this.errorMessage = error.toString();
            });
    }

    @action discardMFABypassRuleChanges() {
        this.inboundRules.splice(0, this.inboundRules.length);
        this.inboundRules = this.inboundRules_UNMODIFIED;
    }

    @action getMyIPAddress() {

        fetch(`${config.SERVER_BASE_URL}/v1/ipaddress`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.text())
            .then(res => {
                if (res) {
                    this.myIPAddress = res;
                } else if (res && res.error) {
                    const errorMessage = res.error;
                }
            })
            .catch((error) => {
                alert(error.toString())
                this.errorMessage = error.toString();
            });

        return this.myIPAddress;
    }

    setToast(flag) {
        this.showToast = flag;
        this.successMessage = null;
        this.errorMessage = null;
    }

}