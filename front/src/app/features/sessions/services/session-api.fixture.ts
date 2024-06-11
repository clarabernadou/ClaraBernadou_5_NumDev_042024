import { Session } from "../interfaces/session.interface";

export const FIX_SESSION_API_INFORMATIONS: Session = {
    id: 1,
    name: 'Session 1',
    description: 'This is a description',
    date: new Date(),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date()
};

export const FIX_SESSION_API_INFORMATIONS_ARR: Session[] = [
    FIX_SESSION_API_INFORMATIONS,
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