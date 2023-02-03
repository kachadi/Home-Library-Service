export default class ResponseUser {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(responseUserObj) {
    this.id = responseUserObj.id;
    this.login = responseUserObj.login;
    this.version = responseUserObj.version;
    this.createdAt = responseUserObj.createdAt;
    this.updatedAt = responseUserObj.updatedAt;
  }
}
