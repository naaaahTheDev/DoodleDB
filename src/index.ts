import chalk from "chalk";
import fs from "fs";

interface DataObject {
  [key: string]: any;
}

export default {
  push(filePath: string, dataArrayName: string, data: { id?: number, [key: string]: any}): void {
    fs.readFile(filePath, 'utf8', (err, fileData) => {
      if (err) {
        if (err.code === 'ENOENT') {
            //File does not exist, create the file
            const initialData = {
                [dataArrayName]: []
            };
            const initialJsonData = JSON.stringify(initialData, null, 2);

            fs.writeFile(filePath, initialJsonData, (writeError) => {
                if (writeError) {
                    console.error(chalk.red('Error creating JSON file:', writeError));
                    return;
                }
                console.log(chalk.green('Database file created successfully.'));
                //Call the push function recursively now that the file is created
                this.push(filePath, dataArrayName, data);
            });
        } else {
            console.error(chalk.red('Error reading JSON file', err));
        }
      } else {
      let dataObject: DataObject = {};

      try {
        if (fileData) {
          dataObject = JSON.parse(fileData);
        }
      } catch (parseError) {
        console.error(chalk.red('Error parsing JSON file:', parseError));
        return;
      }

      if (!dataObject[dataArrayName]) {
        dataObject[dataArrayName] = [];
      }

      const dataArray = dataObject[dataArrayName];

      const id = data.id || dataArray.length + 1;

      dataArray.push({ id, ...data });

      const updatedJsonData = JSON.stringify(dataObject, null, 2);

      fs.writeFile(filePath, updatedJsonData, (writeError) => {
        if (writeError) {
          console.error(chalk.red('Error writing JSON file:', writeError));
          return;
        }
        console.log(chalk.green('New data has been added to the JSON file successfully!'));
      });
    }
    });
  },

  get(filePath: string, dataArrayName: string, searchQuery: { [key: string]: string | number }, callback: (foundData: any[]) => void): void {
    fs.readFile(filePath, 'utf8', (err, jsonData) => {
      if (err) {
        console.error(chalk.red(err));
        return;
      }
      let dataObject: DataObject = {};

      try {
        dataObject = JSON.parse(jsonData);
      } catch (err) {
        console.error(chalk.red('Error while parsing data ' + err));
      }

      const dataArray = dataObject[dataArrayName];
      if (!dataArray) {
        console.log(chalk.yellow('No data found in the specified dataArray.'));
        return;
      }

      const foundData = dataArray.filter((data: DataObject) => {
        for (const key in searchQuery) {
          const queryValue = searchQuery[key].toString().toLowerCase();
          const dataValue = data[key].toString().toLowerCase();
          if (Number(dataValue) === searchQuery[key]) {
            return true;
          } else if (dataValue && dataValue.includes(queryValue)) {
            return true;
          }
        }
        return false;
      });
      callback(foundData);
    });
  },

  getArray(filePath: string, dataArrayName: string, callback: (dataArray: any[]) => void): void {
    fs.readFile(filePath, 'utf8', (err, jsonData) => {
      if (err) {
        console.error(chalk.red(err));
      }

      let dataObject: DataObject = {};

      try {
        dataObject = JSON.parse(jsonData);
      } catch (err) {
        console.error(chalk.red('Error while parsing data ' + err));
      }

      const dataArray = dataObject[dataArrayName];
      if (!dataArray) {
        console.log(chalk.red('Data array not found'));
        return;
      } else {
        callback(dataArray);
      }
    });
  },

  edit(filePath: string, dataArrayName: string, objectID: number, editObject: {[key: string]: string | number}): void {
    fs.readFile(filePath, 'utf8', (err, jsonData) => {
      if (err) {
        console.error(chalk.red('Error reading JSON file: ', err));
        return;
      }

      try {
        const dataObject: DataObject = JSON.parse(jsonData);

        const dataArray = dataObject[dataArrayName];

        const dataToEdit = dataArray.find((data: DataObject) => data.id === objectID);

        if (dataToEdit) {
          for (const key in editObject) {
            dataToEdit[key] = editObject[key];
          }
        } else {
          console.log(chalk.red(`Dataset with ID ${objectID} not found.`));
          return;
        }

        const updatedJsonData = JSON.stringify(dataObject, null, 2);

        fs.writeFile(filePath, updatedJsonData, (writeError) => {
          if (writeError) {
            console.error(chalk.red('Error while writing JSON file ' + writeError));
            return;
          }
          console.log(chalk.green('JSON file has been updated successfully!'));
        });
      } catch (err) {
        console.error(chalk.red('Error while finding data ' + err));
      }
    });
  },

  delSet(filePath: string, dataArrayName: string, objectID: number): void {
    fs.readFile(filePath, 'utf8', (err, jsonData) => {
      if (err) {
        console.error(chalk.red('Error while reading JSON file ' + err));
        return;
      }

      try {
        const dataObject: DataObject = JSON.parse(jsonData);
        const dataArray = dataObject[dataArrayName];

        const setToDel = dataArray.find((data: DataObject) => data.id === objectID);

        if (setToDel) {
          const propertiesToDelete = Object.keys(setToDel);

          for (const property of propertiesToDelete) {
            delete setToDel[property];
          }
        } else {
          console.log(`Dataset with ID ${objectID} not found.`);
          return;
        }

        const filteredArray = dataArray.filter((data: DataObject) => Object.keys(data).length > 0);

        dataObject[dataArrayName] = filteredArray;

        const updatedJsonData = JSON.stringify(dataObject, null, 2);

        fs.writeFile(filePath, updatedJsonData, (writeError) => {
          if (writeError) {
            console.error(chalk.red('Error writing JSON file: ', writeError));
            return;
          }
          console.log(chalk.green('JSON file has been updated successfully!'));
        });
      } catch (err) {
        console.error(chalk.red('Error while finding data ' + err));
        return;
      }
    });
  },
  del(filePath: string, dataArrayName: string, objectID: number, deleteObject: object): void {
    fs.readFile(filePath, 'utf8', (err, jsonData) => {
      if (err) {
        console.error(chalk.red('Error while reading JSON file ' + err));
        return;
      }

      try {
        const dataObject: DataObject = JSON.parse(jsonData);
        const dataArray = dataObject[dataArrayName];

        const dataToDel = dataArray.find((data: DataObject) => data.id === objectID);

        if (dataToDel) {
          for (const key in deleteObject) {
            delete dataToDel[key];
          }
        } else {
          console.log(`Dataset with ID ${objectID} not found.`);
          return;
        }

        const updatedJsonData = JSON.stringify(dataObject, null, 2);

        fs.writeFile(filePath, updatedJsonData, (writeError) => {
          if (writeError) {
            console.error(chalk.red('Error while writing JSON file ' + err));
            return;
          }
          console.log(chalk.green('JSON file has been updated successfully!'));
        });
      } catch (err) {
        console.error(chalk.red('Error while finding data ' + err));
      }
    });
  }
};