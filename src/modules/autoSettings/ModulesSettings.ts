import { Model } from "mongoose";
import { ISchema } from "./index.js";

export default new (class AutoSettings {
    settingsSchemas: { [key: string]: { schema: ISchema, model: Model<any>, filter?: object }} = {}

    addSettingWithSchema(name: string, schema: ISchema, model: Model<any>, filter?: object) {
        if(this.settingsSchemas[name]) throw Error(`Конфликтующие модули. Имя настройки: ${name}`);

        this.settingsSchemas[name] = { schema, model, filter };
    }
})();