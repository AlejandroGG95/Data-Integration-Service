"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEqualPlan(jobA, jobB) {
    const nextA = new Date(jobA.next_);
    const nextB = new Date(jobB.next_);
    if (nextA.getTime() !== nextB.getTime()) {
        return false;
    }
    else if (jobA.frecuencia.time_n !== jobB.frecuencia.time_n) {
        return false;
    }
    else if (jobA.frecuencia.time_u !== jobB.frecuencia.time_u) {
        return false;
    }
    else if (jobA.frecuencia.time_u === 'week') {
        if (JSON.stringify(jobA.frecuencia.time_data.repeat_on) !== JSON.stringify(jobB.frecuencia.time_data.repeat_on)) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}
exports.isEqualPlan = isEqualPlan;
//# sourceMappingURL=plan.utils.js.map