/**
 *
 * @ai-apps/angular v2.155.1 | utils.d.ts
 *
 * Copyright 2014, 2025 IBM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * RuleBuilder helper function to traverse the tree and find the indicies needed to create
 * a path to the given rule ID
 *
 * @param {array} arr The RuleBuilder tree rules array
 * @param {string} id The id of the rule to find in the tree
 * @param {array} parentIndex an array of ints storing the parent indices in the path
 */
export declare const findRulePathById: (arr: any, id: any, parentIndex?: any[]) => any;
/**
 * RuleBuilder helper function to filter a rule out of the tree by ID
 *
 * @param {array} arr The RuleBuilder tree rules
 * @param {string} id The ID of the rule to filter out of the tree
 */
export declare const filterRulesById: (arr: any, id: any) => any;
/**
 * RuleBuilder helper function to insert a new rule into the tree after the given path
 *
 * @param {array} arr RuleBuilder tree rules
 * @param {object} rule The rule object to be inserted into the tree
 * @param {array} path The array of indicies making a path to the location after which the rule should be inserted
 */
export declare const insertRuleAfterPath: (arr: any, rule: any, path: any) => any;
/**
 * Generates a new empty rule
 */
export declare const generateRule: () => {
    id: string;
    columnId: string;
    operand: string;
    value: string;
};
/**
 * Generates a new rule group with one default rule
 */
export declare const generateRuleGroup: () => {
    id: string;
    groupLogic: string;
    rules: {
        id: string;
        columnId: string;
        operand: string;
        value: string;
    }[];
};
