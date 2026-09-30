export interface InterestUser {
  id: string;
  name: string;
  email: string;
}

export interface InterestGroup {
  _id: string;
  users: InterestUser[];
}

export interface GroupedInterestsResponse {
  success: boolean;
  message: string;
  data: InterestGroup[];
}