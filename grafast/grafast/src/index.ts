import "./thereCanBeOnlyOne.js";

import debugFactory from "debug";

import { exportAs, exportAsMany } from "./exportAs.js";
import { grafastPrint } from "./grafastPrint.js";
import {
  EnumPlans,
  FieldPlans,
  GrafastPlans,
  InputObjectPlans,
  InterfaceOrUnionPlans,
  makeGrafastSchema,
  ObjectPlans,
  ScalarPlans,
} from "./makeGrafastSchema.js";
import { PrintPlanGraphOptions } from "./mermaid.js";

// HACK: doing this here feels "naughty".
debugFactory.formatters.c = grafastPrint;

import { defer, Deferred } from "./deferred.js";
// Handy for debugging
import { isDev, noop } from "./dev.js";
import { OperationPlan } from "./engine/OperationPlan.js";
import {
  GrafastError,
  isGrafastError,
  isSafeError,
  SafeError,
} from "./error.js";
import { execute } from "./execute.js";
import { grafast, grafastSync } from "./grafastGraphql.js";
import { InputStep } from "./input.js";
import {
  $$bypassGraphQL,
  $$eventEmitter,
  $$extensions,
  $$idempotent,
  $$verbatim,
  ArgumentApplyPlanResolver,
  ArgumentInputPlanResolver,
  BaseEventMap,
  BaseGraphQLArguments,
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
  EnumValueApplyPlanResolver,
  EventCallback,
  EventMapKey,
  ExecutionEventEmitter,
  ExecutionEventMap,
  ExecutionExtra,
  FieldArgs,
  FieldInfo,
  FieldPlanResolver,
  GrafastArgumentConfig,
  GrafastArgumentExtensions,
  GrafastEnumValueExtensions,
  GrafastFieldConfig,
  GrafastFieldConfigArgumentMap,
  GrafastFieldExtensions,
  GrafastInputFieldConfig,
  GrafastInputFieldExtensions,
  GrafastObjectTypeExtensions,
  GrafastResultsList,
  GrafastResultStreamList,
  GrafastSubscriber,
  GrafastValuesList,
  InputObjectFieldApplyPlanResolver,
  InputObjectFieldInputPlanResolver,
  InputObjectTypeInputPlanResolver,
  JSONArray,
  JSONObject,
  JSONValue,
  NodeIdCodec,
  NodeIdHandler,
  OutputPlanForType,
  PolymorphicData,
  PromiseOrDirect,
  ScalarPlanResolver,
  StepOptimizeOptions,
  StepStreamOptions,
  TypedEventEmitter,
} from "./interfaces.js";
import { polymorphicWrap } from "./polymorphic.js";
import {
  assertListCapableStep,
  BaseStep,
  ExecutableStep,
  isExecutableStep,
  isListCapableStep,
  isModifierStep,
  isObjectLikeStep,
  isStreamableStep,
  ListCapableStep,
  ModifierStep,
  ObjectLikeStep,
  PolymorphicStep,
  StreamableStep,
  UnbatchedExecutableStep,
} from "./step.js";
import {
  __InputListStep,
  __InputObjectStep,
  __InputStaticLeafStep,
  __ItemStep,
  __ListTransformStep,
  __TrackedValueStep,
  __ValueStep,
  access,
  AccessStep,
  ActualKeyByDesiredKey,
  connection,
  ConnectionCapableStep,
  ConnectionStep,
  constant,
  ConstantStep,
  context,
  debugPlans,
  deepEval,
  DeepEvalStep,
  each,
  EdgeCapableStep,
  EdgeStep,
  error,
  ErrorStep,
  filter,
  FilterPlanMemo,
  first,
  FirstStep,
  GraphQLItemHandler,
  graphqlItemHandler,
  graphqlResolver,
  GraphQLResolverStep,
  groupBy,
  GroupByPlanMemo,
  lambda,
  LambdaStep,
  last,
  LastStep,
  list,
  listen,
  ListenStep,
  ListStep,
  listTransform,
  ListTransformItemPlanCallback,
  ListTransformOptions,
  ListTransformReduce,
  loadMany,
  LoadManyCallback,
  loadManyCallback,
  LoadManyOptions,
  LoadManySingleRecordStep,
  LoadManyStep,
  loadOne,
  LoadOneCallback,
  loadOneCallback,
  LoadOneOptions,
  LoadOneStep,
  makeMapper,
  map,
  MapStep,
  node,
  NodeStep,
  object,
  ObjectPlanMeta,
  ObjectStep,
  operationPlan,
  PageInfoCapableStep,
  partitionByIndex,
  proxy,
  ProxyStep,
  reverse,
  reverseArray,
  ReverseStep,
  setter,
  SetterCapableStep,
  SetterStep,
  specFromNodeId,
} from "./steps/index.js";
import { stringifyPayload } from "./stringifyPayload.js";
import { stripAnsi } from "./stripAnsi.js";
import { subscribe } from "./subscribe.js";
import {
  arrayOfLength,
  arraysMatch,
  getEnumValueConfig,
  GrafastInputFieldConfigMap,
  GrafastInputObjectType,
  GrafastObjectType,
  inputObjectFieldSpec,
  InputObjectTypeSpec,
  isPromiseLike,
  newGrafastFieldConfigBuilder,
  newInputObjectTypeBuilder,
  newObjectTypeBuilder,
  objectFieldSpec,
  objectSpec,
  ObjectTypeFields,
  ObjectTypeSpec,
  stepADependsOnStepB,
  stepAMayDependOnStepB,
  stepsAreInSamePhase,
} from "./utils.js";

export { isAsyncIterable } from "iterall";
export {
  __InputListStep,
  __InputObjectStep,
  __InputStaticLeafStep,
  __ItemStep,
  __ListTransformStep,
  __TrackedValueStep,
  __ValueStep,
  $$bypassGraphQL,
  $$eventEmitter,
  $$extensions,
  $$idempotent,
  $$verbatim,
  access,
  AccessStep,
  ActualKeyByDesiredKey,
  ArgumentApplyPlanResolver,
  ArgumentInputPlanResolver,
  arrayOfLength,
  arraysMatch,
  assertListCapableStep,
  BaseEventMap,
  BaseGraphQLArguments,
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
  BaseStep,
  connection,
  ConnectionCapableStep,
  ConnectionStep,
  constant,
  ConstantStep,
  context,
  debugPlans,
  deepEval,
  DeepEvalStep,
  defer,
  Deferred,
  each,
  EdgeCapableStep,
  EdgeStep,
  EnumPlans,
  EnumValueApplyPlanResolver,
  error,
  ErrorStep,
  EventCallback,
  EventMapKey,
  ExecutableStep,
  execute,
  ExecutionEventEmitter,
  ExecutionEventMap,
  ExecutionExtra,
  exportAs,
  exportAsMany,
  FieldArgs,
  FieldInfo,
  FieldPlanResolver,
  FieldPlans,
  filter,
  FilterPlanMemo,
  first,
  FirstStep,
  getEnumValueConfig,
  grafast,
  GrafastArgumentConfig,
  GrafastArgumentExtensions,
  GrafastEnumValueExtensions,
  GrafastError,
  GrafastFieldConfig,
  GrafastFieldConfigArgumentMap,
  GrafastFieldExtensions,
  grafast as grafastGraphql,
  grafastSync as grafastGraphqlSync,
  GrafastInputFieldConfig,
  GrafastInputFieldConfigMap,
  GrafastInputFieldExtensions,
  GrafastInputObjectType,
  GrafastObjectType,
  GrafastObjectTypeExtensions,
  GrafastPlans,
  grafastPrint,
  GrafastResultsList,
  GrafastResultStreamList,
  GrafastSubscriber,
  grafastSync,
  GrafastValuesList,
  GraphQLItemHandler,
  graphqlItemHandler,
  graphqlResolver,
  GraphQLResolverStep,
  groupBy,
  GroupByPlanMemo,
  InputObjectFieldApplyPlanResolver,
  InputObjectFieldInputPlanResolver,
  inputObjectFieldSpec,
  InputObjectPlans,
  InputObjectTypeInputPlanResolver,
  InputObjectTypeSpec,
  InputStep,
  InterfaceOrUnionPlans,
  isDev,
  isExecutableStep,
  isGrafastError,
  isListCapableStep,
  isModifierStep,
  isObjectLikeStep,
  isPromiseLike,
  isSafeError,
  isStreamableStep,
  JSONArray,
  JSONObject,
  JSONValue,
  lambda,
  LambdaStep,
  last,
  LastStep,
  list,
  ListCapableStep,
  listen,
  ListenStep,
  ListStep,
  listTransform,
  ListTransformItemPlanCallback,
  ListTransformOptions,
  ListTransformReduce,
  loadMany,
  LoadManyCallback,
  loadManyCallback,
  LoadManyOptions,
  LoadManySingleRecordStep,
  LoadManyStep,
  loadOne,
  LoadOneCallback,
  loadOneCallback,
  LoadOneOptions,
  LoadOneStep,
  makeGrafastSchema,
  makeMapper,
  map,
  MapStep,
  ModifierStep,
  newGrafastFieldConfigBuilder,
  newInputObjectTypeBuilder,
  newObjectTypeBuilder,
  node,
  NodeIdCodec,
  NodeIdHandler,
  NodeStep,
  noop,
  object,
  objectFieldSpec,
  ObjectLikeStep,
  ObjectPlanMeta,
  ObjectPlans,
  objectSpec,
  ObjectStep,
  ObjectTypeFields,
  ObjectTypeSpec,
  OperationPlan,
  operationPlan,
  OutputPlanForType,
  PageInfoCapableStep,
  partitionByIndex,
  PolymorphicData,
  PolymorphicStep,
  polymorphicWrap,
  PrintPlanGraphOptions,
  PromiseOrDirect,
  proxy,
  ProxyStep,
  reverse,
  reverseArray,
  ReverseStep,
  SafeError,
  ScalarPlanResolver,
  ScalarPlans,
  setter,
  SetterCapableStep,
  SetterStep,
  specFromNodeId,
  stepADependsOnStepB,
  stepAMayDependOnStepB,
  StepOptimizeOptions,
  stepsAreInSamePhase,
  StepStreamOptions,
  StreamableStep,
  stringifyPayload,
  stripAnsi,
  subscribe,
  TypedEventEmitter,
  UnbatchedExecutableStep,
};

exportAsMany("grafast", {
  exportAs,
  exportAsMany,
  grafastPrint,
  makeGrafastSchema,
  OperationPlan,
  defer,
  execute,
  grafast,
  grafastSync,
  subscribe,
  __InputListStep,
  stringifyPayload,
  __InputObjectStep,
  __InputStaticLeafStep,
  assertListCapableStep,
  isExecutableStep,
  isListCapableStep,
  isModifierStep,
  isObjectLikeStep,
  isStreamableStep,
  __ItemStep,
  __ListTransformStep,
  __TrackedValueStep,
  __ValueStep,
  access,
  AccessStep,
  operationPlan,
  connection,
  ConnectionStep,
  constant,
  ConstantStep,
  context,
  isGrafastError,
  debugPlans,
  each,
  error,
  ErrorStep,
  groupBy,
  filter,
  partitionByIndex,
  listTransform,
  first,
  node,
  specFromNodeId,
  proxy,
  deepEval,
  DeepEvalStep,
  ProxyStep,
  graphqlResolver,
  GraphQLResolverStep,
  GraphQLItemHandler,
  graphqlItemHandler,
  NodeStep,
  FirstStep,
  last,
  LastStep,
  lambda,
  LambdaStep,
  list,
  ListStep,
  makeMapper,
  map,
  MapStep,
  object,
  ObjectStep,
  reverse,
  reverseArray,
  ReverseStep,
  setter,
  SetterStep,
  listen,
  ListenStep,
  polymorphicWrap,
  stripAnsi,
  arraysMatch,
  inputObjectFieldSpec,
  newGrafastFieldConfigBuilder,
  newInputObjectTypeBuilder,
  newObjectTypeBuilder,
  objectFieldSpec,
  objectSpec,
  arrayOfLength,
  stepADependsOnStepB,
  stepAMayDependOnStepB,
  stepsAreInSamePhase,
  isPromiseLike,
  isDev,
  noop,
  getEnumValueConfig,
  loadMany,
  loadManyCallback,
  LoadManySingleRecordStep,
  LoadManyStep,
  loadOne,
  loadOneCallback,
  LoadOneStep,
});

export { hookArgs } from "./args.js";
