import Config from '../models/config.js';

/* Update controller with the given user and appName
If it doesn't exist, create one */
export function createOne(request, response) {
  const oldConfig = { user: request.body.user, appName: request.body.data.appName };
  const newAttributes = {
    'data.serverType': request.body.data.serverType,
    'data.appName': request.body.data.appName,
    'data.serverSettings.port': request.body.data.serverSettings.port,
    'data.routers': request.body.data.routers,
    'data.github.repoName': request.body.data.github.repoName,
    'data.github.privacy': request.body.data.github.privacy,
    'data.github.description': request.body.data.github.description,
  };

  Config.update(
    oldConfig,
    newAttributes,
    { upsert: true },
    (err, result) => {
      if (err) { return response.status(500).json(err); }
      return response.send(result);
    }
  );
}
