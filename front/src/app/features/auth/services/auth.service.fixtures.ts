export const RegisterRequest = {
    email: 'toto@test.fr',
    firstName: 'Toto',
    lastName: 'Toto',
    password: 'Toto1234',
};

export const RegisterRequestWithInvalidEmail = {
    email: 'tototest.fr',
    firstName: 'Toto',
    lastName: 'Toto',
    password: 'Toto1234',
};

export const LoginRequest = {
    email: 'toto@test.fr',
    password: 'Toto1234',
}

export const LoginRequestWithBadPassword = {
    email: 'toto@test.fr',
    password: 'Toto',
}

export const LoginRequestWithBadEmail = {
    email: 'tot@test.fr',
    password: 'Toto1234',
}