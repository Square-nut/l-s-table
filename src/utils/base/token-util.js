import * as storageUtil from "@sys/utils/base/storage-util";
import { ACCESS_TOKEN,REFRESH_TOKEN} from "@sys/store/mutation-types"

/**
 * Token工具
 */
export function getToken() {
  return storageUtil.getLocal(ACCESS_TOKEN);
}

export function setToken(token) {
  return storageUtil.setLocal(ACCESS_TOKEN, token);
}

export function removeToken() {
  return storageUtil.removeLocal(ACCESS_TOKEN);
}

export function getRefreshToken() {
  return storageUtil.getLocal(REFRESH_TOKEN);
}

export function setRefreshToken(refreshtoken) {
  return storageUtil.setLocal(REFRESH_TOKEN, refreshtoken);
}

export function removeRefreshToken() {
  return storageUtil.removeLocal(REFRESH_TOKEN);
}

export function getAllToken() {
  return {
    token: getToken(),
    refreshToken: getRefreshToken()
  };
}

export function setAllToken(token, refreshtoken) {
  setToken(token);
  setRefreshToken(refreshtoken);
}

export function removeAllToken() {
  removeToken();
  removeRefreshToken();
}
