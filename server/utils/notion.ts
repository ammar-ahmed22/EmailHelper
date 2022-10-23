declare var process : {
    env : {
        NOTION_INT_TOKEN : string
        NOTION_DB_ID : string,
        NOTION_V_ID : string
    }
}

import dotenv from "dotenv"
dotenv.config({path: "./config.env"});
import { Client } from "@notionhq/client";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"

const notion : Client = new Client({ auth : process.env.NOTION_INT_TOKEN });


const dbId : string = process.env.NOTION_DB_ID;


const convertToJSON = (obj : any) : any => {
    return JSON.parse(JSON.stringify(obj));
}

export const getEmails = async () : Promise<Array<any> | undefined> => {
    try {
        const { results } : QueryDatabaseResponse = await notion.databases.query({
            database_id: dbId,
        })

        
        const result = await Promise.all(results.map( async page => {
            const { properties } = convertToJSON(page);

            const title = properties.Name.title[0].plain_text;
            
            const pageId = page.id;

            // getting all blocks inside the page
            const blockResp = await notion.blocks.children.list({block_id: pageId});

            // parsing the blocks to get text
            const email = blockResp.results.map( block => {

                const parsedBlock = convertToJSON(block);

                if (parsedBlock.paragraph.text.length > 0){

                    if (parsedBlock.paragraph.text[0].plain_text !== undefined){

                        return parsedBlock.paragraph.text[0].plain_text

                    }   
                }
            }).filter( text => {
                return text !== undefined
            })

            

            return {title, email, id: pageId}

        }))

        
        return result;

    
    } catch (error) {
        console.log(error);
        return undefined
    }
}

