const chai = require('chai');
const expect = chai.expect;
const data = require('../backup.json');
chai.use(require('chai-json-schema'));

const memberSchema = {
  title: 'memberSchema',
  type: 'object',
  required: [
    'ppid',
    'first_name',
    'middle_name',
    'last_name',
    'party',
    'chamber',
    'election_year',
    'district',
    'state',
    'twitter',
    'facebook',
    'website',
    'office',
    'positions' //array of bill positions (separate test)
    ],
    properties: {
      ppid: { type: 'string' },
      first_name: { type: 'string' },
      middle_name: {
        anyOf: [
          { type: 'null' },
          { type: 'string' }
        ]
       },
      last_name: { type: 'string' },
      party: { type: 'string' },
      chamber: { type: 'string' },
      election_year: { type: 'string' },
      district: {
        anyOf: [
          { type: 'null' },
          { type: 'string' }
        ]
      },
      state: { type: 'string' },
      twitter: { type: 'string' },
      facebook: { type: 'string' },
      website: { type: 'string' },
      office: { type: 'string' },
      positions: { type: 'array' }
    }
};

const positionSchema = {
  title: 'positionSchema',
  type: 'object',
  required: [
    'prefix',
    'number',
    'name',
    'question',
    'position',
    'orgs', //array of organizations (separate test)
    'year'
  ],
  properties: {
    prefix: {
      type: 'string'
    },
    number: { type: 'string' },
    name: { type: 'string' },
    question: { type: 'string' },
    position: { type: 'string' },
    orgs: { type: 'array' },
    year: { type: 'number' }
  }
};

const orgSchema = {
  title: 'orgSchema',
  type: 'object',
  required: [
    'name',
    'disposition',
    'organizationType'
  ],
  properties: {
    name: { type: 'string' },
    disposition: { type: 'string' },
    organizationType: { type: 'string' }
  }
};

function checkMember(posInArray) {
  describe(`Member: ${posInArray + 1}`, function() {
    const member = data[posInArray];
    it('has correct member data', function (){
      expect(member).to.be.jsonSchema(memberSchema);
    });
    if (member.positions.length) {
      for (let positionIndex = 0; positionIndex < member.positions.length; positionIndex++) {
        checkPositions(positionIndex, member);
      }
    }
  });
}

function checkPositions(posInArray, currentMember) {
  describe(`position: ${posInArray + 1}`, function() {
    const position = currentMember.positions[posInArray];
    it('has correct position data', function (){
      expect(position).to.be.jsonSchema(positionSchema);
    });
    if (position.orgs.length) {
      for (let orgIndex = 0; orgIndex < position.orgs.length; orgIndex++) {
        checkOrgs(orgIndex, position);
      }
    }
  });
}

function checkOrgs(posInArray, currentPosition) {
  describe(`org: ${posInArray + 1}`, function() {
    const org = currentPosition.orgs[posInArray];
    it('has correct organization data', function (){
      expect(org).to.be.jsonSchema(orgSchema);
    });
  });
}

describe('Source Data', function (){
  it('should exist', function () {
      expect(data).to.be.an('array');
  });
  for (let memberIndex = 0; memberIndex < data.length; memberIndex++) {
    checkMember(memberIndex);
  }
});

