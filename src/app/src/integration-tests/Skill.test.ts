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

const skillData = {
    newSkillName: 'Test Skill',
    skill: {
        name: 'New Skill',
        description: 'Test Description',
        competence: 7,
        link: 'testlink',
        startDate: new Date('2003-07-02'),
        endDate: new Date('2023-07-02'),
    }
};

import App from "@/modules/App";
describe('Integration tests: Skill tests', () => {
    beforeEach(async () => {
        await renewDB(test_db);
    });

    test('getSkillNamesTest', async () => {
        const app = new App();
        const test = jest.fn();
        (app as any).bus.on(events.gotSkillNames, test);
        (app as any).bus.emit(events.getSkillNames);
        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith({
                names: ["New Skill"],
            });
            expect(test).toHaveBeenCalledTimes(1);
        });
    });

    test('getSkillTest', async () => {
        const app = new App();
        const test = jest.fn();
        (app as any).bus.on(events.gotSkill, test);
        (app as any).bus.emit(events.getSkill, 1, {skillName: "New Skill"});
        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith(1, {
                status: 200,
                skill: {
                    competence: 10,
                    description: "Made this whole bunch of code work!",
                    enddate: new Date('2023-04-22T21:00:00.000Z'),
                    image: "",
                    link: "",
                    name: "New Skill",
                    startdate: new Date('2023-04-21T21:00:00.000Z'),
                }
            });
            expect(test).toHaveBeenCalledTimes(1);
        });
    });

    test('createSkill test', async () => {
        const app = new App() as any;
        const test = jest.fn();
        app.bus.on(events.skillCreateResolved, test);
        app.editor.isOwner = true;
        app.bus.emit(events.createSkill, 'Test skill');

        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith(200);
        });

        const getSkills = jest.fn();
        (app as any).bus.on(events.gotSkillNames, getSkills);
        (app as any).bus.emit(events.getSkillNames);
        await waitForExpect(() => {
            expect(getSkills).toHaveBeenCalledWith({
                names: ['New Skill', 'Test skill']
            });
        });
    });

    test('deleteSkill test', async () => {
        const app = new App() as any;
        const test = jest.fn();
        app.bus.on(events.skillDeleteResolved, test);
        app.editor.isOwner = true;
        app.bus.emit(events.deleteSkill, 'New Skill');

        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith(200);
        });

        const getSkills = jest.fn();
        (app as any).bus.on(events.gotSkillNames, getSkills);
        (app as any).bus.emit(events.getSkillNames);
        await waitForExpect(() => {
            expect(getSkills).toHaveBeenCalledWith({
                names: []
            });
        });
    });

    test('saveSkill test', async () => {
        const app = new App() as any;
        const test = jest.fn();
        app.bus.on(events.skillSaveResolved, test);
        app.editor.isOwner = true;
        app.bus.emit(events.saveSkill, skillData);

        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith(200);
        });

        const getSkill = jest.fn();
        (app as any).bus.on(events.gotSkill, getSkill);
        (app as any).bus.emit(events.getSkill, 1, {skillName: skillData.newSkillName});
        await waitForExpect(() => {
            expect(getSkill).toHaveBeenCalledWith(1, {
                status: 200,
                skill: {
                    name: 'Test Skill',
                    description: 'Test Description',
                    competence: 7,
                    link: 'testlink',
                    image: "",
                    enddate: new Date('2023-07-01T21:00:00.000Z'),
                    startdate: new Date('2003-07-01T20:00:00.000Z')
                }
            });
        });;
    }, 10000);

    afterAll(async () => {
        await renewDB(test_db);
    });
});