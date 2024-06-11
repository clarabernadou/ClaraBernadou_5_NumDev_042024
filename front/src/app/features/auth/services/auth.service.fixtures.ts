export const FIX_REGISTER_USER_INFORMATIONS = {
    email: 'toto@test.fr',
    firstName: 'Toto',
    lastName: 'Toto',
    password: 'Toto1234',
};

export const FIX_REGISTER_USER_INFORMATIONS_WITH_INVALID_EMAIL = {
    email: 'tototest.fr',
    firstName: 'Toto',
    lastName: 'Toto',
    password: 'Toto1234',
};

export const FIX_LOGIN_USER_INFORMATIONS = {
    email: 'toto@test.fr',
    password: 'Toto1234',
}

export const FIX_LOGIN_USER_INFORMATIONS_WITH_BAD_PASSWORD = {
    email: 'toto@test.fr',
    password: 'Toto',
}

export const FIX_LOGIN_USER_INFORMATIONS_WITH_BAD_EMAIL = {
    email: 'tot@test.fr',
    password: 'Toto1234',
}