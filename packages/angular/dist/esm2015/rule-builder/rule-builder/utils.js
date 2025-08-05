/**
 *
 * @ai-apps/angular v2.155.1 | utils.js
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
export const findRulePathById = (arr, id, parentIndex = []) => {
    if (!Array.isArray(arr)) {
        return [];
    }
    return arr.reduce((i, rule, index) => {
        if (Array.isArray(i) && i.length > 0) {
            return i;
        }
        if (rule.id === id) {
            return [...i, ...parentIndex, index];
        }
        if (rule.rules) {
            return findRulePathById(rule.rules, id, [...parentIndex, index]);
        }
        return i;
    }, []);
};
/**
 * RuleBuilder helper function to filter a rule out of the tree by ID
 *
 * @param {array} arr The RuleBuilder tree rules
 * @param {string} id The ID of the rule to filter out of the tree
 */
export const filterRulesById = (arr, id) => {
    if (!Array.isArray(arr)) {
        return [];
    }
    return arr.reduce((carry, rule) => {
        if (rule.rules && rule.rules.length) {
            const rules = filterRulesById(rule.rules, id);
            if (rules.length) {
                return [
                    ...carry,
                    Object.assign(Object.assign({}, rule), { rules }),
                ];
            }
        }
        else if (rule.id !== id) {
            return [...carry, rule];
        }
        return carry;
    }, []);
};
/**
 * RuleBuilder helper function to insert a new rule into the tree after the given path
 *
 * @param {array} arr RuleBuilder tree rules
 * @param {object} rule The rule object to be inserted into the tree
 * @param {array} path The array of indicies making a path to the location after which the rule should be inserted
 */
export const insertRuleAfterPath = (arr, rule, path) => {
    if (!Array.isArray(path) || !Array.isArray(arr)) {
        return undefined;
    }
    const insertionPoint = path.pop() + 1;
    let current = arr;
    for (let i = 0; i < path.length; i += 1) {
        if (current[path[i]] && current[path[i]].rules) {
            current = current[path[i]].rules;
        }
        else {
            throw new Error('INVALID_PATH_FOR_RULE_TREE');
        }
    }
    current.splice(insertionPoint, 0, rule);
};
/**
 * Generates a new empty rule
 */
export const generateRule = () => {
    return {
        id: Math.random().toString(36).substring(2, 12).padStart(10, '0'),
        columnId: '',
        operand: '',
        value: '',
    };
};
/**
 * Generates a new rule group with one default rule
 */
export const generateRuleGroup = () => {
    return {
        id: Math.random().toString(36).substring(2, 12).padStart(10, '0'),
        groupLogic: 'all',
        rules: [generateRule()],
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcnVsZS1idWlsZGVyL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsV0FBVyxHQUFHLEVBQUUsRUFBRSxFQUFFO0lBQzVELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3ZCLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ25DLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNwQyxPQUFPLENBQUMsQ0FBQztTQUNWO1FBRUQsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdEM7UUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNsRTtRQUVELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQyxDQUFDO0FBRUY7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUU7SUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdkIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUNoQyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDbkMsTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDOUMsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNoQixPQUFPO29CQUNMLEdBQUcsS0FBSztvREFFSCxJQUFJLEtBQ1AsS0FBSztpQkFFUixDQUFDO2FBQ0g7U0FDRjthQUFNLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDekIsT0FBTyxDQUFDLEdBQUcsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDLENBQUM7QUFFRjs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDckQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQy9DLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0QyxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN2QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQzlDLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ2xDO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7U0FDL0M7S0FDRjtJQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUM7QUFFRjs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxHQUFHLEVBQUU7SUFDL0IsT0FBTztRQUNMLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUM7UUFDakUsUUFBUSxFQUFFLEVBQUU7UUFDWixPQUFPLEVBQUUsRUFBRTtRQUNYLEtBQUssRUFBRSxFQUFFO0tBQ1YsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO0lBQ3BDLE9BQU87UUFDTCxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDO1FBQ2pFLFVBQVUsRUFBRSxLQUFLO1FBQ2pCLEtBQUssRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3hCLENBQUM7QUFDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJ1bGVCdWlsZGVyIGhlbHBlciBmdW5jdGlvbiB0byB0cmF2ZXJzZSB0aGUgdHJlZSBhbmQgZmluZCB0aGUgaW5kaWNpZXMgbmVlZGVkIHRvIGNyZWF0ZVxuICogYSBwYXRoIHRvIHRoZSBnaXZlbiBydWxlIElEXG4gKlxuICogQHBhcmFtIHthcnJheX0gYXJyIFRoZSBSdWxlQnVpbGRlciB0cmVlIHJ1bGVzIGFycmF5XG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIGlkIG9mIHRoZSBydWxlIHRvIGZpbmQgaW4gdGhlIHRyZWVcbiAqIEBwYXJhbSB7YXJyYXl9IHBhcmVudEluZGV4IGFuIGFycmF5IG9mIGludHMgc3RvcmluZyB0aGUgcGFyZW50IGluZGljZXMgaW4gdGhlIHBhdGhcbiAqL1xuZXhwb3J0IGNvbnN0IGZpbmRSdWxlUGF0aEJ5SWQgPSAoYXJyLCBpZCwgcGFyZW50SW5kZXggPSBbXSkgPT4ge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHJldHVybiBhcnIucmVkdWNlKChpLCBydWxlLCBpbmRleCkgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGkpICYmIGkubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuXG4gICAgaWYgKHJ1bGUuaWQgPT09IGlkKSB7XG4gICAgICByZXR1cm4gWy4uLmksIC4uLnBhcmVudEluZGV4LCBpbmRleF07XG4gICAgfVxuXG4gICAgaWYgKHJ1bGUucnVsZXMpIHtcbiAgICAgIHJldHVybiBmaW5kUnVsZVBhdGhCeUlkKHJ1bGUucnVsZXMsIGlkLCBbLi4ucGFyZW50SW5kZXgsIGluZGV4XSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGk7XG4gIH0sIFtdKTtcbn07XG5cbi8qKlxuICogUnVsZUJ1aWxkZXIgaGVscGVyIGZ1bmN0aW9uIHRvIGZpbHRlciBhIHJ1bGUgb3V0IG9mIHRoZSB0cmVlIGJ5IElEXG4gKlxuICogQHBhcmFtIHthcnJheX0gYXJyIFRoZSBSdWxlQnVpbGRlciB0cmVlIHJ1bGVzXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBydWxlIHRvIGZpbHRlciBvdXQgb2YgdGhlIHRyZWVcbiAqL1xuZXhwb3J0IGNvbnN0IGZpbHRlclJ1bGVzQnlJZCA9IChhcnIsIGlkKSA9PiB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcmV0dXJuIGFyci5yZWR1Y2UoKGNhcnJ5LCBydWxlKSA9PiB7XG4gICAgaWYgKHJ1bGUucnVsZXMgJiYgcnVsZS5ydWxlcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHJ1bGVzID0gZmlsdGVyUnVsZXNCeUlkKHJ1bGUucnVsZXMsIGlkKTtcbiAgICAgIGlmIChydWxlcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAuLi5jYXJyeSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAuLi5ydWxlLFxuICAgICAgICAgICAgcnVsZXMsXG4gICAgICAgICAgfSxcbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJ1bGUuaWQgIT09IGlkKSB7XG4gICAgICByZXR1cm4gWy4uLmNhcnJ5LCBydWxlXTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2Fycnk7XG4gIH0sIFtdKTtcbn07XG5cbi8qKlxuICogUnVsZUJ1aWxkZXIgaGVscGVyIGZ1bmN0aW9uIHRvIGluc2VydCBhIG5ldyBydWxlIGludG8gdGhlIHRyZWUgYWZ0ZXIgdGhlIGdpdmVuIHBhdGhcbiAqXG4gKiBAcGFyYW0ge2FycmF5fSBhcnIgUnVsZUJ1aWxkZXIgdHJlZSBydWxlc1xuICogQHBhcmFtIHtvYmplY3R9IHJ1bGUgVGhlIHJ1bGUgb2JqZWN0IHRvIGJlIGluc2VydGVkIGludG8gdGhlIHRyZWVcbiAqIEBwYXJhbSB7YXJyYXl9IHBhdGggVGhlIGFycmF5IG9mIGluZGljaWVzIG1ha2luZyBhIHBhdGggdG8gdGhlIGxvY2F0aW9uIGFmdGVyIHdoaWNoIHRoZSBydWxlIHNob3VsZCBiZSBpbnNlcnRlZFxuICovXG5leHBvcnQgY29uc3QgaW5zZXJ0UnVsZUFmdGVyUGF0aCA9IChhcnIsIHJ1bGUsIHBhdGgpID0+IHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHBhdGgpIHx8ICFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgaW5zZXJ0aW9uUG9pbnQgPSBwYXRoLnBvcCgpICsgMTtcbiAgbGV0IGN1cnJlbnQgPSBhcnI7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChjdXJyZW50W3BhdGhbaV1dICYmIGN1cnJlbnRbcGF0aFtpXV0ucnVsZXMpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50W3BhdGhbaV1dLnJ1bGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lOVkFMSURfUEFUSF9GT1JfUlVMRV9UUkVFJyk7XG4gICAgfVxuICB9XG4gIGN1cnJlbnQuc3BsaWNlKGluc2VydGlvblBvaW50LCAwLCBydWxlKTtcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgbmV3IGVtcHR5IHJ1bGVcbiAqL1xuZXhwb3J0IGNvbnN0IGdlbmVyYXRlUnVsZSA9ICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBpZDogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDEyKS5wYWRTdGFydCgxMCwgJzAnKSxcbiAgICBjb2x1bW5JZDogJycsXG4gICAgb3BlcmFuZDogJycsXG4gICAgdmFsdWU6ICcnLFxuICB9O1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBuZXcgcnVsZSBncm91cCB3aXRoIG9uZSBkZWZhdWx0IHJ1bGVcbiAqL1xuZXhwb3J0IGNvbnN0IGdlbmVyYXRlUnVsZUdyb3VwID0gKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIGlkOiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTIpLnBhZFN0YXJ0KDEwLCAnMCcpLFxuICAgIGdyb3VwTG9naWM6ICdhbGwnLFxuICAgIHJ1bGVzOiBbZ2VuZXJhdGVSdWxlKCldLFxuICB9O1xufTtcbiJdfQ==