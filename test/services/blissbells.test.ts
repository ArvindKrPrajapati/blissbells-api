import assert from 'assert';
import app from '../../src/app';

describe('\'blissbells\' service', () => {
  it('registered the service', () => {
    const service = app.service('blissbells');

    assert.ok(service, 'Registered the service');
  });
});
