/**
 * @license MIT
 * @module mod.ts The main module for the ECS library. Serves as a barrel file for JSR.
 */

import App from "./src/app";
import { type Entity } from "./src/entity";
import Component from "./src/component";
import System from "./src/system";
import Hook from "./src/hook";
import ArchetypeTable, {
  Query,
  type ComponentConstructor,
} from "./src/archetypeTable";

export {
  type Entity,
  Component,
  System,
  Hook,
  ArchetypeTable,
  Query,
  type ComponentConstructor,
};

export default App;
