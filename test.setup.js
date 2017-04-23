import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import 'babel-polyfill';

chai.use(sinonChai);

global.expect = expect;
global.sinon = sinon;
