import {request} from 'supertest';
import {nock} from 'nock';
import app from '../app';

describe('GET /github/repos', () => {
    it('should return a list of repositories on success', async () => {
        const mockRepos = [{ name: 'Repo1' }, { name: 'Repo2' }];
        nock('https://api.github.com')
            .get('/users/testuser/repos')
            .reply(200, mockRepos);

        const res = await request(app).get('/github/repos?username=testuser');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRepos);
    });

    it('should return a 404 error on failure', async () => {
        const mockError = 'User not found';
        nock('https://api.github.com')
            .get('/users/testuser/repos')
            .reply(404, mockError);

        const res = await request(app).get('/github/repos?username=testuser');

        expect(res.status).toBe(404);
        expect(res.text).toBe(mockError);
    });
});
