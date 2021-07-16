import {create} from 'mobx-persist';
import {PlayerStore} from "./PlayerStore";
import {AuthStore} from "./AuthStore";
import {SettingsStore} from "./SettingsStore";
import {ClaimStore} from "./ClaimStore";
import {MiscellaneousStore} from "./MiscellaneousStore";

const hydrate = create({
    storage: localStorage
});

class RootStore {

    playerStore = null;
    authStore = null;
    settingsStore = null;
    claimStore = null;
    miscellaneousStore = null;

    constructor() {

        this.playerStore = new PlayerStore(this);
        this.authStore = new AuthStore(this);
        this.settingsStore = new SettingsStore(this);
        this.claimStore = new ClaimStore(this);
        this.miscellaneousStore = new MiscellaneousStore(this);

        Promise.all([
            hydrate('auth', this.authStore),
            hydrate('player', this.playerStore),
            hydrate('settings', this.settingsStore),
            hydrate('claim', this.claimStore),
            hydrate('miscellaneous', this.miscellaneousStore)
        ])
            .then(() => console.log('All Stores Hydrated.'));
    }

}

export const rootStore = new RootStore()
