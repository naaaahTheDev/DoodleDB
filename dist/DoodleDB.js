import { readFile, writeFile } from "fs/promises";
export class DoodleDB {
    path;
    constructor(options) {
        this.path = options.filePath;
    }
    /**
     * Pushes data to a collection in the JSON file.
     * @returns {Promise<string>} Success / Error message
     */
    async push(options) {
        const { collectionName, data } = options;
        const fileData = await this.readJSONData();
        if (!fileData.success && fileData.error?.code === "ENOENT") {
            const initialData = {
                [collectionName]: [],
            };
            const initialJsonData = JSON.stringify(initialData, null, 2);
            await writeFile(this.path, initialJsonData);
        }
        const jsonData = fileData.jsonData || {};
        jsonData[collectionName] ??= [];
        const dataCollection = jsonData[collectionName];
        const id = data.id || dataCollection.length + 1;
        dataCollection.push({ id, ...data }); //Push the new collection under collections.
        const writeResult = await this.saveJSONData(jsonData);
        if (!writeResult.success) {
            const errorMessage = `Error writing JSON file: ${writeResult.error}`;
            return errorMessage;
        }
        const successMessage = "Data has been successfully added to the JSON file.";
        return successMessage;
    }
    /**
     *
     * Retrieves data from the JSON database based on a search query.
     * @returns An array of objects matching the search query.
     */
    async get(options) {
        const { collectionName, searchQuery } = options;
        const readResult = await this.readJSONData();
        if (readResult.error) {
            return Promise.reject(readResult.error);
        }
        const jsonData = readResult.jsonData || {};
        const dataCollection = jsonData[collectionName];
        if (!dataCollection) {
            const errMessage = "No data found in the specified dataCollection.";
            return Promise.reject(errMessage);
        }
        const foundData = dataCollection.filter((data) => {
            for (const key in searchQuery) {
                const indexObject = jsonData[`${collectionName}_${key}_index`];
                const indexedArray = indexObject?.[key] || [];
                const fieldValue = data[key];
                if (indexedArray.length > 0) {
                    const matchingIndexes = indexedArray.filter((index) => fieldValue === index);
                    if (matchingIndexes.length > 0) {
                        return true;
                    }
                }
                else {
                    const queryValue = searchQuery[key].toString().toLowerCase();
                    const dataValue = data[key].toString().toLowerCase();
                    if (Number(dataValue) === searchQuery[key]) {
                        return true;
                    }
                    else if (dataValue && dataValue.includes(queryValue)) {
                        return true;
                    }
                }
                return false;
            }
        });
        return foundData;
    }
    /**
     * Retrieves an entire collection from the JSON file.
     * @returns The entire collection matching the collectionName.
     */
    async getCollection(options) {
        const { collectionName } = options;
        const readResult = await this.readJSONData();
        if (readResult.error) {
            return Promise.reject(readResult.error);
        }
        const jsonData = readResult.jsonData || {};
        const dataCollection = jsonData[collectionName];
        if (!dataCollection) {
            const errMessage = "No collection with the provided name was found.";
            return Promise.reject(errMessage);
        }
        return dataCollection;
    }
    /**
     * Edit an object from an existing collection in the JSON file.
     * @returns {Promise<string>} Success / Error message.
     */
    async edit(options) {
        const { collectionName, targetID, updatedData } = options;
        const readResult = await this.readJSONData();
        if (readResult.error) {
            return Promise.reject(readResult.error);
        }
        const jsonData = readResult.jsonData || {};
        const dataCollection = jsonData[collectionName];
        if (!dataCollection) {
            const errMessage = 'No collection with the provided name was found.';
            return Promise.reject(errMessage);
        }
        const dataToEdit = dataCollection.find((data) => data.id === targetID);
        if (!dataToEdit) {
            const errMessage = 'No dataset found with the provided target ID';
            return Promise.reject(errMessage);
        }
        let isIndexed = false;
        for (const key in updatedData) {
            if (updatedData.hasOwnProperty(key)) {
                const fieldValue = updatedData[key];
                //Update the data field
                dataToEdit[key] = fieldValue;
                //Check if the index object exists
                const indexObject = jsonData[`${collectionName}_${key}_index`];
                const indexedArray = indexObject?.[fieldValue] || [];
                if (indexedArray.length > 0) {
                    const matchingIndexes = indexedArray.filter((index) => index === fieldValue);
                    if (matchingIndexes.length > 0) {
                        indexedArray.push(targetID);
                        isIndexed = true;
                    }
                }
            }
        }
        if (!isIndexed) {
            //Fall back to regular search through the entire JSOn file
            for (const key in updatedData) {
                dataToEdit[key] = updatedData[key];
            }
        }
        const writeResult = await this.saveJSONData(jsonData);
        if (writeResult.error) {
            return Promise.reject(writeResult.error);
        }
        return "JSON file has been updated successfully updated";
    }
    /**
     * Delete a collection from a JSON file.
     * @returns {Promise<string>} Success / Error message.
     */
    async deleteObject(options) {
        const { collectionName, targetID } = options;
        const readResult = await this.readJSONData();
        if (readResult.error) {
            return Promise.reject(readResult.error);
        }
        const jsonData = readResult.jsonData || {};
        const dataCollection = jsonData[collectionName];
        if (!dataCollection) {
            const errMessage = 'No collection with the provided name was found.';
            return Promise.reject(errMessage);
        }
        const deleteDataset = dataCollection.find((data) => data.id === targetID);
        if (!deleteDataset) {
            const errMessage = `Dataset with ID ${targetID} not found.`;
            return Promise.reject(errMessage);
        }
        const propertiesToDelete = Object.keys(deleteDataset);
        for (const property of propertiesToDelete) {
            delete deleteDataset[property];
        }
        const filteredArray = dataCollection.filter((data) => Object.keys(data).length > 0);
        jsonData[collectionName] = filteredArray;
        const writeResult = await this.saveJSONData(jsonData);
        if (writeResult.error) {
            return Promise.reject(writeResult.error);
        }
        return "JSON file has been updated successfully!";
    }
    /**
     * Delete specific properties from a dataset in the JSON file.
     * @returns {Promise<string>} Success / Error message.
     */
    async delete(options) {
        const { collectionName, targetID, targetKeys } = options;
        const readResult = await this.readJSONData();
        if (readResult.error) {
            return Promise.reject(readResult.error);
        }
        const jsonData = readResult.jsonData || {};
        const dataCollection = jsonData[collectionName];
        if (!dataCollection) {
            const errMessage = 'No collection with the provided name was found.';
            return Promise.reject(errMessage);
        }
        const targetData = dataCollection.find((data) => data.id === targetID);
        if (!targetData) {
            return Promise.reject(`Dataset with ID ${targetID} not found.`);
        }
        for (const key of targetKeys) {
            delete targetData[key];
        }
        const writeResult = await this.saveJSONData(jsonData);
        if (writeResult.error) {
            return Promise.reject(writeResult.error);
        }
        return 'JSON file has been updated successfully!';
    }
    //Indexing
    /**
     * Creates an index for faster searching
     * @returns {Promise<string>} Error / success message
     */
    async createIndex(options) {
        const { collectionName, fieldName } = options;
        const readResult = await this.readJSONData();
        if (readResult.error)
            return Promise.reject(readResult.error);
        const dataObject = readResult.jsonData || {};
        const dataCollection = dataObject[collectionName];
        dataObject[`${collectionName}_${fieldName}_index`] ??= {};
        const indexObject = dataObject[`${collectionName}_${fieldName}_index`];
        for (const data of dataCollection) {
            const fieldValue = data[fieldName];
            if (!fieldValue)
                continue;
            indexObject[fieldValue] ??= [];
            // Check if fieldValue is already a part of the indexed object.
            if (indexObject[fieldValue].includes(data.id))
                continue;
            indexObject[fieldValue].push(data.id);
        }
        const writeResult = await this.saveJSONData(dataObject);
        if (writeResult.error)
            return Promise.reject(writeResult.error);
        return `Successfully indexed "${fieldName}" under collection: ${collectionName}`;
    }
    /** @ignore */
    async readJSONData() {
        try {
            const file = await readFile(this.path, "utf-8");
            const json = JSON.parse(file);
            return { jsonData: json, success: true };
        }
        catch (error) {
            return { error, success: false };
        }
    }
    /** @ignore */
    async saveJSONData(data) {
        try {
            await writeFile(this.path, JSON.stringify(data, null, 2));
            return { success: true };
        }
        catch (error) {
            return { error, success: false };
        }
    }
}
//# sourceMappingURL=DoodleDB.js.map