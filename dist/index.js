import chalk from "chalk";
import fs from "fs";
export default {
    push(options) {
        return new Promise((resolve, reject) => {
            const { filePath, collectionName, data } = options;
            fs.readFile(filePath, 'utf8', (err, fileData) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        //File does not exist, create the file
                        const initialData = {
                            [collectionName]: []
                        };
                        const initialJsonData = JSON.stringify(initialData, null, 2);
                        fs.writeFile(filePath, initialJsonData, (writeError) => {
                            if (writeError) {
                                reject(writeError);
                                return;
                            }
                            //Call the push function recursively now that the file is created
                            this.push({ filePath, collectionName, data });
                        });
                    }
                    else {
                        reject(err);
                        return;
                    }
                }
                else {
                    let dataObject = {};
                    try {
                        if (fileData) {
                            dataObject = JSON.parse(fileData);
                        }
                    }
                    catch (parseError) {
                        reject(parseError);
                        return;
                    }
                    if (!dataObject[collectionName]) {
                        dataObject[collectionName] = [];
                    }
                    const dataCollection = dataObject[collectionName];
                    const id = data.id || dataCollection.length + 1;
                    dataCollection.push({ id, ...data });
                    const updatedJsonData = JSON.stringify(dataObject, null, 2);
                    fs.writeFile(filePath, updatedJsonData, (writeError) => {
                        if (writeError) {
                            console.error(chalk.red('Error writing JSON file:', writeError));
                            return;
                        }
                        const successMessage = 'New data has been added to the JSON file successfully!';
                        resolve(successMessage);
                    });
                }
            });
        });
    },
    get(options) {
        const { filePath, collectionName, searchQuery } = options;
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, jsonData) => {
                if (err) {
                    console.error(chalk.red(err));
                    reject(err);
                    return;
                }
                let dataObject = {};
                try {
                    dataObject = JSON.parse(jsonData);
                }
                catch (err) {
                    reject(err);
                }
                const dataCollection = dataObject[collectionName];
                if (!dataCollection) {
                    const errMessage = 'No data found in the specified dataCollection.';
                    reject([errMessage]);
                }
                const foundData = dataCollection.filter((data) => {
                    for (const key in searchQuery) {
                        const indexObject = dataObject[`${collectionName}_${key}_index`];
                        const fieldValue = data[key];
                        if (indexObject && indexObject[key]) {
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
                            else if (dataValue && dataValue.includes(queryValue)) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
                resolve(foundData);
            });
        });
    },
    getCollection(options) {
        const { filePath, collectionName } = options;
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, jsonData) => {
                if (err) {
                    console.error(chalk.red(err));
                    reject(err);
                    return;
                }
                let dataObject = {};
                try {
                    dataObject = JSON.parse(jsonData);
                }
                catch (err) {
                    reject(err);
                }
                const dataCollection = dataObject[collectionName];
                if (!dataCollection) {
                    reject("Collection not found.");
                    return;
                }
                else {
                    resolve(dataCollection);
                }
            });
        });
    },
    edit(options) {
        const { filePath, collectionName, objectID, editObject } = options;
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, jsonData) => {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    const dataObject = JSON.parse(jsonData);
                    const dataCollection = dataObject[collectionName];
                    if (!dataCollection) {
                        reject('No data found in the specified dataCollection');
                        return;
                    }
                    const dataToEdit = dataCollection.find((data) => data.id === objectID);
                    if (!dataToEdit) {
                        reject('No dataset found with the provided object ID.');
                        return;
                    }
                    let isIndexed = false;
                    for (const key in editObject) {
                        if (editObject.hasOwnProperty(key)) {
                            const fieldValue = editObject[key];
                            //Update the data field
                            dataToEdit[key] = fieldValue;
                            //Check if index object exists
                            const indexObject = dataObject[`${collectionName}_${fieldValue}_index`];
                            if (indexObject && indexObject[fieldValue]) {
                                const indexedArray = indexObject[fieldValue];
                                const matchingIndexes = indexedArray.filter((index) => index === fieldValue);
                                if (matchingIndexes.length > 0) {
                                    indexedArray.push(objectID);
                                }
                                isIndexed = true;
                            }
                        }
                    }
                    if (!isIndexed) {
                        //Fall back to regular search through the entire JSON file
                        for (const key in editObject) {
                            dataToEdit[key] = editObject[key];
                        }
                    }
                    const updatedJsonData = JSON.stringify(dataObject, null, 2);
                    fs.writeFile(filePath, updatedJsonData, (writeError) => {
                        if (writeError) {
                            reject(writeError);
                            return;
                        }
                        resolve('JSON file has been updated successfully!');
                    });
                }
                catch (err) {
                }
            });
        });
    },
    delCollection(options) {
        const { filePath, collectionName, objectID } = options;
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, jsonData) => {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    const dataObject = JSON.parse(jsonData);
                    const dataCollection = dataObject[collectionName];
                    const setToDel = dataCollection.find((data) => data.id === objectID);
                    if (setToDel) {
                        const propertiesToDelete = Object.keys(setToDel);
                        for (const property of propertiesToDelete) {
                            delete setToDel[property];
                        }
                    }
                    else {
                        reject(`Dataset with ID ${objectID} not found.`);
                        return;
                    }
                    const filteredArray = dataCollection.filter((data) => Object.keys(data).length > 0);
                    dataObject[collectionName] = filteredArray;
                    const updatedJsonData = JSON.stringify(dataObject, null, 2);
                    fs.writeFile(filePath, updatedJsonData, (writeError) => {
                        if (writeError) {
                            reject(writeError);
                            return;
                        }
                        resolve('JSON file has been updated successfully!');
                    });
                }
                catch (err) {
                    reject(err);
                    return;
                }
            });
        });
    },
    del(options) {
        const { filePath, collectionName, objectID, deleteObject } = options;
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, jsonData) => {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    const dataObject = JSON.parse(jsonData);
                    const dataCollection = dataObject[collectionName];
                    const dataToDel = dataCollection.find((data) => data.id === objectID);
                    if (dataToDel) {
                        for (const key in deleteObject) {
                            delete dataToDel[key];
                        }
                    }
                    else {
                        reject(`Dataset with ID ${objectID} not found.`);
                        return;
                    }
                    const updatedJsonData = JSON.stringify(dataObject, null, 2);
                    fs.writeFile(filePath, updatedJsonData, (writeError) => {
                        if (writeError) {
                            reject(writeError);
                            return;
                        }
                        resolve('JSON file has been updated successfully!');
                    });
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    },
    //Indexing
    createIndex(options) {
        const { filePath, collectionName, fieldName } = options;
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, jsonData) => {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    const dataObject = JSON.parse(jsonData);
                    const dataCollection = dataObject[collectionName];
                    if (!dataObject[`${collectionName}_${fieldName}_index`]) {
                        dataObject[`${collectionName}_${fieldName}_index`] = {};
                    }
                    const indexObject = dataObject[`${collectionName}_${fieldName}_index`];
                    dataCollection.forEach((data) => {
                        const fieldValue = data[fieldName];
                        if (fieldValue !== undefined) {
                            //Check if fieldValue is already a part of the indexed object.
                            if (!indexObject[fieldValue]) {
                                indexObject[fieldValue] = [];
                            }
                            if (indexObject[fieldValue].includes(data.id)) {
                                return;
                            }
                            indexObject[fieldValue].push(data.id);
                        }
                    });
                    const updatedJsonData = JSON.stringify(dataObject, null, 2);
                    fs.writeFile(filePath, updatedJsonData, (writeError) => {
                        if (writeError) {
                            reject(err);
                            return;
                        }
                        resolve(`Successfully indexed "${fieldName}", under collection: ${collectionName}`);
                    });
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
};
//# sourceMappingURL=index.js.map