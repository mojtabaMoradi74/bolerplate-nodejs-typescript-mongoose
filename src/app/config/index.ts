import app from './app.config';
import auth from './auth.config';
import database from './database.config';
import file from './file.config';
import helper from './helper.config';
import middleware from './middleware.config';
import aws from './aws.config';
// import user  from './user.config';

const configService = {
  app,
  auth,
  database,
  file,
  helper,
  middleware,
  aws
  // user
};
export default configService