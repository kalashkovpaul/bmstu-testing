import ISkillRepository from "@/repository/SkillRepository/ISkillRepository";
import { statuses } from "@/consts";
import logger from "@/logger";
import { createSkillData, deleteSkillData, getSkillData, setSkillCompetenceData, setSkillDescriptionData, setSkillEndDateData, setSkillImageData, setSkillLinkData, setSkillNameData, setSkillStartDateData, skillNames } from "@/types";
import SkillDelivery from "./SkillDelivery";
jest.deepUnmock("./SkillDelivery");


// const error = jest.fn().mockImplementation((message: any) => {});
// const info = jest.fn().mockImplementation((message: any) => {});

// jest.mock('../logger', () => {
//     return {
//         __esModule: true,
//         logger: {
//             error,
//             info,
//         }
//     }
// });

let isNegative = true;
const errorMessage = "abracadabra";

const getSkillNamesPositive = {
    names: ['a', 'b', 'c'],
};

const getSkillNamesNegative = {
    names: [],
};

const getSkillPositive = {
    status: statuses.SUCCESS,
    skill: {
        name: "abra",
        description: "kadabra",
        competence: 8,
        startDate: new Date(),
        endDate: new Date(),
        link: ""
    }
};

const getSkillNegative = {
    status: statuses.NOT_FOUND,
    skill: {
        name: "",
        description: "",
        competence: 0,
        link: ""
    }
};

const createSkillPositive = {
    status: statuses.SUCCESS,
    skillName: 'abrakadabra',
};

const createSkillNegative = {
    status: statuses.SERVER_ERROR,
    skillName: '',
};

const deleteSkillPositive = {
    status: statuses.SUCCESS,
};

const deleteSkillNegative = {
    status: statuses.SERVER_ERROR,
};

const setSkillNamePositive = {
    status: statuses.SUCCESS,
    skillName: 'abrakadabra',
};

const setSkillNameNegative = {
    status: statuses.SERVER_ERROR,
    skillName: '',
};

const setSkillDescriptionPositive = {
    status: statuses.SUCCESS,
};

const setSkillDescriptionNegative = {
    status: statuses.SERVER_ERROR,
};

const setSkillCompetencePositive = {
    status: statuses.SUCCESS,
};

const setSkillCompetenceNegative = {
    status: statuses.SERVER_ERROR,
};

const setSkillStartDatePositive = {
    status: statuses.SUCCESS,
};

const setSkillStartDateNegative = {
    status: statuses.SERVER_ERROR,
};

const setSkillEndDatePositive = {
    status: statuses.SUCCESS,
};

const setSkillEndDateNegative = {
    status: statuses.SERVER_ERROR,
};

const setSkillLinkPositive = {
    status: statuses.SUCCESS,
};

const setSkillLinkNegative = {
    status: statuses.SERVER_ERROR,
};

const setSkillImagePositive = {
    status: statuses.SUCCESS,
    imagePath: "abrakadabra",
};

const setSkillImageNegative = {
    status: statuses.SERVER_ERROR,
    imagePath: "",
};

const SkillRepository = {
    getSkillNames: async (skillName: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<skillNames>((resolve, reject) => {
            resolve(getSkillNamesPositive);
        });
    },

    getSkill: async (skillName: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<getSkillData>((resolve, reject) => {
            resolve(getSkillPositive);
        });
    },

    createSkill: async (skillName: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<createSkillData>((resolve, reject) => {
            resolve(createSkillPositive);
        });
    },

    deleteSkill: async (skillName: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<deleteSkillData>((resolve, reject) => {
            resolve(deleteSkillPositive);
        });
    },

    setSkillName: async (skillName: string, newSkillName: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setSkillNameData>((resolve, reject) => {
            resolve(setSkillNamePositive);
        });
    },

    setSkillDescription: async (skillName: string, newDescription: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setSkillDescriptionData>((resolve, reject) => {
            resolve(setSkillDescriptionPositive);
        });
    },

    setSkillCompetence: async (skillName: string, newCompetense: number) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setSkillCompetenceData>((resolve, reject) => {
            resolve(setSkillCompetencePositive);
        });
    },

    setSkillStartDate: async (skillName: string, newStartDate: Date) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setSkillStartDateData>((resolve, reject) => {
            resolve(setSkillStartDatePositive);
        });
    },

    setSkillEndDate: async (skillName: string, newEndDate: Date) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setSkillEndDateData>((resolve, reject) => {
            resolve(setSkillEndDatePositive);
        });
    },

    setSkillLink: async (skillName: string, newLink: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setSkillLinkData>((resolve, reject) => {
            resolve(setSkillLinkPositive);
        });
    },

    setSkillImage: async (skillName: string, newImage: File) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setSkillImageData>((resolve, reject) => {
            resolve(setSkillImagePositive);
        });
    },

};


describe('SkillDelivery test', () => {
    const skillDelivery = new SkillDelivery(SkillRepository as ISkillRepository);

    test('getSkillNames positive', async () => {
        isNegative = false;
        const result = await skillDelivery.getSkillNames();

        expect(result).toEqual(getSkillNamesPositive);
    });

    test('getSkillNames negative', async () => {
        isNegative = true;
        const result = await skillDelivery.getSkillNames()
        expect(result).toEqual(getSkillNamesNegative);
    });

    test('getSkill positive', async () => {
        isNegative = false;
        const result = await skillDelivery.getSkill('abrakadabra');
        expect(result).toEqual(getSkillPositive);
    });

    test('getSkill negative', async () => {
        isNegative = true;
        let result = await skillDelivery.getSkill('abrakadabra') as any;
        delete result.skill.startDate
        delete result.skill.endDate;
        expect(result).toEqual(getSkillNegative);
    });

    test('createSkill positive', async () => {
        isNegative = false;
        const result = await skillDelivery.createSkill('abrakadabra');
        expect(result).toEqual(createSkillPositive);
    });

    test('createSkill negative', async () => {
        isNegative = true;
        const result = await skillDelivery.createSkill('abrakadabra');
        expect(result).toEqual(createSkillNegative);
    });

    test('deleteSkill positive', async () => {
        isNegative = false;
        const result = await skillDelivery.deleteSkill('abrakadabra');
        expect(result).toEqual(deleteSkillPositive);
    });

    test('deleteSkill negative', async () => {
        isNegative = true;
        const result = await skillDelivery.deleteSkill('abrakadabra');
        expect(result).toEqual(deleteSkillNegative);
    });

    test('setSkillName positive', async () => {
        isNegative = false;
        const result = await skillDelivery.setSkillName('abrakadabra', 'focus');
        expect(result).toEqual(setSkillNamePositive);
    });

    test('setSkillName negative', async () => {
        isNegative = true;
        const result = await skillDelivery.setSkillName('abrakadabra', 'focus');
        expect(result).toEqual(setSkillNameNegative);
    });

    test('setSkillDescription positive', async () => {
        isNegative = false;
        const result = await skillDelivery.setDescription('abrakadabra', 'focus');
        expect(result).toEqual(setSkillDescriptionPositive);
    });

    test('setSkillDescription negative', async () => {
        isNegative = true;
        const result = await skillDelivery.setDescription('abrakadabra', 'focus');
        expect(result).toEqual(setSkillDescriptionNegative);
    });

    test('setSkillCompetence positive', async () => {
        isNegative = false;
        const result = await skillDelivery.setCompetence('abrakadabra', 5);
        expect(result).toEqual(setSkillCompetencePositive);
    });

    test('setSkillCompetence negative', async () => {
        isNegative = true;
        const result = await skillDelivery.setCompetence('abrakadabra', 5);
        expect(result).toEqual(setSkillCompetenceNegative);
    });

    test('setSkillStartDate positive', async () => {
        isNegative = false;
        const result = await skillDelivery.setStartDate('abrakadabra', new Date());
        expect(result).toEqual(setSkillStartDatePositive);
    });

    test('setSkillStartDate negative', async () => {
        isNegative = true;
        const result = await skillDelivery.setStartDate('abrakadabra', new Date());
        expect(result).toEqual(setSkillStartDateNegative);
    });

    test('setSkillEndDate positive', async () => {
        isNegative = false;
        const result = await skillDelivery.setEndDate('abrakadabra', new Date());
        expect(result).toEqual(setSkillEndDatePositive);
    });

    test('setSkillEndDate negative', async () => {
        isNegative = true;
        const result = await skillDelivery.setEndDate('abrakadabra', new Date());
        expect(result).toEqual(setSkillEndDateNegative);
    });

    test('setSkillLink positive', async () => {
        isNegative = false;
        const result = await skillDelivery.setLink('abrakadabra', 'focus');
        expect(result).toEqual(setSkillLinkPositive);
    });

    test('setSkillLink negative', async () => {
        isNegative = true;
        const result = await skillDelivery.setLink('abrakadabra', 'focus');
        expect(result).toEqual(setSkillLinkNegative);
    });

    test('setSkillImage positive', async () => {
        isNegative = false;
        const result = await skillDelivery.setImage('abrakadabra', {} as File);
        expect(result).toEqual(setSkillImagePositive);
    });

    test('setSkillImage negative', async () => {
        isNegative = true;
        const result = await skillDelivery.setImage('abrakadabra', {} as File);
        expect(result).toEqual(setSkillImageNegative);
    });
});