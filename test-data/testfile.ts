import path from "path";
import { faker } from "@faker-js/faker";
import { promises as fs } from "fs";
import { FileManager } from "../src/file-manager";
import { Page, test } from "@playwright/test";

const folderPath = path.join(__dirname, "../test-data");

const obj = new FileManager(folderPath);

let createdFileData: Object;
const tes = async () => {
    const d = await obj.createRandomFile();

    console.log(d.fileName, d.fileText);
};
tes()
// obj.deleteFile();

//console.log(obj.fileObject.fileName);
//obj.deleteFile(obj.fileObject.fileName);
