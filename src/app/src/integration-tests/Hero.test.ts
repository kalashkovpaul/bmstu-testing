import pgPromise from "pg-promise";
import dbConfig from "../configs/db.config.json";
import { renewDB } from "@/utils/db";
import { events } from "@/configs/events.config";
import waitForExpect from 'wait-for-expect';
jest.deepUnmock('wait-for-expect');
waitForExpect.defaults.timeout = 4000;
waitForExpect.defaults.interval = 10;

jest.deepUnmock("pg-promise");
jest.deepUnmock("../utils/db");
jest.deepUnmock("../modules/App");

const promise = pgPromise();
const  connectionURL = `${dbConfig.dbName}://${dbConfig.user}:${dbConfig.password}@${dbConfig.url}:${dbConfig.port}/${dbConfig.test_db}`;
const test_db = promise(connectionURL);

jest.mock('../db', () => {
    return {
        __esModule: true,
        db: test_db,
    }
});

const testUser = {
    name: 'Testname',
    surname: 'Testsurname',
    lastname: 'Testlastname',
    birthdate: new Date('2000-08-21'),
    phone: '+9865755775',
};

import App from "@/modules/App";
describe('Integration tests: Hero tests', () => {
    beforeEach(async () => {
        await renewDB(test_db);
    });

    test('getHeroTest', async () => {
        const app = new App();
        const test = jest.fn();
        (app as any).bus.on(events.gotUser, test);
        (app as any).bus.emit(events.getUser);
        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith({
                status: 200,
                hero: {
                    name: 'Paul',
                    surname: 'Kalashkov',
                    lastname: 'Alexandrovich',
                    phone: '+79840491141',
                    birthdate: new Date("2003-07-02T00:00:00.000Z"),
                    photo: 'avatar.png',
                    resume: 'resume.pdf',
                }
            });
            expect(test).toHaveBeenCalledTimes(1);
        });
    }, 15000);

    test('getActionChainTest', async () => {
        const app = new App();
        await waitForExpect(() => {
            expect((app as any).administrator.actionChain).toBe('1234');
        });
    });

    test('setHero test', async () => {
        const app = new App() as any;
        const test = jest.fn();
        app.bus.on(events.heroSaveResolved, test);
        app.editor.isOwner = true;
        app.bus.emit(events.checkRights);
        app.bus.emit(events.saveHero, testUser);

        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith(200);
            expect(test).toHaveBeenCalledTimes(1);
        });

        const getUser = jest.fn();
        (app as any).bus.on(events.gotUser, getUser);
        (app as any).bus.emit(events.getUser);
        await waitForExpect(() => {
            expect(getUser).toHaveBeenCalledWith({
                status: 200,
                hero: {
                    ...testUser,
                    photo: 'avatar.png',
                    resume: 'resume.pdf',
                    birthdate: new Date('2000-08-21T00:00:00.000Z')
                }
            });
        });
    }, 15000);

    afterAll(async () => {
        await renewDB(test_db);
    });
});