import { timestamp, uid, event, params, common } from "../utils/store-config";
import { UPDATE_TABLE, RELOAD_TABLE } from "./mutation-types";
const state = {
  [timestamp]: +new Date(),
  [uid]: 0,
  [event]: "update",
  [params]: undefined
};

const mutations = {
  [UPDATE_TABLE](state, _params) {
    common(state, _params);
    state[event] = "update";
  },
  [RELOAD_TABLE](state, _params) {
    common(state, _params);
    state[event] = "doLayout";
  }
};

export default {
  state,
  mutations
};
