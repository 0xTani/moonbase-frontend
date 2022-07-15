import feathers from '@feathersjs/client';
import rest from '@feathersjs/rest-client';
import auth from '@feathersjs/authentication-client';
import axios from 'axios';
import { isDev } from 'src/Types/helpers';

const feathersClient = feathers();
// localhost in dev, api url in prod
const restClient = isDev ? rest('http://localhost:3030') : rest(process.env.REACT_APP_API_URL);

feathersClient.configure(restClient.axios(axios));
feathersClient.configure(feathers.authentication());
feathersClient.configure(auth({ storageKey: 'feathers-react-jwt' }));

export default feathersClient;
