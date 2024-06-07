import { SessionInformation } from "../interfaces/sessionInformation.interface"

export const UserSessionInformation: SessionInformation = {
    token: '98a4b7e2-12c3-4d56-a789-0e1f2a3b4c5d',
    type: 'string',
    id: 1,
    username: 'Toto',
    firstName: 'Toto',
    lastName: 'Toto',
    admin: false,
}

export const UserSessionInformationWithError: SessionInformation = {
  token: '98a4b7e2-12c3-4d56-a789-0e1f2a3b4c5d',
  type: 'string',
  id: 1,
  username: 'Tota',
  firstName: 'Toto',
  lastName: 'Toto',
  admin: false,
}

export const UserSessionsInformations: SessionInformation[] = [
  {
    token: '98a4b7e2-12c3-4d56-a789-0e1f2a3b4c5d',
    type: 'string',
    id: 1,
    username: 'Toto',
    firstName: 'Toto',
    lastName: 'Toto',
    admin: false,
  },
  {
    token: '98a4b7e2-12c3-4d56-a789-0e1f2a3b4c5e',
    type: 'string',
    id: 2,
    username: 'Tata',
    firstName: 'Tata',
    lastName: 'Tata',
    admin: false,
  }
]