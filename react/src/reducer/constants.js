import { LoginPage } from '../pages/LoginPage';
import { UserPage } from '../pages/UserPage';
import { InstructorPage } from '../pages/InstructorPage';
import { RegistrationPage } from '../pages/RegistrationPage';

export const actions = {
    change_page: 'change_page',
    set_logged_in: 'set_logged_in',
};

export const pages = {
    login: LoginPage,
    user: UserPage,
    instructor: InstructorPage,
    registration: RegistrationPage,
};

export const initialState = {
    current_page: pages.login,
    isLoggedIn: false,
};