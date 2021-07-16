import React from "react";
import {toJS, observable} from 'mobx';

export class MiscellaneousStore {

    rootStore = null;

    // Cron JOB error data
    @observable notificationErrorList = [];
    @observable showNotificationToast = false;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    setFailedJobDetails(data) {
        if(this.notificationErrorList) {
            this.notificationErrorList.push(data)
        } else {
            this.notificationErrorList = [data];
        }
        this.showNotificationToast = true;
    }

    toggleNotification(data) {
        debugger
        if(this.notificationErrorList) {
            const cronJobData = JSON.parse(JSON.stringify(toJS(this.notificationErrorList)));
            const index = cronJobData.findIndex(d => d.id === data.id);
            cronJobData.splice(index, 1);
            this.notificationErrorList = cronJobData;
            this.showNotificationToast = cronJobData.length !== 0;
        }
    }

}