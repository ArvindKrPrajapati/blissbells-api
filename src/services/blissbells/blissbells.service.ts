// Initializes the `blissbells` service on path `/blissbells`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Blissbells } from './blissbells.class';
import createModel from '../../models/blissbells.model';
import hooks from './blissbells.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'blissbells': Blissbells & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/blissbells', new Blissbells(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('blissbells');

  service.hooks(hooks);
}
