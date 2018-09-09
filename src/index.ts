#!/usr/bin/env node
import * as commander from 'commander';

import * as actions from './actions';

type Action = (program: commander.Command) => commander.Command;
type Actions = IndexObject<Action>;

Object.keys(actions).forEach(key => (actions as Actions)[key](commander));

commander.parse(process.argv);
