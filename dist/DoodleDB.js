import chalk from "chalk";
import { readFile, writeFile } from "fs/promises";
export class DoodleDB {
    path;
    constructor(options) {
        this.path = options.filePath;
    }
    /**
     * Pushes data to a collection in the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    async push(options) {
        const { collectionName, data } = options;
        const fileData = await this.readDataObject();
        // File does not exist, create the file
        if (!fileData.ok && fileData.error?.code === "ENOENT") {
            const initialData = {
                [collectionName]: [],
            };
            const initialJsonData = JSON.stringify(initialData, null, 2);
            await writeFile(this.path, initialJsonData);
        }
        const dataObject = fileData.json || {};
        dataObject[collectionName] ??= [];
        const dataCollection = dataObject[collectionName];
        const id = data.id || dataCollection.length + 1;
        dataCollection.push({ id, ...data });
        const writeResult = await this.saveDataObject(dataObject);
        if (!writeResult.ok) {
            const errorMessage = `Error writing JSON file: ${writeResult.error}`;
            console.error(chalk.red(errorMessage));
            return errorMessage;
        }
        const successMessage = "New data has been added to the JSON file successfully!";
        return successMessage;
    }
    /**
     * Retrieves data from the JSON database based on a search query.
     * @returns An array of objects matching the search query.
     */
    async get(options) {
        const { collectionName, searchQuery } = options;
        const readResult = await this.readDataObject();
        if (readResult.error) {
            console.error(chalk.red(readResult.error));
            return Promise.reject(readResult.error);
        }
        const dataObject = readResult.json || {};
        const dataCollection = dataObject[collectionName];
        if (!dataCollection) {
            const errMessage = "No data found in the specified dataCollection.";
            return Promise.reject(errMessage);
        }
        const foundData = dataCollection.filter((data) => {
            for (const key in searchQuery) {
                const indexObject = dataObject[`${collectionName}_${key}_index`];
                const fieldValue = data[key];
                if (indexObject?.[key]) {
                    const indexedArray = indexObject[key]; //Array of indexes
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
                    else if (dataValue?.includes(queryValue)) {
                        return true;
                    }
                }
            }
            return false;
        });
        return foundData;
    }
    /**
     * Retrieve an entire collection from the JSON file
     */
    async getCollection(options) {
        const { collectionName } = options;
        const readResult = await this.readDataObject();
        if (readResult.error) {
            console.error(chalk.red(readResult.error));
            return Promise.reject(readResult.error);
        }
        const dataObject = readResult.json || {};
        const dataCollection = dataObject[collectionName];
        if (!dataCollection)
            return Promise.reject("Collection not found.");
        return dataCollection;
    }
    /**
     * Edit an object from an existing collection in the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    async edit(options) {
        const { collectionName, objectID, editObject } = options;
        const readResult = await this.readDataObject();
        if (readResult.error)
            return Promise.reject(readResult.error);
        const dataObject = readResult.json || {};
        const dataCollection = dataObject[collectionName];
        if (!dataCollection)
            return Promise.reject("No data found in the specified dataCollection");
        const dataToEdit = dataCollection.find((data) => data.id === objectID);
        if (!dataToEdit)
            return Promise.reject("No dataset found with the provided object ID.");
        let isIndexed = false;
        for (const key in editObject) {
            const fieldValue = editObject[key];
            //Update the data field
            dataToEdit[key] = fieldValue;
            //Check if index object exists
            const indexObject = dataObject[`${collectionName}_${fieldValue}_index`];
            if (!indexObject?.[fieldValue])
                continue;
            const indexedArray = indexObject[fieldValue];
            const matchingIndexes = indexedArray.filter((index) => index === fieldValue);
            if (matchingIndexes.length > 0)
                indexedArray.push(objectID);
            isIndexed = true;
        }
        if (!isIndexed) {
            //Fall back to regular search through the entire JSON file
            for (const key in editObject) {
                dataToEdit[key] = editObject[key];
            }
        }
        const writeResult = await this.saveDataObject(dataObject);
        if (writeResult.error)
            return Promise.reject(writeResult.error);
        return "JSON file has been updated successfully!";
    }
    /**
     * Delete an object from a collection in the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    async deleteObject(options) {
        const { collectionName, objectID } = options;
        const readResult = await this.readDataObject();
        if (readResult.error)
            return Promise.reject(readResult.error);
        const dataObject = readResult.json || {};
        const dataCollection = dataObject[collectionName];
        const targetSet = dataCollection.find((data) => data.id === objectID);
        if (!targetSet)
            return Promise.reject(`Dataset with ID ${objectID} not found.`);
        const targetProperties = Object.keys(targetSet);
        for (const property of targetProperties) {
            delete targetSet[property];
        }
        const filteredArray = dataCollection.filter((data) => Object.keys(data).length > 0);
        dataObject[collectionName] = filteredArray;
        const writeResult = await this.saveDataObject(dataObject);
        if (writeResult.error)
            return Promise.reject(writeResult.error);
        return "JSON file has been updated successfully!";
    }
    /**
     * Deletes specific properties from an existing dataset in the JSON file.
     * @returns {Promise<string>} Error / success message
     */
    async delete(options) {
        const { collectionName, objectID, targetKeys } = options;
        const readResult = await this.readDataObject();
        if (readResult.error)
            return Promise.reject(readResult.error);
        const dataObject = readResult.json || {};
        const dataCollection = dataObject[collectionName];
        const targetData = dataCollection.find((data) => data.id === objectID);
        if (!targetData)
            return Promise.reject(`Dataset with ID ${objectID} not found.`);
        for (const key of targetKeys) {
            delete targetData[key];
        }
        const writeResult = await this.saveDataObject(dataObject);
        if (writeResult.error)
            return Promise.reject(writeResult.error);
        return "JSON file has been updated successfully!";
    }
    /**
     * Creates an index for faster searching
     * @returns {Promise<string>} Error / success message
     */
    async createIndex(options) {
        const { collectionName, fieldName } = options;
        const readResult = await this.readDataObject();
        if (readResult.error)
            return Promise.reject(readResult.error);
        const dataObject = readResult.json || {};
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
        const writeResult = await this.saveDataObject(dataObject);
        if (writeResult.error)
            return Promise.reject(writeResult.error);
        return `Successfully indexed "${fieldName}" under collection: ${collectionName}`;
    }
    /** @ignore */
    async readDataObject() {
        try {
            const file = await readFile(this.path, "utf-8");
            const json = JSON.parse(file);
            return { json, ok: true };
        }
        catch (error) {
            return { error, ok: false };
        }
    }
    /** @ignore */
    async saveDataObject(data) {
        try {
            await writeFile(this.path, JSON.stringify(data, null, 2));
            return { ok: true };
        }
        catch (error) {
            return { error, ok: false };
        }
    }
}
//# sourceMappingURL=DoodleDB.js.map