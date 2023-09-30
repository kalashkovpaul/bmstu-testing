import IWorkRepository from "@/repository/WorkRepository/IWorkRepository";
import { statuses } from "@/consts";
import logger from "@/logger";
import { createSkillData, createWorkData, deleteSkillData, deleteWorkData, getSkillData, getWorkData, setSkillCompetenceData, setSkillDescriptionData, setSkillEndDateData, setSkillImageData, setSkillLinkData, setSkillNameData, setSkillStartDateData, setWorkDescriptionData, setWorkHrefData, setWorkImageData, setWorkNameData, skillNames } from "@/types";
import WorkDelivery from "./WorkDelivery";
jest.deepUnmock("./WorkDelivery");

let isNegative = true;
const errorMessage = "abracadabra";

const getSkillNamesPositive = {
    names: ['a', 'b', 'c'],
};

const getSkillNamesNegative = {
    names: [],
};

const getWorksPositive = ['a', 'b', 'c'];

const getWorksNegative: string[] = [];

const getWorkPositive = {
    status: statuses.SUCCESS,
    work: {
        title: 'abra',
        description: 'kadabra',
        href: 'ulr',
        image: 'url',
    },
}

const getWorkNegative = {
    status: statuses.NOT_FOUND,
    work: {
        title: '',
        description: '',
        href: '',
        image: '',
    },
}

const createWorkPositive = {
    status: statuses.SUCCESS,
    workName: 'abrakadabra',
};

const createWorkNegative = {
    status: statuses.SERVER_ERROR,
    workName: '',
};

const deleteWorkPositive = {
    status: statuses.SUCCESS,
};

const deleteWorkNegative = {
    status: statuses.SERVER_ERROR,
};

const setWorkNamePositive = {
    status: statuses.SUCCESS,
    workName: 'abrakadabra',
};

const setWorkNameNegative = {
    status: statuses.SERVER_ERROR,
    workName: '',
};

const setWorkDescriptionPositive = {
    status: statuses.SUCCESS,
};

const setWorkDescriptionNegative = {
    status: statuses.SERVER_ERROR,
};

const setWorkHrefPositive = {
    status: statuses.SUCCESS,
};

const setWorkHrefNegative = {
    status: statuses.SERVER_ERROR,
};

const setWorkImagePositive = {
    status: statuses.SUCCESS,
    image: "abrakadabra",
};

const setWorkImageNegative = {
    status: statuses.SERVER_ERROR,
    image: "",
};

const WorkRepository = {
    getWorks: async () => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<string[]>((resolve, reject) => {
            resolve(getWorksPositive);
        });
    },

    getWork: async (workName: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<getWorkData>((resolve, reject) => {
            resolve(getWorkPositive);
        });
    },

    createWork: async (workName: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<createWorkData>((resolve, reject) => {
            resolve(createWorkPositive);
        });
    },

    deleteWork: async (workName: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<deleteWorkData>((resolve, reject) => {
            resolve(deleteWorkPositive);
        });
    },

    setWorkName: async (workName: string, newWorkName: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setWorkNameData>((resolve, reject) => {
            resolve(setWorkNamePositive);
        });
    },

    setWorkDescription: async (workName: string, newDescription: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setWorkDescriptionData>((resolve, reject) => {
            resolve(setWorkDescriptionPositive);
        });
    },

    setWorkHref: async (workName: string, newHref: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setWorkHrefData>((resolve, reject) => {
            resolve(setWorkHrefPositive);
        });
    },

    setWorkImage: async (workName: string, newImage: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setWorkImageData>((resolve, reject) => {
            resolve(setWorkImagePositive);
        });
    },

};


describe('WorkDelivery test', () => {

    const workDelivery = new WorkDelivery(WorkRepository as IWorkRepository);

    test('getWorkNames positive', async () => {
        isNegative = false;
        const result = await workDelivery.getWorkNames();
        expect(result).toEqual(getWorksPositive);
    });

    test('getWorkNames negative', async () => {
        isNegative = true;
        const result = await workDelivery.getWorkNames();
        expect(result).toEqual(getWorksNegative);
    });

    test('getWork positive', async () => {
        isNegative = false;
        const result = await workDelivery.getWork('abrakadabra');
        expect(result).toEqual(getWorkPositive);
    });

    test('getWork negative', async () => {
        isNegative = true;
        const result = await workDelivery.getWork('abrakadabra');
        expect(result).toEqual(getWorkNegative);
    });

    test('createWork positive', async () => {
        isNegative = false;
        const result = await workDelivery.createWork('abrakadabra');
        expect(result).toEqual(createWorkPositive);
    });

    test('createWork negative', async () => {
        isNegative = true;
        const result = await workDelivery.createWork('abrakadabra');
        expect(result).toEqual(createWorkNegative);
    });

    test('deleteWork positive', async () => {
        isNegative = false;
        const result = await workDelivery.deleteWork('abrakadabra');
        expect(result).toEqual(deleteWorkPositive);
    });

    test('deleteWork negative', async () => {
        isNegative = true;
        const result = await workDelivery.deleteWork('abrakadabra');
        expect(result).toEqual(deleteWorkNegative);
    });

    test('setWorkName positive', async () => {
        isNegative = false;
        const result = await workDelivery.setWorkName('abrakadabra', 'focus');
        expect(result).toEqual(setWorkNamePositive);
    });

    test('setWorkName negative', async () => {
        isNegative = true;
        const result = await workDelivery.setWorkName('abrakadabra', 'focus');
        expect(result).toEqual(setWorkNameNegative);
    });

    test('setWorkDescription positive', async () => {
        isNegative = false;
        const result = await workDelivery.setDescription('abrakadabra', 'focus');
        expect(result).toEqual(setWorkDescriptionPositive);
    });

    test('setWorkDescription negative', async () => {
        isNegative = true;
        const result = await workDelivery.setDescription('abrakadabra', 'focus');
        expect(result).toEqual(setWorkDescriptionNegative);
    });

    test('setHref positive', async () => {
        isNegative = false;
        const result = await workDelivery.setHref('abrakadabra', 'focus');
        expect(result).toEqual(setWorkHrefPositive);
    });

    test('setHref negative', async () => {
        isNegative = true;
        const result = await workDelivery.setHref('abrakadabra', 'focus');
        expect(result).toEqual(setWorkHrefNegative);
    });

    test('setSkillImage positive', async () => {
        isNegative = false;
        const result = await workDelivery.setImage('abrakadabra', 'focus');
        expect(result).toEqual(setWorkImagePositive);
    });

    test('setSkillImage negative', async () => {
        isNegative = true;
        const result = await workDelivery.setImage('abrakadabra', 'focus');
        expect(result).toEqual(setWorkImageNegative);
    });
});