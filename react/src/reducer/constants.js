import { LoginPage } from '../pages/login';
import { UserPage } from '../pages/user';
import { AdminPage } from '../pages/admin';

export const actions = {
    change_page: 'change_page',
};

export const pages = {
    login: LoginPage,
    user: UserPage,
    admin: AdminPage,
};

export const initialState = {
    current_page: pages.login,
};