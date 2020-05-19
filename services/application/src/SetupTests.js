import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { enableFetchMocks } from 'jest-fetch-mock'


enableFetchMocks();

configure({ adapter: new Adapter() });


// Fetch Mocks
fetch.mockResponse(JSON.stringify(
    {
        playerTag: "john12",
        playerNickName: "John",
        verified: true,
        totalUsers: 1,
        guest: false
    }
));