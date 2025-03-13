import path from "path";
import { faker } from "@faker-js/faker";
import { promises as fs } from "fs";

export class FileManager {

    /*   async createRandomFile() {
        const newFileObject= {}
        const fileText = faker.string.alphanumeric(30)
        const folderPath = path.join(__dirname, "../test-data");
        Object.assign(newFileObject, {fileName: faker.string.alphanumeric(5) + ".txt"})
        Object.assign(newFileObject, {filePath: path.join(folderPath, newFileObject.fileName)})
        Object.assign(newFileObject, {fileText: faker.string.alphanumeric(30)})
        await fs.writeFile(newFileObject.filePath, fileText);

        return newFileObject
    }

    async deleteFile(name: string) {
        const filePath = path.join(__dirname, "../test-data", name);
        await fs.unlink(filePath);
    } */

    /*fileObject: { fileName: string; filePath: string; fileText: string };

    constructor(fileName: string, filePath: string, fileText: string) {
        // Initializing the object in the constructor
        this.fileObject = {
            fileName: fileName,
            filePath: filePath,
            fileText: fileText,
        };
    }

    async createRandomFile() {
        await fs.writeFile(this.fileObject.filePath, this.fileObject.fileText);
        return {
            fileName: this.fileObject.fileName
            filePath: this.fileObject.
        }
    }

    async deleteFile(fileName: string) {
        const filePath = path.join(__dirname, "../test-data", fileName);
        await fs.unlink(filePath);
    }
    */
    fileObject: { folderPath: string; filePath: string; fileName: string, fileText: string };

    constructor(folderPath: string) {
        // Initializing the object in the constructor
        this.fileObject = {
            folderPath: folderPath,
            filePath: '',
            fileName: '',
            fileText: '',
        };
    }
    
    async createFileData() {
        this.fileObject.fileName = faker.string.alphanumeric(5) + '.txt'
        this.fileObject.fileText = faker.string.alphanumeric(30)
        this.fileObject.filePath = path.join(this.fileObject.folderPath, this.fileObject.fileName);
    }

    async createRandomFile() {
        this.createFileData()
        await fs.writeFile(this.fileObject.filePath, this.fileObject.fileText)
        return {
            fileName: this.fileObject.fileName,
            fileText: this.fileObject.fileText,
        }
    }

    async deleteFile() {
        const deleteFilePath = this.fileObject.filePath
        await fs.unlink(deleteFilePath);
    }


}
