import { join } from "path";
import { QueryFile } from "pg-promise";

function sql(file: string) {
    const fullPath = join(__dirname, file); // generating full path;
    return new QueryFile(fullPath, {minify: true});
}

export const create = sql('create.sql');
export const drop = sql('drop.sql');
export const fill = sql('fill.sql');
