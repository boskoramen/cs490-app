import { LoginPage } from '../pages/LoginPage';
import { UserPage } from '../pages/UserPage';
import { InstructorPage } from '../pages/InstructorPage';
import { RegistrationPage } from '../pages/RegistrationPage';

// TODO: Make changing pages and log in under the same action
export const actions = {
    changePage: 'changePage',
    setLoggedIn: 'setLoggedIn',
};

export const pages = {
    login: LoginPage,
    user: UserPage,
    instructor: InstructorPage,
    registration: RegistrationPage,
};

export const initialState = {
    currentPage: pages.login,
    isLoggedIn: false,
};