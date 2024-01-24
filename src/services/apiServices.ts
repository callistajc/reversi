import { State } from "../types/gameTypes";
import { cloneState } from "../utils/commonUtils";
import CryptoJS from "crypto-js";

const endpoint = "https://fi3si9acoa.execute-api.ap-southeast-1.amazonaws.com/";
const key = "A9v8taNW0TAIe3D1";

export async function storeData(data: State, id: string) {
    const clonedData = cloneState(data);
    if (id === "") {
        id = crypto.randomUUID();
        clonedData.id = id;
    }
    const encryptedData = encrypt(clonedData);
    const requestBody = {
        id,
        data: encryptedData,
    }

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
    
        if (response.ok) {
            console.log("Data stored successfully!");
            const data = await response.json();

            return data ? data : "";
        } else {
            throw new Error("Failed to store data.");
        }
    } catch(error) {
        console.log("Error: ", error);
        return "";
    }
}

export async function retrieveData(id: string) {
    const endpointWithParams = endpoint + `?id=${id}`;

    try {
        const response = await fetch(endpointWithParams, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.error !== undefined) {
                return "Unique ID can't be found.";
            } else {
                const decryptedData = decrypt(data.data);
                return JSON.parse(decryptedData);
            }
        } else {
            throw new Error("Failed to retrieve data.");
        }
    } catch(error) {
        console.log("Error: ", error);
        return "Something went wrong.";
    }
}

function encrypt(data: State) {
    const clonedData = cloneState(data);

    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(clonedData), key);
    return encryptedData.toString();
}

function decrypt(encryptedText: string) {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedText;
}
