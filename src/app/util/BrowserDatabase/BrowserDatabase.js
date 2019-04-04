/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

// TODO: maybe consider moving to IndexedDB insead of localStorage

/**
 * Set of helpers related to Browser Database
 * @class CSS
 */
class BrowserDatabase {
    /**
     * Loads data from browser storage
     * @param {String} location Name of the local storage
     * @return {Object} Object stored in a specified path
     * @memberof BrowserDatabase
     */
    getItem(location) {
        try {
            const entryObject = JSON.parse(localStorage.getItem(location));
            const { data, expiration, createdAt } = entryObject;

            if (expiration && Date.now() - createdAt > expiration * 1000) {
                localStorage.removeItem(location);
                return null;
            }

            return data;
        } catch {
            return null;
        }
    }

    /**
     * Save data to local storage
     * @param {Any} data The value to save to local storage
     * @param {String} location Name of the local storage
     * @param {Number} expiration Time to store entry (in seconds)
     * @return {Void}
     * @memberof BrowserDatabase
     */
    setItem(data, location, expiration) {
        localStorage.setItem(location, JSON.stringify({
            data,
            expiration,
            createdAt: Date.now()
        }));
    }
}

export default new BrowserDatabase();
