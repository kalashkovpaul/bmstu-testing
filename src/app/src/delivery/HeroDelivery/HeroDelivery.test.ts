import IHeroRepository from "@/repository/HeroRepository/IHeroRepository";
import HeroDelivery from "./HeroDelivery";
import { masterChain, statuses } from "@/consts";
import logger from "@/logger";
import { getActionChainData, setHeroBirthdateData, setHeroLastnameData, setHeroNameData, setHeroPhoneData, setHeroPhotoData, setHeroResumeData, setHeroSurnameData } from "@/types";
jest.deepUnmock("./HeroDelivery");

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

const getActionChainPositive = {
    status: 200,
    actionChain: '1234'
};

const getActionChainNegative = {
    status: statuses.SERVER_ERROR,
    actionChain: masterChain,
};

const setHeroNamePositive = {
    status: statuses.SUCCESS,
};

const setHeroNameNegative = {
    status: statuses.SERVER_ERROR,
};

const setHeroSurnamePositive = {
    status: statuses.SUCCESS,
};

const setHeroSurnameNegative = {
    status: statuses.SERVER_ERROR,
};

const setHeroLastnamePositive = {
    status: statuses.SUCCESS,
};

const setHeroLastnameNegative = {
    status: statuses.SERVER_ERROR,
};

const setHeroBirthdatePositive = {
    status: statuses.SUCCESS,
};

const setHeroBirthdateNegative = {
    status: statuses.SERVER_ERROR,
};

const setHeroPhonePositive = {
    status: statuses.SUCCESS,
};

const setHeroPhoneNegative = {
    status: statuses.SERVER_ERROR,
};

const setHeroPhotoPositive = {
    status: statuses.SUCCESS,
    imagePath: "abrakadabra",
};

const setHeroPhotoNegative = {
    status: statuses.SERVER_ERROR,
    imagePath: "",
};

const setHeroResumePositive = {
    status: statuses.SUCCESS,
    filePath: "abrakadabra",
};

const setHeroResumeNegative = {
    status: statuses.SERVER_ERROR,
    filePath: "",
};

const heroRepository = {
    getActionChain: async () => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<getActionChainData>((resolve, reject) => {
            resolve(getActionChainPositive);
        });
    },

    setHeroName: async (heroName: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setHeroNameData>((resolve, reject) => {
            resolve(setHeroNamePositive);
        });
    },

    setHeroSurname: async (heroSurname: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setHeroSurnameData>((resolve, reject) => {
            resolve(setHeroSurnamePositive);
        });
    },

    setHeroLastname: async (heroLastname: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setHeroLastnameData>((resolve, reject) => {
            resolve(setHeroLastnamePositive);
        });
    },

    setHeroBirthdate: async (birthdate: Date) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setHeroBirthdateData>((resolve, reject) => {
            resolve(setHeroBirthdatePositive);
        });
    },

    setHeroPhone: async (phone: string) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setHeroPhoneData>((resolve, reject) => {
            resolve(setHeroPhonePositive);
        });
    },

    setHeroPhoto: async (photo: File) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setHeroPhotoData>((resolve, reject) => {
            resolve(setHeroPhotoPositive);
        });
    },

    setHeroResume: async (resume: File) => {
        if (isNegative) throw new Error(errorMessage);
        return new Promise<setHeroResumeData>((resolve, reject) => {
            resolve(setHeroResumePositive);
        });
    },
};


// лондонские тесты
describe('HeroDelivery test', () => {
    const heroDelivery = new HeroDelivery(heroRepository as IHeroRepository);
    // jest.spyOn(logger, 'error').mockImplementation((a: any) => {});
    // jest.spyOn(logger, 'info').mockImplementation((a: any) => {});

    test('getActionChain positive', async () => {
        isNegative = false;
        const result = await heroDelivery.getActionChain();
        expect(result).toEqual(getActionChainPositive);
    });

    test('getActionChain negative', async () => {
        isNegative = true;
        const result = await heroDelivery.getActionChain();
        expect(result).toEqual(getActionChainNegative);
    });

    test('setName positive', async () => {
        isNegative = false;
        const result = await heroDelivery.setName('abrakadabra');
        expect(result).toEqual(setHeroNamePositive);
    });

    test('setName negative', async () => {
        isNegative = true;
        const result = await heroDelivery.setName('abrakadabra');
        expect(result).toEqual(setHeroNameNegative);
    });

    test('setSurname positive', async () => {
        isNegative = false;
        const result = await heroDelivery.setSurname('abrakadabra');
        expect(result).toEqual(setHeroSurnamePositive);
    });

    test('setSurname negative', async () => {
        isNegative = true;
        const result = await heroDelivery.setSurname('abrakadabra');
        expect(result).toEqual(setHeroSurnameNegative);
    });

    test('setLastname positive', async () => {
        isNegative = false;
        const result = await heroDelivery.setLastname('abrakadabra');
        expect(result).toEqual(setHeroLastnamePositive);
    });

    test('setLastname negative', async () => {
        isNegative = true;
        const result = await heroDelivery.setLastname('abrakadabra');
        expect(result).toEqual(setHeroLastnameNegative);
    });

    test('setBirthdate positive', async () => {
        isNegative = false;
        const result = await heroDelivery.setBirthdate(new Date());
        expect(result).toEqual(setHeroBirthdatePositive);
    });

    test('setBirthdate negative', async () => {
        isNegative = true;
        const result = await heroDelivery.setBirthdate(new Date());
        expect(result).toEqual(setHeroBirthdateNegative);
    });

    test('setPhone positive', async () => {
        isNegative = false;
        const result = await heroDelivery.setPhone('abrakadabra');
        expect(result).toEqual(setHeroPhonePositive);
    });

    test('setPhone negative', async () => {
        isNegative = true;
        const result = await heroDelivery.setPhone('abrakadabra');
        expect(result).toEqual(setHeroPhoneNegative);
    });

    test('setPhoto positive', async () => {
        isNegative = false;
        const result = await heroDelivery.setPhoto({} as File);
        expect(result).toEqual(setHeroPhotoPositive);
    });

    test('setPhoto negative', async () => {
        isNegative = true;
        const result = await heroDelivery.setPhoto({} as File);
        expect(result).toEqual(setHeroPhotoNegative);
    });

    test('setResume positive', async () => {
        isNegative = false;
        const result = await heroDelivery.setResume({} as File);
        expect(result).toEqual(setHeroResumePositive);
    });

    test('setResume negative', async () => {
        isNegative = true;
        const result = await heroDelivery.setResume({} as File);
        expect(result).toEqual(setHeroResumeNegative);
    });
});