import WorkValidator from "./WorkValidator";
import { workValues } from "@/configs/validator.config";
jest.unmock("./WorkValidator");

const cases = {
    workName: [
        {
            test: "Empty name",
            name: "",
            output: false
        },
        {
            test: `${workValues.name.min - 1} letter name`,
            name: new Array(workValues.name.min - 1).join("a"),
            output: false,
        },
        {
            test: `${workValues.name.min} letter name`,
            name: new Array(workValues.name.min).join("a") + "a",
            output: true,
        },
        {
            test: `${workValues.name.max - 1} letter name`,
            name: new Array(workValues.name.max - 1).join("a") + "a",
            output: true,
        },
        {
            test: `${workValues.name.max + 1} letter name`,
            name: new Array(workValues.name.max + 1).join("a") + "a",
            output: false,
        },
    ],
    workDescription: [
        {
            test: "Empty description",
            description: "",
            output: false
        },
        {
            test: `${workValues.description.min - 1} letter description`,
            description: new Array(workValues.description.min - 1).join("a"),
            output: false,
        },
        {
            test: `${workValues.description.min} letter description`,
            description: new Array(workValues.description.min).join("a") + "a",
            output: true,
        },
        {
            test: `${workValues.description.max - 1} letter description`,
            description: new Array(workValues.description.max - 1).join("a") + "a",
            output: true,
        },
        {
            test: `${workValues.description.max + 1} letter description`,
            description: new Array(workValues.description.max + 1).join("a") + "a",
            output: false,
        },
    ],
    workHref: [
        {
            test: "Empty href",
            href: "",
            output: true
        },
        {
            test: `${workValues.href.min + 1} work href`,
            href: new Array(workValues.href.min + 1).join("a") + "a",
            output: true,
        },
        {
            test: `${workValues.href.max - 1} work href`,
            href: new Array(workValues.href.max - 1).join("a") + "a",
            output: true,
        },
        {
            test: `${workValues.href.max + 1} work href`,
            href: new Array(workValues.href.max + 1).join("a") + "a",
            output: false,
        },
    ],
    workImage: [
        {
            test: "Empty filename",
            filename: "",
            output: false
        },
        {
            test: `${workValues.href.min + 1} work filename`,
            filename: new Array(workValues.image.min + 1).join("a") + "a",
            output: true,
        },
        {
            test: `${workValues.href.max - 1} work filename`,
            filename: new Array(workValues.image.max - 1).join("a") + "a",
            output: true,
        },
        {
            test: `${workValues.href.max + 1} work filename`,
            filename: new Array(workValues.image.max + 1).join("a") + "a",
            output: false,
        },
    ]
}

describe('WorkValidator test', () => {
    const validator = new WorkValidator();
    describe('Work name tests', () => {
        it.each(cases.workName)("$test", ({name, output}) => {
            expect(validator.checkWorkName(name)).toBe(output);
        });
    });

    describe('Work description tests', () => {
        it.each(cases.workDescription)("$test", ({description, output}) => {
            expect(validator.checkDescription(description)).toBe(output);
        });
    });

    describe('Work date tests', () => {
        it.each(cases.workHref)("$test", ({href, output}) => {
            expect(validator.checkHref(href)).toBe(output);
        });
    });

    describe('Work image tests', () => {
        it.each(cases.workImage)("$test", ({filename, output}) => {
            expect(validator.checkImage(filename)).toBe(output);
        });
    });

});

