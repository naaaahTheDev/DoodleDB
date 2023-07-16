declare const _default: {
    push(filePath: string, dataArrayName: string, data: {
        [key: string]: any;
        id?: number | undefined;
    }): void;
    get(filePath: string, dataArrayName: string, searchQuery: {
        [key: string]: string | number;
    }, callback: (foundData: any[]) => void): void;
    getArray(filePath: string, dataArrayName: string, callback: (dataArray: any[]) => void): void;
    edit(filePath: string, dataArrayName: string, objectID: number, editObject: {
        [key: string]: string | number;
    }): void;
    delSet(filePath: string, dataArrayName: string, objectID: number): void;
    del(filePath: string, dataArrayName: string, objectID: number, deleteObject: object): void;
};
export default _default;
