import path from "path";
import { faker } from "@faker-js/faker";
import { promises as fs } from "fs";

export class TestfileManager {

    static async createRandomFile(folderPath: string) {
        let fileName = faker.string.alphanumeric(5) + '.txt'
        let fileText = faker.string.alphanumeric(30)
        let filePath = path.join(folderPath, fileName)
        await fs.writeFile(filePath, fileText)
        return {
            fileName: fileName,
            filePath: filePath,
        }
    }


    
    static async deleteFile(filePath: string) {
        await fs.unlink(filePath);
    }
    
    
}
    
    