import { Session } from "../interfaces/session.interface";

export const sessionApiFixture: Session = {
    id: 1,
    name: 'Session 1',
    description: 'This is a description',
    date: new Date(),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date()
};

export const sessionApiFixtureList: Session[] = [
    sessionApiFixture,
    {
        id: 2,
        name: 'Session 2',
        description: 'This is a description',
        date: new Date(),
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];