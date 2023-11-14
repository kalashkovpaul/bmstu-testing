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
    newSkillName: 'Renamed Skill',
    skill: {
        name: 'Test skill',
        description: 'Test Description',
        competence: 7,
        link: 'testlink',
        startDate: new Date('2003-07-02'),
        endDate: new Date('2023-07-02'),
    }
};

import App from "@/modules/App";
describe('E2E tests', () => {
    beforeEach(async () => {
        await renewDB(test_db);
    });

    test('E2E skill test', async () => {
        const app = new App() as any;
        const test = jest.fn();
        app.bus.on(events.gotSkillNames, test);
        app.bus.emit(events.getSkillNames);
        await waitForExpect(() => {
            expect(test).toHaveBeenCalledWith({
                names: ["New Skill"],
            });
            expect(test).toHaveBeenCalledTimes(1);
        });

        const getSkill = jest.fn();
        app.bus.on(events.gotSkill, getSkill);
        app.bus.emit(events.getSkill, 1, {skillName: "New Skill"});
        await waitForExpect(() => {
            expect(getSkill).toHaveBeenCalledWith(1, {
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
            expect(getSkill).toHaveBeenCalledTimes(1);
        });

        const createSkill = jest.fn();
        app.bus.on(events.skillCreateResolved, createSkill);
        app.editor.isOwner = true;
        app.bus.emit(events.createSkill, 'Test skill');

        await waitForExpect(() => {
            expect(createSkill).toHaveBeenCalledWith(200);
        });

        const getSkills = jest.fn();
        (app as any).bus.on(events.gotSkillNames, getSkills);
        (app as any).bus.emit(events.getSkillNames);
        await waitForExpect(() => {
            expect(getSkills).toHaveBeenCalledWith({
                names: ['New Skill', 'Test skill']
            });
        });

        const deleteSkill = jest.fn();
        app.bus.on(events.skillDeleteResolved, deleteSkill);
        app.editor.isOwner = true;
        app.bus.emit(events.deleteSkill, 'New Skill');

        await waitForExpect(() => {
            expect(deleteSkill).toHaveBeenCalledWith(200);
        });

        const getSkillNames = jest.fn();
        app.bus.on(events.gotSkillNames, getSkillNames);
        app.bus.emit(events.getSkillNames);
        await waitForExpect(() => {
            expect(getSkillNames).toHaveBeenCalledWith({
                names: ['Test skill']
            });
        });

        const saveSkill = jest.fn();
        app.bus.on(events.skillSaveResolved, saveSkill);
        app.editor.isOwner = true;
        app.bus.emit(events.saveSkill, skillData);

        await waitForExpect(() => {
            expect(saveSkill).toHaveBeenCalledWith(200);
        });

        const getNewSkill = jest.fn();
        app.bus.on(events.gotSkill, getNewSkill);
        app.bus.emit(events.getSkill, 2, {skillName: skillData.newSkillName});
        await waitForExpect(() => {
            expect(getNewSkill).toHaveBeenCalledWith(2, {
                status: 200,
                skill: {
                    name: 'Renamed Skill',
                    description: 'Test Description',
                    competence: 7,
                    link: 'testlink',
                    image: "Test skill.png",
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