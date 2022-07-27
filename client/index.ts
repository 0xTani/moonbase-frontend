import feathers from '@feathersjs/client';
// import rest from '@feathersjs/rest-client';
// import axios from 'axios';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import { isDev } from 'src/Types/helpers';

const feathersClient = feathers();
// localhost in dev, api url in prod
// const restClient = isDev ? rest('http://localhost:3030') : rest(process.env.REACT_APP_API_URL);
// feathersClient.configure(restClient.axios(axios));

const socket = isDev ? io('http://localhost:3030') : io(process.env.REACT_APP_API_URL!);
feathersClient.configure(socketio(socket));

feathersClient.configure(feathers.authentication());
feathersClient.configure(auth({ storageKey: 'feathers-react-jwt' }));

export default feathersClient;
