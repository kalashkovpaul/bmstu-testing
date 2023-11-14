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

const workData = {
    work: {
        title: 'Project title 1',
        description: 'Test Description',
        href: 'testhref',
        image: 'testimage',
    }
};

import App from "@/modules/App";
describe('Integration tests: Work tests', () => {
    beforeEach(async () => {
        await renewDB(test_db);
    });

    test('getWorkNamesTest', async () => {
        const app = new App();
        const test = jest.fn();
        (app as any).bus.on(events.gotWorkNames, test);
        (app as any).bus.emit(events.getWorkNames);
        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith(["Project title 1"]);
            expect(test).toHaveBeenCalledTimes(1);
        });
    });

    test('getWorkTest', async () => {
        const app = new App();
        const test = jest.fn();
        (app as any).bus.on(events.gotWork, test);
        (app as any).bus.emit(events.getWork, 1, {workName: "Project title 1"});
        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith(1, {
                status: 200,
                work: {
                    "description": "Short description",
                    "href": "https://github.com/kalashkovpaul",
                    "image": "1",
                    "title": "Project title 1",
                }
            });
            expect(test).toHaveBeenCalledTimes(1);
        });
    });

    test('createWork test', async () => {
        const app = new App() as any;
        const test = jest.fn();
        app.bus.on(events.workCreateResolved, test);
        app.editor.isOwner = true;
        app.bus.emit(events.createWork, 'Test work');

        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith(200);
        });

        const getWorks = jest.fn();
        (app as any).bus.on(events.gotWorkNames, getWorks);
        (app as any).bus.emit(events.getWorkNames);
        await waitForExpect(() => {
            expect(getWorks).toHaveBeenCalledWith(['Project title 1', 'Test work']);
        });
    });

    test('deleteWork test', async () => {
        const app = new App() as any;
        const test = jest.fn();
        app.bus.on(events.workDeleteResolved, test);
        app.editor.isOwner = true;
        app.bus.emit(events.deleteWork, 'Project title 1');

        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith(200);
        });

        const getWorks = jest.fn();
        (app as any).bus.on(events.gotWorkNames, getWorks);
        (app as any).bus.emit(events.getWorkNames);
        await waitForExpect(() => {
            expect(getWorks).toHaveBeenCalledWith([]);
        });
    });

    test('saveWork test', async () => {
        const app = new App() as any;
        const test = jest.fn();
        app.bus.on(events.workSaveResolved, test);
        app.editor.isOwner = true;
        app.bus.emit(events.saveWork, workData);

        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith(200);
        });

        const getWork = jest.fn();
        (app as any).bus.on(events.gotWork, getWork);
        (app as any).bus.emit(events.getWork, 1, {workName: workData.work.title});
        await waitForExpect(() => {
            expect(getWork).toHaveBeenCalledWith(1, {
                status: 200,
                ...workData
            });
        });;
    });

    afterAll(async () => {
        await renewDB(test_db);
    });
});